---
title: "Example Blog Post - Demonstrating the Format"
date: 2025-11-15
---

# Example Blog Post - Demonstrating the Format

This is an example blog post that demonstrates the proper format for creating content in this blog generator. You can use this as a template for your own posts.

## Front Matter

At the top of each markdown file, you need to include front matter between `---` markers. The front matter should include:
- `title`: The title of your post (required)
- `date`: Publication date in YYYY-MM-DD format (required)

## Markdown Content

After the front matter, write your content using standard Markdown syntax. You can use:

### Headings

Use `#` for headings. The more `#` symbols, the smaller the heading:
- `#` for H1
- `##` for H2
- `###` for H3
- And so on...

### Text Formatting

You can use:
- **Bold text** with `**text**`
- *Italic text* with `*text*`
- `Inline code` with backticks

### Lists

Unordered lists:
- Item 1
- Item 2
- Item 3

Ordered lists:
1. First item
2. Second item
3. Third item

### Links

Create links like this: [Link Text](https://example.com)

### Code Blocks

You can include code blocks:

```javascript
function hello() {
  console.log("Hello, World!");
}
```

### Blockquotes

> This is a blockquote. You can use it for highlighting important information or quotes.

## Categories and Tags

At the end of your markdown file (after all your content), add categories and tags. These help organize your content:

- **Categories** are broad topics (e.g., Technology, Travel, Food)
- **Tags** are specific keywords (e.g., JavaScript, Paris, Recipe)

**Note:** You can use either English (**Categories:** / **Tags:**) or Hebrew (**קטגוריות:** / **תגיות:**) labels. Both are supported! For other languages, you can modify the parsing logic in `build.js`.

## Tips for Writing

1. **Keep it simple**: Write clear, concise content
2. **Use headings**: Break up your content with descriptive headings
3. **Add images**: You can include images using `![Alt text](image-url.jpg)`
4. **Proofread**: Always check your content before publishing

## Publishing Your Post

1. Create a new `.md` file in the `content/` directory
2. Follow the format shown in this example
3. Run `npm run build` to generate the HTML
4. Run `npm run serve` to preview locally
5. Deploy the `dist/` folder to your hosting provider

**Categories:** Tutorial, Documentation, Getting Started
**Tags:** example, markdown, blog, how-to, guide
