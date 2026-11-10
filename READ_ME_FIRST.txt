WELLSPRING WEBSITE UPDATE
Prepared November 9, 2026

This kit updates the CURRENT public GitHub repository at:
https://github.com/alyssawellspring208/Wellspring-Website

CHANGES
- Updates leadership on BOTH the Home and About pages.
- Shows Randy Beckham (Strategy), Chris Cutchens (Finance), and Layla Beverly (Clinical Operations).
- Removes Don Reiff from the public leadership pages.
- Adds Chris's photo and a shortened bio from his supplied executive bio.
- Adds a statement about WellSpring's broader team being under development.
- Adds two articles attributed only to Alyssa Blackson.
- Adds a reusable article layout and auto-updating Journal article grid.
- Adds Pages CMS configuration so you can publish future posts using an editor.
- Preserves the current visual design, domain file, existing pages, and contact form.

HOW TO PREPARE THE UPDATED ZIP (Mac)
1. Unzip this kit.
2. Open Terminal and type: python3 followed by a space.
3. Drag the apply_updates.py file from the unzipped kit into Terminal.
4. Press Return. Python downloads the live public repository, applies updates,
   and creates WellSpring_Updated_Website_Ready_To_Upload.zip in this kit folder.

   You can also open Terminal in the unzipped folder and run:
   python3 apply_updates.py

HOW TO PUBLISH
1. Unzip WellSpring_Updated_Website_Ready_To_Upload.zip.
2. Visit https://github.com/alyssawellspring208/Wellspring-Website
   and sign in to the account that owns the repository.
3. Use Add file > Upload files to upload the modified files, maintaining folders.
   Overwrite any files with the same names by committing the replacements.
   IMPORTANT: GitHub's web uploader may refuse to overwrite existing files directly.
   If so, use GitHub Desktop to copy the complete updated contents into your local
   repository and Commit > Push, or edit/replace the four changed original files
   (index.html, about/index.html, journal/index.html, assets/js/main.js)
   individually in the GitHub browser editor.
4. Keep the existing CNAME file. The site domain does not need to change.
5. Check the updated live site, especially the menu and waitlist form.

HOW TO ADD ARTICLES AFTER INSTALLATION
1. Visit https://app.pagescms.org/ and sign in with the GitHub account that owns
   the WellSpring repository. Authorize the Pages CMS GitHub App for this repo.
2. Select Wellspring-Website and then WellSpring Articles.
3. Click New, enter title/date/author/category/summary, write the article,
   add an image if desired, and save. The GitHub Pages site rebuilds it.
4. Use author "Alyssa Blackson" for articles written by Alyssa. No other
   affiliation appears on the website.

REVIEW BEFORE PUBLICATION
The articles discuss health information for a public audience. Have a licensed
clinical reviewer at WellSpring check medical accuracy before publishing.

NOTE
This kit does NOT modify the live website and does NOT request your GitHub login.
It uses public files and prepares a new ZIP locally on your computer.
