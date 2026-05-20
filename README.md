# Academic Website - Static HTML Version

This is a static HTML version of your academic website that can be directly uploaded to FTP without any build process.

## Files to Upload to FTP

Upload ALL of these files to your web server:

```
├── index.html              # Home page
├── projects.html           # Projects page
├── publications.html       # Publications page
├── grants.html            # Grants page
├── teaching.html          # Teaching page
├── news.html              # News page
├── misc.html              # Misc. page
├── styles.css             # Stylesheet
├── files/
│   ├── profile.jpeg          # Profile photo
│   ├── YaxingYao_CV.pdf      # CV
│   └── YaxingYao_CVofFailure.pdf
├── data/
│   ├── publicationsData.js    # Publications data
│   └── newsData.js            # News data
└── scripts/
    └── bbl-to-js.js           # BibTeX converter (optional)
```

## How to Upload

1. Connect to your web server via FTP using any FTP client (FileZilla, Cyberduck, etc.)
2. Upload all the files listed above to your web root directory (usually `public_html`, `www`, or `htdocs`)
3. Maintain the folder structure (keep files in `data/` and `scripts/` folders)
4. That's it! Your website is live.

## Updating Content

### To Update Publications

**Option 1: Using the converter script (if you have Node.js installed)**

1. Place your `.bbl` file in the `scripts/` folder
2. Run: `node scripts/bbl-to-js.js your-file.bbl`
3. Copy the output
4. Open `data/publicationsData.js` in a text editor
5. Replace the `publications` array with the new output
6. Upload the updated `data/publicationsData.js` to your FTP server

**Option 2: Manual editing**

1. Open `data/publicationsData.js` in a text editor
2. Add/edit publication entries following this format:
   ```javascript
   {
     year: 2024,
     title: 'Your Paper Title',
     authors: 'Author1, Author2, Author3',
     venue: 'Conference or Journal Name',
     link: '#'  // or URL to paper
   },
   ```
3. Save and upload to FTP

### To Update News

1. Open `data/newsData.js` in a text editor
2. Add new items at the top of the `newsItems` array:
   ```javascript
   {
     date: 'Jan 2025',
     content: 'Your news announcement here'
   },
   ```
3. Save and upload to FTP

The homepage sidebar automatically shows the 5 most recent news items.

### To Update Other Content

To update Projects, Grants, or Teaching pages:

1. Open the corresponding HTML file (`projects.html`, `grants.html`, or `teaching.html`)
2. Find the section you want to edit
3. Modify the HTML content directly
4. Save and upload to FTP

### To Update Your Personal Information

1. Open `index.html`
2. Find the section with your name, title, and contact information
3. Modify the text and links
4. Save and upload to FTP

## Customization Tips

### Change Colors

Open `styles.css` and modify the color variables at the top:
```css
:root {
  --gray-900: #111827;  /* Dark text color */
  --blue-500: #3b82f6;  /* Accent color */
  /* etc. */
}
```

### Change Profile Photo

The current profile photo is stored at `files/profile.jpeg`. To replace it, upload a new image and update the image path in `index.html`:
```html
<img src="YOUR_IMAGE_URL_HERE" alt="Professor" class="profile-image">
```

You can either:
- Use an external URL (like Unsplash)
- Upload your photo to the server and use a relative path like `images/photo.jpg`

### Change Navigation Order

Edit the `<nav>` section in each HTML file to reorder menu items.

## Advantages of This Static Version

✅ **No build process** - Just edit and upload
✅ **No dependencies** - No Node.js or npm required
✅ **Fast loading** - Pure HTML/CSS/JavaScript
✅ **Easy to maintain** - All data in simple JavaScript files
✅ **FTP-friendly** - Upload individual files as needed
✅ **Works everywhere** - Compatible with any web host

## Browser Compatibility

This website works in all modern browsers:
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Sizes

All files are small and load quickly:
- HTML pages: ~3-8 KB each
- CSS file: ~8 KB
- JavaScript data files: ~1-2 KB each

## Support

For questions or issues:
1. Check that all files are uploaded correctly
2. Verify file permissions (should be readable)
3. Make sure folder structure is maintained
4. Check browser console for JavaScript errors (F12 → Console)

## License

This website template is yours to use and modify as needed.
