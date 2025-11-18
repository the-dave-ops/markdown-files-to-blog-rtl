# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-11-18

### Initial Generic Release

This release transforms the project into a generic, reusable RTL blog site generator.

#### Added
- Comprehensive README.md with full documentation
- LICENSE file (MIT License)
- CONTRIBUTING.md with contribution guidelines
- Example blog post demonstrating the proper format
- Clean project structure ready for public use
- **Bilingual label support**: Categories and tags now support both English (**Categories:**/**Tags:**) and Hebrew (**קטגוריות:**/**תגיות:**) labels
- **Docker support**: Multi-stage Dockerfile with nginx for containerized deployment
  - Optimized Alpine-based image (~25MB)
  - Custom nginx configuration with gzip, caching, and security headers
  - Production-ready setup
- **Screenshots**: Added visual examples of the blog in the README

#### Removed
- All site-specific content (kept only one example post)
- Unused content generation scripts:
  - add-calculator-links.js
  - create-all-posts.js
  - create-missing.js
  - enhance-content.js
  - expand-content.js
  - find-bad-file.js
  - fix-all-yaml.js
  - fix-duplicates.js
  - fix-excerpts.js
  - fix-titles.js
  - generate-posts.js
  - generate-all-posts.py
  - quick-create.js
  - remove-duplicates.js
  - restore-tags-categories.js
- Old documentation files:
  - DEPLOY.md
  - README-CLOUDFLARE.md
  - REWRITE-RULES.md
  - wrangler.toml
- Temporary files and directories:
  - ai_studio_code.txt
  - generate.log
  - new-content/

#### Kept (Core Functionality)
- build.js - Main build script
- serve.js - Development server
- package.json - Project dependencies
- templates/ - HTML templates
- styles/ - CSS files
- .gitignore - Git ignore rules
- .node-version - Node version specification

### Features

- ✨ Simple static blog generator
- 📝 Markdown-based content with front matter
- 🏷️ Categories and tags support
- 🌐 RTL language support (Hebrew/Arabic)
- 🎨 Clean, responsive design
- 📦 Pure static HTML/CSS output
- 🚀 Easy deployment to any static host

---

## Future Releases

Future versions will be documented here as new features and improvements are added.
