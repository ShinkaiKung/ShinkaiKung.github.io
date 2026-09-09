# ShinkaiKung.github.io

Personal knowledge archive published with GitHub Pages.

## Structure

- `/index.html` — site home
- `/research/` — research reading index and grouped paper HTML files
- `/others/` — museum guides and other grouped collections
- `/notes/` — short notes
- `/data/content.json` — machine-readable content catalog
- `/assets/` — shared styles and scripts for the index pages

User-provided standalone HTML files are grouped by topic beneath `/research/papers/`
or `/others/`. They are treated as immutable artifacts: navigation pages link to
them, but do not rewrite or inject code into them.

## Add content

For a new standalone page, add the HTML file (or a directory containing its own
`index.html`) and then add an entry to the relevant collection page. Research
metadata should also be recorded in `/data/content.json`.

## Local preview

Run a static HTTP server from the repository root, then open the printed local URL.
Root-relative links require an HTTP preview and may not work when an HTML file is
opened directly from the filesystem.
