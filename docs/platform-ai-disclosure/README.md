# AI Disclosure Form — restore notes

## Live symptom

`https://bayoupal.nicholls.edu/platform/tools/ai-disclosure/` returns **Apache 503** for every path under that directory (including nonexistent files). Sibling platform pages (e.g. `/platform/survey/checklist.html`) still return 200.

That pattern means the **directory exists on the Nicholls host** but Apache cannot serve it (broken handler, bad symlink/mount, Passenger/proxy target down, or unreadable directory tree)—not a simple “missing `index.html`” case.

## Source of truth

The platform (including this tool) lives in the separate local project:

`/Users/ccastille/Documents/GitHub/Psychological Assessments/platform/tools/ai-disclosure/`

(referenced from `chriscastille6/SONA-System` docs). That project is **not** published as a public GitHub repo under `chriscastille6`, so this Hugo repo did not contain the original file.

## What this repo provides

A rebuilt static form matching the platform hub description and styling:

- Path in repo: `static/platform/tools/ai-disclosure/index.html`
- Self-contained HTML/JS (Tailwind CDN + CANDIDATE-style ID generation)
- Loads `../../js/participant-id.js` when present on BayouPAL

### Working mirror (GitHub Pages)

After the Pages workflow runs:

https://chriscastille6.github.io/PAL-of-the-Bayou/platform/tools/ai-disclosure/

## Restore the Nicholls URL

On the BayouPAL Apache host (docroot that serves `/platform/`):

1. Inspect and remove/replace the broken directory:
   ```bash
   ls -la platform/tools/ai-disclosure
   # If it is a symlink or app root, note the target, then replace with a clean static folder
   rm -rf platform/tools/ai-disclosure
   mkdir -p platform/tools/ai-disclosure
   ```
2. Copy this repo’s `static/platform/tools/ai-disclosure/index.html` into that folder  
   (or redeploy from Psychological Assessments once that copy is healthy).
3. Confirm there is **no** `.htaccess` / Passenger / ProxyPass config left that forces that Location through a dead backend.
4. Verify:
   ```bash
   curl -sI https://bayoupal.nicholls.edu/platform/tools/ai-disclosure/ | head
   # expect HTTP 200 and text/html
   ```

Until that host-side replace is done, use the GitHub Pages mirror above or open the static file locally.
