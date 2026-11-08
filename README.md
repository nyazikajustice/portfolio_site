# Justice John Nyazika: Mechanical Engineering Portfolio

Static website (HTML, CSS, JavaScript). No build step.

## Run locally
Browsers block some features when a page is opened by double-click, so use a tiny local server:

    cd portfolio_site
    python3 -m http.server 8000     # then open http://localhost:8000

(or `npx serve`). An internet connection is needed for the fonts and the 3D libraries (three.js from cdnjs/jsDelivr).

## Deploy (free options)
- Netlify: sign in, choose "Add new site", "Deploy manually", drag this whole folder in.
- GitHub Pages: push the folder to a repository, Settings, Pages, deploy from the main branch.
- Vercel/Cloudflare Pages: import the repository; build command none, output directory `.`

## Add or change content
- Projects, parts, images, videos: `assets/projects/<project>/{parts,assembly,simulation,images,video}`, then update `data.js`.
- Certificates: put the PDF in `assets/certificates/` and add it to `data.js`.
- Resume: replace `assets/docs/Justice_Nyazika_Resume.pdf`.
- Text (about, timeline, contact): `index.html`.

## View-only 3D models
The website never contains your native SolidWorks files (SLDPRT/SLDASM); those are kept in `private_originals/`, outside the public folder. Only the resume PDF is downloadable.
To publish a model for viewing:
1. In SolidWorks: File > Save As > STL (single part), or export STEP and convert to GLB with a free tool such as CAD Assistant or FreeCAD (keeps assembly structure).
2. Name the file like the part, e.g. `BODY.glb` for `BODY.SLDPRT`, and put it in `assets/projects/<project>/models/`.
3. Run `python3 tools/register_models.py`. The model then appears in the project's CAD files tab ("View in 3D") and in the viewer's Model list.

## What "view-only" can and cannot do
Anything a browser displays can in principle be saved by a determined visitor (developer tools, screen capture). This site removes download buttons and native files, blocks right-click and video download controls, and shows certificates as page images instead of PDFs. For stronger protection, publish simplified or lower-detail models, and keep the originals private.
