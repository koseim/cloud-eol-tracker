# Cloud Service EOL Tracker

A static website that tracks End-of-Life (EOL) and deprecation dates for cloud services including AWS, Azure, GCP, and more. Built with vanilla HTML, CSS, and JavaScript for easy deployment to any static hosting platform.

## Features

- **Comprehensive EOL Tracking**: Track deprecation dates for cloud services across multiple providers
- **Dual View Modes**: Toggle between card and table views
- **Powerful Filtering**: Filter by vendor, category, and EOL proximity
- **Search Functionality**: Quick search across service names, vendors, and descriptions
- **Internationalization**: Full support for English and Japanese
- **Responsive Design**: Mobile-first design that works on all devices
- **Data Caching**: LocalStorage caching for improved performance
- **Error Handling**: Robust error handling with automatic retry logic
- **Security**: XSS protection and Content Security Policy implemented
- **Static Deployment**: No backend required - works with any static hosting

## Project Structure

```
eol-list/
├── index.html              # Main HTML file
├── privacy.html            # Privacy policy page
├── LICENSE                 # MIT License
├── data/
│   └── eol-data.json      # EOL information database
├── css/
│   ├── styles.css         # Core styles
│   └── responsive.css     # Responsive breakpoints
├── js/
│   ├── config.js          # Configuration constants
│   ├── app.js             # Main application logic
│   ├── data-loader.js     # JSON data loading with caching
│   ├── filters.js         # Search and filtering
│   └── i18n.js            # Internationalization (English/Japanese)
├── _headers                # Cloudflare Pages security headers
├── robots.txt              # SEO configuration
└── sitemap.xml             # Sitemap for search engines
```

## Getting Started

### Local Development

1. Clone or download this repository
2. Open `index.html` in your web browser
3. That's it! No build process required.

For better development experience with live reload:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Data Management

### JSON Data Structure

The EOL data is stored in `data/eol-data.json` with the following structure:

```json
{
  "lastUpdated": "2025-11-30",
  "services": [
    {
      "id": "unique-service-id",
      "vendor": "AWS",
      "serviceName": "Service Name",
      "category": "compute",
      "eolDate": "2024-12-31",
      "supportEndDate": "2024-12-31",
      "officialUrl": "https://...",
      "alternatives": [
        {
          "serviceName": "Alternative Service",
          "url": "https://..."
        }
      ],
      "description": "Brief description of the service",
      "tags": ["tag1", "tag2"]
    }
  ],
  "vendors": [...],
  "categories": [...]
}
```

### Adding New Services

1. Open `data/eol-data.json`
2. Add a new service object to the `services` array
3. Required fields:
   - `id`: Unique identifier (e.g., "aws-service-name")
   - `vendor`: Vendor ID (must match a vendor in the `vendors` array)
   - `serviceName`: Display name of the service
   - `category`: Category ID (must match a category in the `categories` array)
   - `eolDate`: End-of-life date in YYYY-MM-DD format
   - `officialUrl`: Link to official announcement
   - `description`: Brief description
4. Optional fields:
   - `supportEndDate`: Support end date if different from EOL
   - `alternatives`: Array of alternative services
   - `tags`: Array of tags for additional filtering
5. Save the file

### Categories

Available categories (defined in `data/eol-data.json`):
- `compute`: Compute services
- `storage`: Storage services
- `database`: Database services
- `networking`: Networking services
- `security`: Security & Identity services
- `analytics`: Analytics services
- `ml-ai`: Machine Learning & AI services
- `other`: Other services

### Adding New Vendors

To add a new cloud provider:

1. Add vendor to the `vendors` array in `data/eol-data.json`:

```json
{
  "id": "VENDOR_ID",
  "name": "Vendor Display Name",
  "logo": ""
}
```

2. Add services with `"vendor": "VENDOR_ID"`

## Configuration

### Google Analytics (Optional)

To enable analytics:

1. Get your Google Analytics 4 measurement ID from [analytics.google.com](https://analytics.google.com)
2. Edit `index.html` and replace `G-XXXXXXXXXX` with your actual measurement ID (appears twice)

### Customizing Data

Edit `data/eol-data.json` to add or update cloud service EOL information.

## Deployment

This is a static website and can be deployed to any static hosting platform.

### Cloudflare Pages (Recommended)

1. Push your code to GitHub
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Go to Pages → Create a project
4. Connect your GitHub repository
5. Build settings:
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: (leave empty)
6. Click Deploy

Your site will be available at `https://your-project.pages.dev`

**Benefits**:
- Free unlimited bandwidth
- Automatic HTTPS
- Built-in CDN
- Automatic deployments on git push
- Custom security headers via `_headers` file

### Other Deployment Options

- **GitHub Pages**: Free hosting for public repositories
- **Netlify**: Drag and drop deployment or Git integration
- **Vercel**: One-click deployment from GitHub
- **Firebase Hosting**: Fast global CDN

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance

- No build process required
- Minimal dependencies (vanilla JavaScript)
- Optimized for datasets of 100+ services
- LocalStorage caching (24-hour expiration)
- Automatic retry with exponential backoff
- Debounced search input
- Responsive images and assets

## Customization

### Color Scheme

Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #0066cc;
    --primary-dark: #004c99;
    --primary-light: #3385d6;
    /* ... more colors */
}
```

### Layout

- Mobile breakpoint: 768px
- Tablet breakpoint: 1024px
- Desktop breakpoint: 1440px

Adjust in `css/responsive.css` as needed.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Add your changes (new services, bug fixes, features)
4. Submit a pull request

### Adding Services

When adding new EOL services:
- Verify dates from official sources
- Include link to official announcement
- Provide accurate alternatives
- Test locally before submitting

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Contribute improvements via pull requests

## Security

- **XSS Protection**: All user-generated content is properly escaped
- **Content Security Policy**: Strict CSP headers prevent injection attacks
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **HTTPS Only**: All resources loaded via HTTPS
- **No Inline Scripts**: All JavaScript in external files

## Roadmap

Future enhancements:
- [ ] Export functionality (CSV, Excel)
- [ ] RSS feed generation
- [ ] Dark mode toggle
- [ ] Additional cloud providers (Oracle, IBM, Alibaba)
- [ ] Service comparison view
- [ ] Timeline visualization
- [ ] Email notifications (requires backend)
- [ ] Automated EOL data updates via CI/CD

## Credits

Built with vanilla JavaScript, HTML5, and CSS3. No frameworks required.

## Changelog

### Version 1.1.0 (2025-11-30)
- Added internationalization (English/Japanese)
- Implemented XSS protection with HTML escaping
- Added Content Security Policy
- LocalStorage caching for improved performance
- Error handling with automatic retry logic
- Google Analytics integration
- Privacy policy page
- Cloudflare Pages deployment configuration
- Security headers configuration
- MIT License added

### Version 1.0.0 (2025-11-30)
- Initial release
- Card and table views
- Search and filtering
- 45+ cloud services included
- Responsive design
- Static deployment ready

---

**Live Demo**: [Add your deployed URL here]

**Author**: [Your name/organization]

**Last Updated**: 2025-11-30
