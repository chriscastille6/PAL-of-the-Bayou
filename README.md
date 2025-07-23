# Dr. Christopher M. Castille - Academic Website

A modern academic website built with Hugo Blox Builder, showcasing research, teaching, and the People Analytics Lab.

## 🚀 Features

- **Modern Design**: Clean, professional academic CV layout
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Fast**: Static site generation for optimal performance
- **Dark/Light Mode**: Easy on the eyes in any lighting
- **SEO Optimized**: Built-in search engine optimization
- **Academic Focus**: Designed specifically for academic professionals

## 📋 Content Sections

- **Biography**: Academic background and research interests
- **Skills**: Technical and research method competencies
- **Experience**: Professional experience and teaching
- **Publications**: Featured and recent research papers
- **Projects**: People Analytics Lab and research initiatives
- **Blog Posts**: Academic insights and updates
- **Contact**: Professional contact information

## 🛠️ Technology Stack

- **Hugo**: Static site generator
- **Hugo Blox Builder**: Modern theme framework
- **Tailwind CSS**: Utility-first CSS framework
- **GitHub Pages/Netlify**: Hosting and deployment

## 🚀 Quick Start

### Prerequisites

- Hugo v0.147.9 or later
- Go v1.21 or later

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/chriscastille/cmcastille-website.git
   cd cmcastille-website
   ```

2. Install dependencies:
   ```bash
   hugo mod get
   ```

3. Start the development server:
   ```bash
   hugo server --bind 0.0.0.0 --port 1313
   ```

4. Visit `http://localhost:1313` in your browser

### Building for Production

```bash
hugo --minify
```

## 📁 Project Structure

```
cmcastille-website/
├── content/
│   ├── authors/admin/     # Author profile
│   ├── post/             # Blog posts
│   ├── publication/      # Research publications
│   └── project/          # Research projects
├── static/               # Static assets
├── hugo.toml            # Hugo configuration
├── go.mod               # Go modules
└── README.md            # This file
```

## 🎯 Content Management

### Adding New Publications

Create a new file in `content/publication/` with the following front matter:

```yaml
---
title: "Your Publication Title"
date: 2024-01-01
authors: ["Christopher M. Castille"]
publication_types: ["2"]
abstract: "Brief abstract of the publication"
featured: true  # Set to true for homepage display
publication: "*Journal Name*"
doi: "10.xxxx/xxxxx"
---
```

### Adding New Blog Posts

Create a new file in `content/post/` with the following front matter:

```yaml
---
title: "Your Post Title"
date: 2024-01-01T00:00:00Z
draft: false
authors: ["admin"]
tags: ["tag1", "tag2"]
categories: ["Category"]
---
```

### Adding New Projects

Create a new file in `content/project/` with the following front matter:

```yaml
---
title: "Project Title"
summary: "Brief project description"
tags: ["tag1", "tag2"]
date: "2024-01-01T00:00:00Z"
---
```

## 🌐 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: `hugo --minify`
3. Set publish directory: `public`
4. Deploy!

### GitHub Pages

1. Enable GitHub Pages in repository settings
2. Set source to GitHub Actions
3. Push changes to trigger deployment

## 📊 Analytics

The site is configured for Google Analytics. Add your tracking ID to `hugo.toml`:

```toml
[params.marketing.analytics]
google_analytics = "G-XXXXXXXXXX"
```

## 🤝 Contributing

This is a personal academic website, but suggestions for improvements are welcome!

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- **Email**: christopher.castille@nicholls.edu
- **Twitter**: [@cmcastille](https://twitter.com/cmcastille)
- **LinkedIn**: [Christopher Castille](https://www.linkedin.com/in/christopher-castille)

---

Built with ❤️ using [Hugo Blox Builder](https://hugoblox.com/)
