# Quick Start Guide

## Upload to FTP - 3 Simple Steps

### Step 1: Download All Files
Download everything from the `/static` folder:
- All `.html` files (index, projects, publications, grants, teaching, news)
- `styles.css`
- `data/` folder (contains publicationsData.js and newsData.js)
- `files/` folder (contains profile photo, CV, and CV of Failure)
- `scripts/` folder (optional, for BibTeX converter)

### Step 2: Connect to Your FTP Server
Use any FTP client (FileZilla, Cyberduck, etc.):
- Host: your-domain.com
- Username: your-ftp-username
- Password: your-ftp-password
- Port: 21 (or as provided by your host)

### Step 3: Upload
Drag and drop all files to your web root folder (usually `public_html`, `www`, or `htdocs`)

**Done!** Visit your website at http://your-domain.com

---

## Common Updates

### Add a News Item (5 minutes)

1. Open `data/newsData.js` in any text editor
2. Add at the top:
   ```javascript
   {
     date: 'Jan 2025',
     content: 'Your announcement here'
   },
   ```
3. Upload `newsData.js` to FTP

### Add a Publication (5 minutes)

1. Open `data/publicationsData.js` in any text editor
2. Add in the appropriate year section:
   ```javascript
   {
     year: 2025,
     title: 'Your Paper Title',
     authors: 'Smith, J., Doe, A.',
     venue: 'Conference Name',
     link: 'https://...'
   },
   ```
3. Upload `publicationsData.js` to FTP

### Update Your Bio (5 minutes)

1. Open `index.html` in any text editor
2. Find the bio section (near the bottom)
3. Edit the text
4. Upload `index.html` to FTP

---

## Converting .bbl Files to Publications

If you have a `.bbl` file from LaTeX:

```bash
node scripts/bbl-to-js.js your-publications.bbl
```

This outputs JavaScript code. Copy it and paste into `data/publicationsData.js`.

---

## Troubleshooting

**Nothing appears on the website:**
- Check that you uploaded to the correct folder
- Verify file permissions are readable (644 for files, 755 for folders)

**Navigation doesn't work:**
- Make sure all HTML files are in the same directory
- Check that filenames are lowercase

**Publications/News don't show:**
- Verify the `data/` folder was uploaded
- Check browser console (F12) for JavaScript errors
- Make sure JavaScript syntax is correct (commas, brackets)

---

## Need Help?

1. Check the full README.md for detailed instructions
2. Verify all files uploaded successfully
3. Check file permissions on your server
4. Look at browser console for error messages (F12 → Console tab)
