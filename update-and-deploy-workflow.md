# Update and Deploy Workflow for PAL-of-the-Bayou Website

This guide helps you update your website content and deploy changes to Netlify.

---

## 1. Change to the Project Directory
```sh
cd /Users/ccastille/Documents/GitHub/Website/PAL-of-the-Bayou
```

## 2. Check Git Status
```sh
git status
```

## 3. Stage Your Changes
Replace `<file>` with the file(s) you changed, e.g., `content/authors/admin/_index.md`.
```sh
git add <file>
```
Or to stage all changes:
```sh
git add .
```

## 4. Commit Your Changes
```sh
git commit -m "Describe your update here"
```

## 5. Push to GitHub
```sh
git push origin main
```
*(or use `master` if your branch is named that)*

## 6. Wait for Netlify to Deploy
- Go to your Netlify dashboard.
- Check the "Deploys" tab for your site.
- Wait for the new deploy to finish (usually 1–3 minutes).
- Refresh your website to see the changes live.

---

**Tip:**
- Always make sure you are in the `PAL-of-the-Bayou` directory before running these commands.
- If you want to automate this further, consider writing a shell script or using a Makefile. 