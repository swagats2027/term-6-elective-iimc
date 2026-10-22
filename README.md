# Term VI Electives website

This is a static, multi-page website for the MBA Term VI electives (AY 2026–27). It has no build step or server-side dependencies. Web fonts are bundled locally, so pages do not depend on a font CDN.

## Pages

- `index.html` — searchable Programme Office course list with multi-select academic-group and credit filters.
- `analysis.html` — grading-component comparison with instructor names, multi-select group and component filters, mid-term/end-term presence filters, and batch-filtered informal feedback ratings and summaries.
- `viewer.html` — in-site outline viewer. PDF outlines are shown directly; Word and PowerPoint outlines use the accompanying PDFs in `outlines/preview/`.

## Deploy to Netlify

1. Unzip the package.
2. Upload the unzipped site folder to Netlify Drop, or create a new Netlify site from a repository containing these files.
3. Set the publish directory to the folder containing `index.html`. Leave the build command blank.

The included `netlify.toml` sets the publish directory to the site root.

## Deploy to Vercel

1. Unzip the package and place its contents in a Git repository.
2. Import the repository into Vercel.
3. Select **Other** as the framework preset, leave the build command empty, and set the output directory to `.`.

The HTML pages and their relative asset links work from the site root. Keep the `outlines/` directory with the page files when deploying.

## Informal feedback

`feedback-data.js` contains course-level teaching and ease-of-scoring averages plus paraphrased positive highlights and areas to consider from the supplied informal-feedback workbook. Courses are matched by title and instructor where listed, including known spelling variants. Scores use the workbook's 1–5 scale; invalid/non-numeric score entries are excluded. The workbook contains sheets for the 61st, 59th, and 58th batches; it does not contain a 60th-batch sheet.

## Local preview

Open `index.html` in a modern browser. Browser security settings may restrict PDF preview from a `file://` URL; if that happens, serve this folder with any local static-file server. The hosted version previews outlines in the page.

## Source notes

Course titles, groups, credits, capacity, and instructors follow the supplied Term-VI course list workbook. The attached Course Analysis workbook is for Term V and was used as a layout reference; Term VI component values were read from the Term VI outline files. Older outline years and source inconsistencies are flagged in the analysis page. The original source documents are retained in `outlines/`.
