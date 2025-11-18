const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('front-matter');

// Configuration
const CONTENT_DIR = path.join(__dirname, 'content');
const DIST_DIR = path.join(__dirname, 'dist');
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Read template files
const layoutTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'layout.html'), 'utf8');
const indexTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'index.html'), 'utf8');
const postTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'post.html'), 'utf8');
const categoryTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'category.html'), 'utf8');
const tagTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'tag.html'), 'utf8');

// Configure marked for code highlighting
marked.setOptions({
  highlight: function(code, lang) {
    return `<pre><code class="language-${lang}">${code}</code></pre>`;
  },
  breaks: true,
  gfm: true
});

// Create slug from category/tag name
// Maps Hebrew categories to English slugs
const categorySlugMap = {
  'אוטומציה': 'automation',
  'אורכיסטרציה': 'orchestration',
  'קונטיינרים': 'containers',
  'תשתית': 'infrastructure',
  'DevOps': 'devops'
};

// Format date to D/M/Y
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Clean markdown symbols from text
function cleanMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^#+\s*/gm, '') // Remove markdown headers at start of lines
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\*/g, '') // Remove italic markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

function createSlug(name) {
  // If it's in the map, use the mapped value
  if (categorySlugMap[name]) {
    return categorySlugMap[name];
  }
  
  // If it's already in English/Latin characters, create a slug from it
  if (/^[a-zA-Z0-9\s-]+$/.test(name)) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }
  
  // For Hebrew or other non-Latin text, use the map or create a hash-based slug
  // For now, we'll use encodeURIComponent as fallback but this should be avoided
  // In production, you'd want to maintain a proper mapping
  return encodeURIComponent(name).replace(/%/g, '').toLowerCase();
}

// Get all markdown files from content directory
function getMarkdownFiles() {
  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      filename: file,
      slug: file.replace('.md', ''),
      path: path.join(CONTENT_DIR, file)
    }));
}

// Parse markdown file with front matter and extract categories/tags
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(content);
  
  // Extract categories and tags from the end of the file
  let body = parsed.body;
  let categories = [];
  let tags = [];
  
  // Look for categories and tags at the end of the file
  // Support both Hebrew (קטגוריות/תגיות) and English (Categories/Tags) labels
  const categoriesMatchHe = body.match(/\*\*קטגוריות:\*\*\s*([^\n]+)/);
  const categoriesMatchEn = body.match(/\*\*Categories:\*\*\s*([^\n]+)/i);
  const tagsMatchHe = body.match(/\*\*תגיות:\*\*\s*([^\n]+)/);
  const tagsMatchEn = body.match(/\*\*Tags:\*\*\s*([^\n]+)/i);
  
  // Use Hebrew match if available, otherwise use English match
  const categoriesMatch = categoriesMatchHe || categoriesMatchEn;
  const tagsMatch = tagsMatchHe || tagsMatchEn;
  
  if (categoriesMatch) {
    categories = categoriesMatch[1].split(',').map(c => c.trim()).filter(c => c);
    // Remove the categories line from body (both Hebrew and English)
    body = body.replace(/\*\*קטגוריות:\*\*[^\n]+\n?/g, '');
    body = body.replace(/\*\*Categories:\*\*[^\n]+\n?/gi, '');
  }
  
  if (tagsMatch) {
    tags = tagsMatch[1].split(',').map(t => t.trim()).filter(t => t);
    // Remove the tags line from body (both Hebrew and English)
    body = body.replace(/\*\*תגיות:\*\*[^\n]+\n?/g, '');
    body = body.replace(/\*\*Tags:\*\*[^\n]+\n?/gi, '');
  }
  
  // Remove the separator line if it exists
  body = body.replace(/^---\s*$/gm, '');
  
  return {
    frontMatter: parsed.attributes,
    body: body.trim(),
    html: marked.parse(body.trim()),
    categories: categories,
    tags: tags
  };
}

// Generate categories HTML
function generateCategoriesHTML(categories) {
  if (!categories || categories.length === 0) return '';
  return `
    <div class="post-categories">
      <span class="meta-label">קטגוריות:</span>
      ${categories.map(cat => {
        const slug = createSlug(cat);
        return `<a href="/category/${slug}.html" class="category-tag">${cat}</a>`;
      }).join(' ')}
    </div>
  `;
}

// Generate tags HTML
function generateTagsHTML(tags) {
  if (!tags || tags.length === 0) return '';
  return `
    <div class="post-tags">
      <span class="meta-label">תגיות:</span>
      ${tags.map(tag => `<a href="/tag/${encodeURIComponent(tag)}.html" class="tag-link">${tag}</a>`).join(' ')}
    </div>
  `;
}

// Generate post HTML
function generatePostHTML(post, allPosts, allCategories, allTags) {
  const prevPost = allPosts[allPosts.indexOf(post) + 1] || null;
  const nextPost = allPosts[allPosts.indexOf(post) - 1] || null;
  
  let navigation = '';
  if (prevPost || nextPost) {
    navigation = '<nav class="post-navigation">';
    if (nextPost) {
      navigation += `<a href="/${encodeURIComponent(nextPost.slug)}.html" class="nav-link prev">${nextPost.title} ←</a>`;
    }
    if (prevPost) {
      navigation += `<a href="/${encodeURIComponent(prevPost.slug)}.html" class="nav-link next">→ ${prevPost.title}</a>`;
    }
    navigation += '</nav>';
  }

  const dateHTML = post.date ? `<time class="post-date">${formatDate(post.date)}</time>` : '';
  const categoriesHTML = generateCategoriesHTML(post.categories);
  const tagsHTML = generateTagsHTML(post.tags);
  
  // Generate description from post excerpt or first 160 chars of body
  let description = post.excerpt || post.body.substring(0, 160);
  // Clean markdown symbols and newlines
  description = description
    .replace(/#+\s*/g, '') // Remove markdown headers
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\*/g, '') // Remove italic markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim() + '...';
  
  // Generate keywords from categories and tags, plus promoted keywords
  const promotedKeywords = 'מחשבון ריבית דריבית, מחשבון משכנתא, מחשבון ברוטו נטו';
  const postKeywords = [...post.categories, ...post.tags].join(', ');
  const keywords = postKeywords ? `${promotedKeywords}, ${postKeywords}` : promotedKeywords;
  
  const postHTML = postTemplate
    .replace('{{TITLE}}', post.title)
    .replace('{{CONTENT}}', post.html)
    .replace('{{DATE}}', dateHTML)
    .replace('{{CATEGORIES}}', categoriesHTML)
    .replace('{{TAGS}}', tagsHTML)
    .replace('{{NAVIGATION}}', navigation);

  return layoutTemplate
    .replace('{{TITLE}}', post.title)
    .replace('{{DESCRIPTION}}', description)
    .replace('{{KEYWORDS}}', keywords)
    .replace('{{CATEGORIES_MENU}}', generateCategoriesMenuHTML(allCategories))
    .replace('{{TAGS_CLOUD}}', generateTagsCloudHTML(allTags))
    .replace('{{CONTENT}}', postHTML);
}

// Generate categories menu HTML for header
function generateCategoriesMenuHTML(categories) {
  if (!categories || categories.length === 0) return '';
  const categoriesList = categories.map(cat => {
    const slug = createSlug(cat);
    return `<a href="/category/${slug}.html" class="category-link">${cat}</a>`;
  }).join('');
  return `
    <div class="categories-dropdown">
      <button class="categories-toggle" onclick="toggleCategories()">קטגוריות ▼</button>
      <div class="categories-menu" id="categoriesMenu">
        ${categoriesList}
      </div>
    </div>
  `;
}

// Generate tags cloud HTML for footer
function generateTagsCloudHTML(tags) {
  if (!tags || tags.length === 0) return '';
  
  // Count tag frequency
  const tagCounts = {};
  tags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  
  // Sort by frequency and get unique tags
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
  
  // Generate tags with different sizes based on frequency
  const maxCount = Math.max(...Object.values(tagCounts));
  const tagsHTML = sortedTags.map(tag => {
    const count = tagCounts[tag];
    const size = Math.max(0.8, Math.min(1.5, 0.8 + (count / maxCount) * 0.7));
    return `<a href="/tag/${encodeURIComponent(tag)}.html" class="tag-cloud-item" style="font-size: ${size}em">${tag}</a>`;
  }).join('');
  
  return `
    <div class="tags-cloud">
      <h3>ענן תגיות</h3>
      <div class="tags-cloud-content">
        ${tagsHTML}
      </div>
    </div>
  `;
}

// Generate posts list HTML
function generatePostsListHTML(posts) {
  if (posts.length === 0) {
    return '<p>לא נמצאו פוסטים.</p>';
  }
  return posts
    .map(post => `
      <article class="post-preview">
        <h2><a href="/${encodeURIComponent(post.slug)}.html">${post.title}</a></h2>
        <p class="post-date">${formatDate(post.date) || ''}</p>
        <p class="post-excerpt">${cleanMarkdown(post.excerpt || post.body.substring(0, 200)) + '...'}</p>
        <a href="/${encodeURIComponent(post.slug)}.html" class="read-more">קרא עוד ←</a>
      </article>
    `)
    .join('');
}

// Generate index HTML
function generateIndexHTML(posts, allCategories, allTags) {
  const postsList = generatePostsListHTML(posts);
  const indexHTML = indexTemplate.replace('{{POSTS}}', postsList);
  
  const description = 'כסף כסף - מחשבונים פיננסיים ומדריכים פיננסיים. מחשבון ריבית דריבית, מחשבון משכנתא, מחשבון ברוטו נטו ועוד';
  const keywords = 'מחשבון ריבית דריבית, מחשבון משכנתא, מחשבון ברוטו נטו, מחשבונים פיננסיים, פנסיה, השקעות, תכנון פיננסי';
  
  return layoutTemplate
    .replace('{{TITLE}}', 'דף הבית')
    .replace('{{DESCRIPTION}}', description)
    .replace('{{KEYWORDS}}', keywords)
    .replace('{{CATEGORIES_MENU}}', generateCategoriesMenuHTML(allCategories))
    .replace('{{TAGS_CLOUD}}', generateTagsCloudHTML(allTags))
    .replace('{{CONTENT}}', indexHTML);
}

// Generate category page HTML
function generateCategoryPageHTML(categoryName, posts, allCategories, allTags) {
  const postsList = generatePostsListHTML(posts);
  const categoryHTML = categoryTemplate
    .replace('{{CATEGORY_NAME}}', categoryName)
    .replace('{{POSTS}}', postsList);
  
  const description = `מאמרים בקטגוריה ${categoryName}. מחשבון ריבית דריבית, מחשבון משכנתא, מחשבון ברוטו נטו ומדריכים נוספים`;
  const keywords = `מחשבון ריבית דריבית, מחשבון משכנתא, מחשבון ברוטו נטו, ${categoryName}`;
  
  return layoutTemplate
    .replace('{{TITLE}}', `קטגוריה: ${categoryName}`)
    .replace('{{DESCRIPTION}}', description)
    .replace('{{KEYWORDS}}', keywords)
    .replace('{{CATEGORIES_MENU}}', generateCategoriesMenuHTML(allCategories))
    .replace('{{TAGS_CLOUD}}', generateTagsCloudHTML(allTags))
    .replace('{{CONTENT}}', categoryHTML);
}

// Generate tag page HTML
function generateTagPageHTML(tagName, posts, allCategories, allTags) {
  const postsList = generatePostsListHTML(posts);
  const tagHTML = tagTemplate
    .replace('{{TAG_NAME}}', tagName)
    .replace('{{POSTS}}', postsList);
  
  const description = `מאמרים עם התגית ${tagName}. מחשבון ריבית דריבית, מחשבון משכנתא, מחשבון ברוטו נטו ומדריכים נוספים`;
  const keywords = `מחשבון ריבית דריבית, מחשבון משכנתא, מחשבון ברוטו נטו, ${tagName}`;
  
  return layoutTemplate
    .replace('{{TITLE}}', `תגית: ${tagName}`)
    .replace('{{DESCRIPTION}}', description)
    .replace('{{KEYWORDS}}', keywords)
    .replace('{{CATEGORIES_MENU}}', generateCategoriesMenuHTML(allCategories))
    .replace('{{TAGS_CLOUD}}', generateTagsCloudHTML(allTags))
    .replace('{{CONTENT}}', tagHTML);
}

// Main build function
function build() {
  console.log('Building blog...');
  
  const files = getMarkdownFiles();
  const allCategories = new Set();
  const allTags = [];
  
  const posts = files
    .map(file => {
      const parsed = parseMarkdownFile(file.path);
      
      // Collect categories and tags
      if (parsed.categories) {
        parsed.categories.forEach(cat => allCategories.add(cat));
      }
      if (parsed.tags) {
        allTags.push(...parsed.tags);
      }
      
      return {
        slug: file.slug,
        title: parsed.frontMatter.title || file.slug,
        date: parsed.frontMatter.date || '',
        excerpt: parsed.frontMatter.excerpt || '',
        body: parsed.body,
        html: parsed.html,
        categories: parsed.categories || [],
        tags: parsed.tags || []
      };
    })
    .sort((a, b) => {
      // Sort by date descending (newest first)
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

  // Convert categories set to sorted array
  const categoriesArray = Array.from(allCategories).sort();
  const uniqueTags = Array.from(new Set(allTags)).sort();

  // Generate index page
  const indexHTML = generateIndexHTML(posts, categoriesArray, allTags);
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexHTML);

  // Generate individual post pages
  posts.forEach(post => {
    const postHTML = generatePostHTML(post, posts, categoriesArray, allTags);
    fs.writeFileSync(path.join(DIST_DIR, `${post.slug}.html`), postHTML);
  });

  // Generate category pages
  const categoryDir = path.join(DIST_DIR, 'category');
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  categoriesArray.forEach(category => {
    const categoryPosts = posts.filter(post => 
      post.categories && post.categories.includes(category)
    );
    const categoryHTML = generateCategoryPageHTML(category, categoryPosts, categoriesArray, allTags);
    const categorySlug = createSlug(category);
    fs.writeFileSync(path.join(categoryDir, `${categorySlug}.html`), categoryHTML);
  });

  // Generate tag pages
  const tagDir = path.join(DIST_DIR, 'tag');
  if (!fs.existsSync(tagDir)) {
    fs.mkdirSync(tagDir, { recursive: true });
  }
  
  uniqueTags.forEach(tag => {
    const tagPosts = posts.filter(post => 
      post.tags && post.tags.includes(tag)
    );
    const tagHTML = generateTagPageHTML(tag, tagPosts, categoriesArray, allTags);
    const tagSlug = encodeURIComponent(tag);
    fs.writeFileSync(path.join(tagDir, `${tagSlug}.html`), tagHTML);
  });

  // Copy CSS file
  const cssPath = path.join(__dirname, 'styles', 'main.css');
  const distCssPath = path.join(DIST_DIR, 'styles');
  if (!fs.existsSync(distCssPath)) {
    fs.mkdirSync(distCssPath, { recursive: true });
  }
  fs.copyFileSync(cssPath, path.join(distCssPath, 'main.css'));

  // Create _redirects file for Cloudflare Pages (404 handling)
  const redirectsContent = `# Cloudflare Pages redirects
/* /index.html 200
`;
  fs.writeFileSync(path.join(DIST_DIR, '_redirects'), redirectsContent);

  console.log(`✓ Generated ${posts.length} posts`);
  console.log(`✓ Generated ${categoriesArray.length} category pages`);
  console.log(`✓ Generated ${uniqueTags.length} tag pages`);
  console.log(`✓ Build complete! Output: ${DIST_DIR}`);
}

// Run build
build();

