# Samuel Siame – Interactive Personal Website (ICT251 Activity 3)

A responsive student portfolio built with plain **HTML5, CSS and JavaScript** for ICT251 Web Technologies at Mulungushi University. It builds on my Activity 2 personal website and is deployed as a static site on Render.

- **Live site:** https://YOUR-SITE-NAME.onrender.com
- **Repository:** https://github.com/samuelsiame20-dotcom/Personal-web

## Sections

Intro area · About Me · Projects and Skills · My Hobbies · My Learning Plan (table) · My Photos · My Media (video + audio) · Contact

## Folder structure

```
index.html
css/styles.css
js/script.js
images/      photos used in the gallery
videos/      intro.mp4 (video) and voice.m4a (audio)
README.md
```

## JavaScript features (all in `js/script.js`)

| # | Feature | What it does |
|---|---------|--------------|
| 1 | **Contact form validation and preview** (compulsory) | On submit, `event.preventDefault()` keeps everything local. Name and message must not be empty or spaces only; email must look like `name@example.com`. Errors appear under each field. Valid input is shown in an on-page preview using `textContent`. Nothing is sent. |
| 2 | **Project search and filter** | Skill buttons (All, Web, Python, Data, Java) plus a search box filter the project cards. A message shows how many match, or explains when nothing matches. **Reset** clears both. |
| 3 | **Gallery viewer** | **Previous** / **Next** buttons change the large photo and its caption, with a "Photo X of 5" counter. Previous is disabled on the first photo and Next on the last. Clicking a thumbnail also opens that photo. |
| 4 | **Theme switch** | The header button switches between light and dark themes using CSS variables. The choice is saved in `localStorage` when the browser allows it. |

### Extra improvements (beyond the brief)

- **Mobile menu:** below 640 px the navigation collapses behind a *Menu* button (`aria-expanded` shows its state; Escape closes it).
- **Active section highlight:** the nav link for the section on screen is highlighted using `IntersectionObserver`.
- **Roadmap learning plan:** my data engineering roadmap, with the current phase highlighted. On phones the table turns into stacked cards so nothing scrolls sideways.
- **Faster, safer photos:** the large photos were resized (about 2.4 MB down to 0.4 MB in total), metadata including GPS location was removed, and thumbnails use `loading="lazy"` with `width`/`height` to stop the layout jumping.
- **Sharing:** meta description, Open Graph tags and an SVG favicon.

## How to test

1. **Form:** click *Validate and Preview* with empty fields (3 errors). Enter spaces only in Name/Message and `bad@x` as email (all rejected). Enter valid values and you should see a green preview saying the input was validated, not sent. Typing `<b>hi</b>` as the name shows the tags as plain text.
2. **Filter:** click *Java* (1 project). Type `zzz` (no-match message). Click *Reset* (all 5). Choose *Python* and type `sql` (2 projects).
3. **Gallery:** on photo 1, Previous is disabled. Click Next until photo 5, then Next is disabled. Click any thumbnail to jump to it.
4. **Theme:** click *Dark theme* and check that all text and buttons stay readable. Reload the page and the theme is kept.
5. **Layout:** in DevTools, check about 375 px and 1280 px widths. There should be no sideways scrolling.
6. **Mobile menu:** at 375 px, press *Menu* to open the links and *Close menu* to hide them. Choosing a link closes it.
7. **Keyboard:** press Tab through the page. Every link, button and field shows a visible orange focus outline.

## Render settings

| Setting | Value |
|---------|-------|
| Type | Static Site |
| Root Directory | *(blank)* |
| Build Command | `echo "No build required"` |
| Publish Directory | `.` |
| Auto Deploy | On (branch `main`) |

## Sources

- MDN Web Docs – HTML, CSS and JavaScript references: https://developer.mozilla.org/
- MDN – `Event.preventDefault()`: https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
- MDN – Using CSS custom properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- Render docs – Static Sites: https://render.com/docs/static-sites
- MDN – Intersection Observer API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- The learning plan is based on two personal career roadmap guides I use for planning (not published sources).
- All photos, video and audio are my own.
