#!/usr/bin/env python3
"""Create a complete GitHub Pages upload from WellSpring's current public repository.

Runs locally with Python 3 standard library only. Preserves existing pages and forms.
Does not upload or commit anything to GitHub.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.request import Request, urlopen
from urllib.error import URLError
from io import BytesIO
import zipfile
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parent
ADDITIONS = ROOT / 'site_additions'
REPO = 'alyssawellspring208/Wellspring-Website'
OUTPUT = ROOT / 'WellSpring_Updated_Website_Ready_To_Upload.zip'
ARCHIVE_URLS = [
    f'https://codeload.github.com/{REPO}/zip/refs/heads/main',
    f'https://github.com/{REPO}/archive/refs/heads/main.zip'
]


def replace_exact(source, old, new, label):
    n = source.count(old)
    if n != 1:
        raise ValueError(f'Could not reliably update {label}. Expected one match, found {n}. The live repository may have changed.')
    return source.replace(old, new, 1)


def patch_home(home):
    home = replace_exact(home,
        '<h2>Clinician-led from day one</h2>',
        '<h2>Meet our leadership team</h2>',
        'homepage leadership heading')
    home = replace_exact(home,
        "<p>WellSpring's founder has spent more than 25 years building healthcare companies. A physician and a nurse practitioner with more than 24 years in nursing lead its clinical care.</p>",
        "<p>WellSpring's active leadership guides the company's development and clinical operations. The team is growing as our Pensacola and Birmingham locations take shape.</p>",
        'homepage leadership introduction')
    home = replace_exact(home,
        '<li class="person"><div class="mono" aria-hidden="true">RB</div><div><strong>Randy Beckham</strong><span>Founder, Chairman and CEO</span></div></li>',
        '<li class="person"><div class="mono" aria-hidden="true">RB</div><div><strong>Randy Beckham</strong><span>Strategy | Founder and CEO</span></div></li>',
        'Randy homepage role')
    home = replace_exact(home,
        '<li class="person"><div class="mono" aria-hidden="true">DR</div><div><strong>Dr. Don Reiff, MD, FACS</strong><span>Chief Medical Officer</span></div></li>',
        '<li class="person"><div class="mono" aria-hidden="true">CC</div><div><strong>Chris Cutchens</strong><span>Finance | Chief Financial Officer</span></div></li>',
        'replace Don with Chris on homepage')
    home = replace_exact(home,
        '<li class="person"><div class="mono" aria-hidden="true">LB</div><div><strong>Layla Beverly, ACNP-BC</strong><span>Director of Clinical Operations</span></div></li>',
        '<li class="person"><div class="mono" aria-hidden="true">LB</div><div><strong>Layla Beverly, ACNP-BC</strong><span>Clinical Operations | Director of Clinical Operations</span></div></li>',
        'Layla homepage role')
    home = replace_exact(home,
        '<p class="note">Local clinical specialists: Pensacola and Birmingham team coming soon.</p>',
        '<p class="note">Our broader clinical and advisory team continues to grow. Additional team members will be introduced as roles are finalized.</p>',
        'homepage growing team note')
    return home


def patch_about(about):
    about = replace_exact(about,
        '<h2>The people behind WellSpring</h2>',
        '<h2>Meet Our Leadership Team</h2>',
        'about leadership heading')
    about = replace_exact(about,
        '<p class="script">Our leadership</p>',
        '<p class="script">Leadership team</p>',
        'about section label')
    old_description = 'Meet the founder and clinical leaders of WellSpring Health &amp; Wellness.'
    if about.count(old_description) != 2:
        raise ValueError('Could not reliably update the About page descriptions.')
    about = about.replace(old_description, 'Meet the current leadership team of WellSpring Health &amp; Wellness.')
    about = replace_exact(about,
        '<p class="role">Founder, Chairman and Chief Executive Officer</p>',
        '<p class="role">Strategy | Founder, Chairman and Chief Executive Officer</p>',
        'Randy about role')
    about = replace_exact(about,
        '<p class="role">Director of Clinical Operations</p>',
        '<p class="role">Clinical Operations | Director of Clinical Operations</p>',
        'Layla about role')
    don = '''<article class="bio">
<div class="mono lg" aria-hidden="true">DR</div>
<div>
<h3>Dr. Don Reiff, MD, FACS</h3>
<p class="role">Chief Medical Officer</p>
<p>Dr. Reiff is a Fellow of the American College of Surgeons. He oversees urgent care at UAB in Birmingham and serves as medical director for an Alabama sheriff's department. He has also held several military clinical roles.</p>
</div>
</article>'''
    chris = '''<article class="bio">
<div class="mono lg" aria-hidden="true">CC</div>
<div>
<h3>Chris Cutchens, CPA</h3>
<p class="role">Finance | Chief Financial Officer</p>
<p>Chris Cutchens brings more than 20 years of experience in financial leadership, accounting, and mergers and acquisitions. At WellSpring, he oversees financial strategy and supports the systems needed for long-term operations and growth.</p>
<p>Chris has served in senior finance and operations roles at MidAmerica Administrative &amp; Retirement Solutions and Aspire Financial Services, with earlier leadership experience at Carrier Enterprise, Watsco, MarineMax, and KPMG. He holds degrees in accounting and accounting information systems from the University of South Florida and is a licensed CPA in Florida.</p>
</div>
</article>'''
    about = replace_exact(about, don, chris, 'replace Don with Chris on About')
    about = replace_exact(about,
        '<h2>Meet Our Leadership Team</h2>\n</div>\n<article class="bio">',
        '<h2>Meet Our Leadership Team</h2>\n</div>\n<p class="note" style="max-width:720px;margin:0 auto 16px;text-align:center">These are the leaders guiding WellSpring today. Our wider clinical and advisory team is expanding as the clinics develop.</p>\n<article class="bio">',
        'about leadership introduction')
    about = replace_exact(about,
        '</article>\n</div>\n</section>\n\n<section class="band on-band tight">',
        '</article>\n<p class="note" style="margin-top:30px">WellSpring is developing a broader team to support our future clinical services. Additional team members will be announced as roles are confirmed.</p>\n</div>\n</section>\n\n<section class="band on-band tight">',
        'about growing team note')
    return about


def patch_journal(journal):
    if journal.lstrip().startswith('---'):
        raise ValueError('The Journal page already contains Jekyll front matter; please review before proceeding.')
    dynamic_cards = '''<div class="wrap posts">
{% for post in site.posts %}
<article class="post-card"><a class="card-link" href="{{ post.url | relative_url }}">
{% if post.image %}<div class="photo" role="img" aria-label="{{ post.image_alt | default: post.title | escape }}" style="--img:url('{{ post.image | escape }}')"></div>{% endif %}
<p class="meta">{{ post.date | date: '%B %-d, %Y' }}{% if post.author %} | By {{ post.author | escape }}{% endif %}</p>
<h3>{{ post.title | escape }}</h3>
<p class="muted">{{ post.summary | escape }}</p>
</a></article>
{% endfor %}
<article class="post-card">'''
    journal = replace_exact(journal,
        '<div class="wrap posts"><article class="post-card">',
        dynamic_cards,
        'dynamic article cards')
    journal = replace_exact(journal,
        '<p class="lede">Research-backed notes on midlife health and longevity.</p>',
        '<p class="lede">Research and practical perspectives on long-term health and wellness.</p>',
        'Journal introduction')
    # YAML front matter makes Jekyll process the Liquid template on GitHub Pages.
    journal = '---\nlayout: null\n---\n' + journal
    return journal


def patch_js(js):
    return replace_exact(js,
        "DR: { filename: 'team-don.webp', name: 'Dr. Don Reiff' },",
        "CC: { filename: 'team-chris.webp', name: 'Chris Cutchens' },",
        'portrait mapping')


def patch_site(site):
    for path, func in [
        ('index.html', patch_home),
        ('about/index.html', patch_about),
        ('journal/index.html', patch_journal),
        ('assets/js/main.js', patch_js),
    ]:
        file = site / path
        original = file.read_text(encoding='utf-8')
        edited = func(original)
        file.write_text(edited, encoding='utf-8')
        print('Updated:', path)
    # Add the new Jekyll journal, article editor settings, and Chris's photograph.
    for src in ADDITIONS.rglob('*'):
        if not src.is_file():
            continue
        relative = src.relative_to(ADDITIONS)
        dest = site / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dest)
        print('Added:', relative)
    old = site / 'assets/img/team-don.webp'
    if old.exists():
        old.unlink()
        print('Removed unused Don portrait from updated package')


def download_zip():
    failures=[]
    for url in ARCHIVE_URLS:
        try:
            req=Request(url,headers={'User-Agent':'WellSpring-Site-Updater/1.0'})
            with urlopen(req,timeout=35) as r:
                data=r.read()
            if not zipfile.is_zipfile(BytesIO(data)):
                raise ValueError('Server response is not a ZIP archive')
            return data
        except (URLError,ValueError,TimeoutError) as e:
            failures.append(f'{url}: {e}')
    raise RuntimeError('Could not download the live GitHub repository.\n'+'\n'.join(failures))


def unzip_repo(data, parent):
    site=parent/'website'
    site.mkdir()
    with zipfile.ZipFile(BytesIO(data)) as z:
        files=[name for name in z.namelist() if not name.endswith('/')]
        if not files:
            raise ValueError('Repository archive is empty')
        prefix=files[0].split('/')[0]+'/'
        for member in z.infolist():
            if member.is_dir():continue
            if not member.filename.startswith(prefix):
                raise ValueError('Unexpected archive structure')
            rel=Path(member.filename[len(prefix):])
            if not rel.parts or '..' in rel.parts:raise ValueError('Unsafe archive path')
            dest=site/rel
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_bytes(z.read(member))
    return site


def zip_site(site):
    with zipfile.ZipFile(OUTPUT,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=8) as out:
        for file in sorted(site.rglob('*')):
            if file.is_file():
                out.write(file,file.relative_to(site).as_posix())


def main():
    print('Downloading current WellSpring website source from GitHub...')
    repo_zip=download_zip()
    with TemporaryDirectory(prefix='wellspring-update-') as tmp:
        site=unzip_repo(repo_zip,Path(tmp))
        patch_site(site)
        zip_site(site)
    print('\nCreated:',OUTPUT)
    print('This is a complete site folder ZIP for upload to GitHub Pages.')
    print('No changes were made to the live website.')


if __name__=='__main__':
    try:main()
    except Exception as exc:
        print('\nUnable to safely apply updates:',exc,file=sys.stderr)
        sys.exit(1)
