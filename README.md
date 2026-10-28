# WellSpring Health & Wellness website

Coming-soon site for WellSpring Health & Wellness. Plain HTML pages that share one stylesheet, ready for GitHub Pages.

## Publish on GitHub Pages

1. Sign in to the WellSpring GitHub account and create a public repository named `wellspring-site`.
2. Open the repository, choose **Add file**, then **Upload files**, and drag in everything in this folder (keep the folder structure).
3. Commit the upload to the `main` branch.
4. Go to **Settings**, then **Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
5. After a few minutes the site is live at `https://<account-name>.github.io/wellspring-site/`.

## Connect the waitlist form

GitHub Pages can't receive form data, so the waitlist posts to a form service.

1. Create a free form at formspree.io that sends to randy@wellspringhealthclinic.com.
2. Copy its endpoint, which looks like `https://formspree.io/f/abcdwxyz`.
3. In `index.html`, find `<form data-waitlist novalidate>` and change it to
   `<form data-waitlist data-endpoint="https://formspree.io/f/abcdwxyz" novalidate>`.

Until then, the form tells visitors to email randy@wellspringhealthclinic.com.

## Connect the domain (later)

1. In **Settings**, then **Pages**, enter `wellspringhealthclinic.com` under **Custom domain**. GitHub adds a `CNAME` file.
2. At the domain registrar, point the domain's DNS at GitHub Pages using the records GitHub's Pages docs list.
3. Once the domain checks out, turn on **Enforce HTTPS**.

## Edit the site

| To change | Edit |
| --- | --- |
| Colors and fonts | `assets/css/style.css`, top section |
| Home page copy | `index.html` |
| Leadership bios | `about/index.html` |
| Services and pricing | `services/index.html` |
| Research figures | `research/index.html` |
| A journal post | `journal/<post-name>/index.html` |
| Header, nav, footer | the same block appears at the top and bottom of every page; change it on each page |

To add a journal post: copy a post folder, rename it, change the words and the photo link, then add a card for it in `journal/index.html`.

To add headshots: put the photo in `assets/img/` and replace the matching `<div class="mono ...">RB</div>` with `<img src="../assets/img/randy.jpg" alt="Randy Beckham">`.

## Photos

Stock photos load from Unsplash and are free to use under the Unsplash License. To host them yourself, download each one, put it in `assets/img/`, and change the link in the page.

| Used on | Unsplash page |
| --- | --- |
| Home hero | https://unsplash.com/photos/woman-in-white-robe-sitting-on-white-couch-I3VF9Cu4agc |
| Home, One coordinated plan | https://unsplash.com/photos/relaxing-lounge-chairs-in-a-sunlit-spa-room-FkB2CUuqU_c |
| Services hero | https://unsplash.com/photos/woman-in-white-bathrobe-holding-black-book-JyDMYoTCseQ |
| About, Research, Journal, and post heroes | https://unsplash.com/photos/zen-garden-with-rocks-plants-and-water-feature-09UwvABDBog |
| Post: women's health gap | https://unsplash.com/photos/smiling-woman-in-gray-cardigan-MMhazsT2wtM |
| Post: aging you can see | https://unsplash.com/photos/a-woman-in-a-white-sweater-is-holding-her-hand-up-to-her-face-iZ57F0moik4 |

## Brand

Colors and fonts follow the WellSpring Branding Guidelines: blue #1797AE, aqua #1CD5D6, green #1B9B23, light green #61BD65, with beige and soft white as secondary colors. Jost stands in for Futura on the web, and Mrs Saint Delafield is the script accent. Text sits on deeper shades of the blue and green so it stays readable.
