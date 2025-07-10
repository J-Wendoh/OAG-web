const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

// Function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Function to extract timestamp from folder name
function extractTimestamp(folderName) {
  const timestampMatch = folderName.match(/-(\d{8}T\d{6}Z)/);
  if (timestampMatch) {
    const timestamp = timestampMatch[1];
    // Convert from format 20250709T055803Z to ISO format
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    const hour = timestamp.substring(9, 11);
    const minute = timestamp.substring(11, 13);
    const second = timestamp.substring(13, 15);
    
    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  }
  return new Date().toISOString();
}

// Function to extract title from folder name
function extractTitle(folderName) {
  return folderName.split('-')[0].trim();
}

// Function to copy images to public directory
function copyImages(sourceDir, targetDir, articleSlug) {
  const images = [];
  const files = fs.readdirSync(sourceDir);
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      const sourcePath = path.join(sourceDir, file);
      const targetFileName = `${articleSlug}-${file}`;
      const targetPath = path.join(targetDir, targetFileName);
      
      fs.copyFileSync(sourcePath, targetPath);
      images.push(`/news-images/${targetFileName}`);
    }
  });
  
  return images;
}

// Function to process a single news folder
async function processNewsFolder(folderPath, folderName) {
  try {
    const title = extractTitle(folderName);
    const timestamp = extractTimestamp(folderName);
    const slug = createSlug(title);
    
    // Find the content folder (should be the only subdirectory)
    const items = fs.readdirSync(folderPath);
    const contentFolder = items.find(item => {
      const itemPath = path.join(folderPath, item);
      return fs.statSync(itemPath).isDirectory();
    });
    
    if (!contentFolder) {
      console.warn(`No content folder found in ${folderName}`);
      return null;
    }
    
    const contentPath = path.join(folderPath, contentFolder);
    const detailsPath = path.join(contentPath, 'Details.docx');
    
    if (!fs.existsSync(detailsPath)) {
      console.warn(`No Details.docx found in ${folderName}`);
      return null;
    }
    
    // Extract content from Details.docx
    const docxBuffer = fs.readFileSync(detailsPath);
    const result = await mammoth.extractRawText({ buffer: docxBuffer });
    const content = result.value.trim();
    
    // Create excerpt (first 150 characters)
    const excerpt = content.length > 150 ? content.substring(0, 150) + '...' : content;
    
    // Copy images to public directory
    const publicImagesDir = path.join(__dirname, '../website/public/news-images');
    const images = copyImages(contentPath, publicImagesDir, slug);
    
    // Create article object
    const article = {
      id: slug,
      slug: slug,
      title_en: title,
      title_sw: title, // For now, using same title - can be translated later
      excerpt_en: excerpt,
      excerpt_sw: excerpt, // For now, using same excerpt - can be translated later
      content_en: content,
      content_sw: content, // For now, using same content - can be translated later
      featured_image_url: images.length > 0 ? images[0] : undefined,
      images: images,
      status: 'published',
      is_featured: false, // Can be manually set later
      tags: [],
      category: 'General',
      created_at: timestamp,
      updated_at: timestamp,
      published_at: timestamp
    };
    
    console.log(`Processed: ${title}`);
    return article;
    
  } catch (error) {
    console.error(`Error processing ${folderName}:`, error);
    return null;
  }
}

// Main function to process all news folders
async function processAllNews() {
  const newsDir = path.join(__dirname, '../news');
  const outputPath = path.join(__dirname, '../website/src/data/processedNewsData.ts');
  
  if (!fs.existsSync(newsDir)) {
    console.error('News directory not found:', newsDir);
    return;
  }
  
  const folders = fs.readdirSync(newsDir).filter(item => {
    const itemPath = path.join(newsDir, item);
    return fs.statSync(itemPath).isDirectory();
  });
  
  console.log(`Found ${folders.length} news folders to process`);
  
  const articles = [];
  
  for (const folder of folders) {
    const folderPath = path.join(newsDir, folder);
    const article = await processNewsFolder(folderPath, folder);
    if (article) {
      articles.push(article);
    }
  }
  
  // Sort articles by publication date (newest first)
  articles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  
  // Mark first few articles as featured
  articles.slice(0, 3).forEach(article => {
    article.is_featured = true;
  });
  
  // Generate TypeScript file
  const tsContent = `/**
 * Processed News Data from /news directory
 * Generated automatically from Details.docx files and images
 */

export interface NewsArticle {
  id: string;
  slug: string;
  title_en: string;
  title_sw: string;
  excerpt_en: string;
  excerpt_sw: string;
  content_en: string;
  content_sw: string;
  featured_image_url?: string;
  images: string[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  tags: string[];
  category: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export const newsArticles: NewsArticle[] = ${JSON.stringify(articles, null, 2)};

// Helper functions for news data management
export const getFeaturedNews = (): NewsArticle[] => {
  return newsArticles.filter(article => article.is_featured && article.status === 'published');
};

export const getPublishedNews = (): NewsArticle[] => {
  return newsArticles.filter(article => article.status === 'published');
};

export const getNewsByCategory = (category: string): NewsArticle[] => {
  return newsArticles.filter(article => 
    article.category === category && article.status === 'published'
  );
};

export const getNewsByTag = (tag: string): NewsArticle[] => {
  return newsArticles.filter(article => 
    article.tags.includes(tag) && article.status === 'published'
  );
};

export const searchNews = (query: string): NewsArticle[] => {
  const searchTerm = query.toLowerCase();
  return newsArticles.filter(article => 
    article.status === 'published' && (
      article.title_en.toLowerCase().includes(searchTerm) ||
      article.title_sw.toLowerCase().includes(searchTerm) ||
      article.excerpt_en.toLowerCase().includes(searchTerm) ||
      article.excerpt_sw.toLowerCase().includes(searchTerm) ||
      article.content_en.toLowerCase().includes(searchTerm) ||
      article.content_sw.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  );
};

export const getNewsById = (id: string): NewsArticle | undefined => {
  return newsArticles.find(article => article.id === id);
};

export const getNewsBySlug = (slug: string): NewsArticle | undefined => {
  return newsArticles.find(article => article.slug === slug);
};

export default newsArticles;
`;
  
  fs.writeFileSync(outputPath, tsContent);
  console.log(`Generated ${articles.length} articles in ${outputPath}`);
  console.log('News processing completed!');
}

// Run the script
processAllNews().catch(console.error);
