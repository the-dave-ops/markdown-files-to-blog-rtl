# Quick Start Guide

Get your blog up and running in 5 minutes!

## Step 1: Install

```bash
# Clone the repository
git clone <your-repo-url>
cd blog-app-for-github

# Install dependencies
npm install
```

## Step 2: Create Your First Post

Create a new file in the `content/` directory, for example `my-first-post.md`:

```markdown
---
title: "My First Blog Post"
date: 2025-11-18
---

# My First Blog Post

Welcome to my blog! This is my first post.

## About This Blog

I'm excited to share my thoughts and experiences here.

**קטגוריות:** Personal, Introduction
**תגיות:** first-post, welcome, blog
```

## Step 3: Build and Preview

```bash
# Build and serve locally
npm run dev
```

Open your browser to `http://localhost:8000` to see your blog!

## Step 4: Customize

### Change the Site Title and Description

Edit `templates/layout.html` and update:
- `<title>` tag
- Meta description
- Header content

### Customize Styling

Edit `styles/main.css` to change colors, fonts, and layout.

### Add More Posts

Just create more `.md` files in the `content/` directory following the same format!

## Step 5: Deploy (100% Free!)

You have two excellent **completely free** options:

### 🚀 Option A: GitHub Pages

**Perfect for beginners!** Everything in one place.

1. Push your code to GitHub
2. Create `.github/workflows/deploy.yml` (see README.md for the full code)
3. Enable GitHub Pages in your repository settings
4. Done! Your site auto-deploys on every push

**Your site will be at:** `https://yourusername.github.io/your-repo-name/`

### ⚡ Option B: Cloudflare Pages

**Super fast with global CDN!**

1. Push your code to GitHub
2. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com) (free, no credit card)
3. Connect your repository
4. Set build command: `npm run build` and output: `dist`
5. Done! Your site auto-deploys on every push

**Your site will be at:** `https://your-project-name.pages.dev`

---

### 📚 Need Detailed Instructions?

See the [Deployment section in README.md](README.md#deployment) for:
- Complete step-by-step guides with screenshots
- GitHub Actions workflow code
- Comparison table
- Custom domain setup
- And more!

Both options include:
- ✅ 100% Free hosting
- ✅ Free SSL certificate
- ✅ Automatic deployments
- ✅ Custom domain support

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out the [example post](content/example-post.md) for formatting tips
- Customize templates in the `templates/` directory
- Modify styles in `styles/main.css`

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Look at the [example post](content/example-post.md) for the correct format
- Open an issue on GitHub if you encounter problems

Happy blogging! 🎉
