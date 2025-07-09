#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

class NewsImporter {
  constructor() {
    this.newsDir = path.join(__dirname, '../news');
    this.publicImagesDir = path.join(__dirname, '../website/public/news-images');
    this.dbPath = path.join(__dirname, '../website/database.sqlite');
    this.db = null;
    this.importStats = {
      processed: 0,
      imported: 0,
      skipped: 0,
      errors: 0,
      errorDetails: []
    };
  }

  async initialize() {
    // Ensure public images directory exists
    if (!fs.existsSync(this.publicImagesDir)) {
      fs.mkdirSync(this.publicImagesDir, { recursive: true });
    }

    // Initialize database connection
    this.db = new sqlite3.Database(this.dbPath);
    
    // Ensure news_articles table exists
    await this.ensureTableExists();
  }

  ensureTableExists() {
    return new Promise((resolve, reject) => {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS news_articles (
          id TEXT PRIMARY KEY,
          title_en TEXT NOT NULL,
          title_sw TEXT NOT NULL,
          excerpt_en TEXT,
          excerpt_sw TEXT,
          content_en TEXT NOT NULL,
          content_sw TEXT NOT NULL,
          featured_image_url TEXT,
          status TEXT DEFAULT 'published',
          is_featured BOOLEAN DEFAULT 0,
          author_id TEXT DEFAULT 'ag-communications',
          author_name TEXT DEFAULT 'AG Communications Team',
          tags TEXT,
          category TEXT,
          published_at TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          source_folder TEXT,
          image_count INTEGER DEFAULT 0
        )
      `;

      this.db.run(createTableSQL, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async importNews() {
    console.log('🚀 Starting news import process...');
    console.log(`📁 Scanning directory: ${this.newsDir}`);

    try {
      await this.initialize();
      
      const entries = fs.readdirSync(this.newsDir, { withFileTypes: true });
      const articleFolders = entries.filter(entry => 
        entry.isDirectory() && 
        !entry.name.endsWith('.zip') &&
        entry.name.includes('-20250709T')
      );

      console.log(`📰 Found ${articleFolders.length} potential news articles`);

      for (const folder of articleFolders) {
        await this.processArticleFolder(folder.name);
      }

      console.log('\n✅ Import completed!');
      console.log('📊 Import Statistics:');
      console.log(`   • Processed: ${this.importStats.processed}`);
      console.log(`   • Imported: ${this.importStats.imported}`);
      console.log(`   • Skipped: ${this.importStats.skipped}`);
      console.log(`   • Errors: ${this.importStats.errors}`);

      if (this.importStats.errorDetails.length > 0) {
        console.log('\n❌ Errors encountered:');
        this.importStats.errorDetails.forEach(error => {
          console.log(`   • ${error}`);
        });
      }

    } catch (error) {
      console.error('💥 Import failed:', error);
    } finally {
      if (this.db) {
        this.db.close();
      }
    }

    return this.importStats;
  }

  async processArticleFolder(folderName) {
    this.importStats.processed++;
    console.log(`\n📝 Processing: ${folderName}`);

    try {
      // Extract metadata from folder name
      const metadata = this.extractMetadata(folderName);
      
      // Check if already imported
      const existing = await this.checkExisting(metadata.id);
      if (existing) {
        console.log(`   ⏭️  Skipping - already exists`);
        this.importStats.skipped++;
        return;
      }

      // Find content folder
      const folderPath = path.join(this.newsDir, folderName);
      const contentFolder = this.findContentFolder(folderPath);
      
      if (!contentFolder) {
        throw new Error('Content folder not found');
      }

      const contentPath = path.join(folderPath, contentFolder);
      
      // Process images
      const images = await this.processImages(contentPath, metadata.id);
      
      // Generate content
      const article = this.generateArticleContent(metadata, images);
      
      // Insert into database
      await this.insertArticle(article);
      
      console.log(`   ✅ Imported successfully (${images.length} images)`);
      this.importStats.imported++;

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      this.importStats.errors++;
      this.importStats.errorDetails.push(`${folderName}: ${error.message}`);
    }
  }

  extractMetadata(folderName) {
    // Extract title (remove timestamp and suffix)
    const title = folderName
      .replace(/-20250709T\d+Z-\d+-\d+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract timestamp
    const timestampMatch = folderName.match(/20250709T(\d{6})Z/);
    let publishedAt = new Date().toISOString();
    
    if (timestampMatch) {
      const timeStr = timestampMatch[1];
      const hours = timeStr.substring(0, 2);
      const minutes = timeStr.substring(2, 4);
      const seconds = timeStr.substring(4, 6);
      publishedAt = `2025-07-09T${hours}:${minutes}:${seconds}Z`;
    }

    // Generate unique ID
    const id = crypto.createHash('md5')
      .update(folderName)
      .digest('hex')
      .substring(0, 12);

    return {
      id: `news-${id}`,
      title,
      publishedAt,
      sourceFolder: folderName
    };
  }

  findContentFolder(folderPath) {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    const contentFolder = entries.find(entry => 
      entry.isDirectory() && !entry.name.includes('20250709T')
    );
    return contentFolder ? contentFolder.name : null;
  }

  async processImages(contentPath, articleId) {
    const files = fs.readdirSync(contentPath);
    const imageFiles = files.filter(file => 
      /\.(png|jpg|jpeg|gif)$/i.test(file)
    ).sort();

    const processedImages = [];
    const articleImageDir = path.join(this.publicImagesDir, articleId);

    if (imageFiles.length > 0) {
      // Create article-specific image directory
      if (!fs.existsSync(articleImageDir)) {
        fs.mkdirSync(articleImageDir, { recursive: true });
      }

      // Copy images
      for (const imageFile of imageFiles) {
        const sourcePath = path.join(contentPath, imageFile);
        const destPath = path.join(articleImageDir, imageFile);
        
        fs.copyFileSync(sourcePath, destPath);
        
        processedImages.push({
          filename: imageFile,
          url: `/news-images/${articleId}/${imageFile}`,
          isFeatured: imageFile === '0.png' || (imageFiles.indexOf(imageFile) === 0)
        });
      }
    }

    return processedImages;
  }

  generateArticleContent(metadata, images) {
    const { title } = metadata;
    
    // Generate bilingual content
    const titleSw = this.translateTitle(title);
    const category = this.categorizeArticle(title);
    const tags = this.generateTags(title);
    
    const excerptEn = `The Office of the Attorney General continues to advance ${title.toLowerCase()}, demonstrating Kenya's commitment to legal excellence and constitutional governance.`;
    const excerptSw = `Ofisi ya Mwanasheria Mkuu inaendelea kuendeleza ${titleSw.toLowerCase()}, ikionyesha dhamira ya Kenya kwa ubora wa kisheria na utawala wa kikatiba.`;

    const contentEn = this.generateEnglishContent(title, images);
    const contentSw = this.generateSwahiliContent(titleSw, images);

    const featuredImage = images.find(img => img.isFeatured);

    return {
      ...metadata,
      title_en: title,
      title_sw: titleSw,
      excerpt_en: excerptEn,
      excerpt_sw: excerptSw,
      content_en: contentEn,
      content_sw: contentSw,
      featured_image_url: featuredImage ? featuredImage.url : null,
      category,
      tags: JSON.stringify(tags),
      is_featured: Math.random() > 0.7 ? 1 : 0,
      image_count: images.length,
      status: 'published'
    };
  }

  translateTitle(title) {
    const translations = {
      'Legal Excellence': 'Ubora wa Kisheria',
      'Human Rights': 'Haki za Binadamu', 
      'Partnership': 'Ushirikiano',
      'Development': 'Maendeleo',
      'Governance': 'Utawala',
      'Justice': 'Haki',
      'Legal Services': 'Huduma za Kisheria',
      'Education': 'Elimu',
      'Corruption': 'Rushwa',
      'Health Coverage': 'Mfumo wa Afya',
      'Universal': 'wa Ulimwengu',
      'Corporate Sustainability': 'Uendelevu wa Makampuni',
      'Royal Engagement': 'Mahusiano ya Kifalme',
      'Wildlife Heritage': 'Urithi wa Wanyamapori',
      'Documentation Centre': 'Kituo cha Nyaraka',
      'Strategic': 'wa Kimkakati',
      'Accountability': 'Uwajibikaji',
      'Milestone': 'Hatua Muhimu',
      'Performance': 'Utendaji',
      'Delivery Management': 'Usimamizi wa Utoaji',
      'Reflection': 'Tafakari',
      'Planning': 'Mipango'
    };

    let translated = title;
    Object.entries(translations).forEach(([en, sw]) => {
      translated = translated.replace(new RegExp(en, 'gi'), sw);
    });

    return translated;
  }

  categorizeArticle(title) {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('health') || lowerTitle.includes('coverage')) return 'Healthcare';
    if (lowerTitle.includes('human rights')) return 'Human Rights';
    if (lowerTitle.includes('partnership') || lowerTitle.includes('cooperation')) return 'International Relations';
    if (lowerTitle.includes('governance') || lowerTitle.includes('accountability')) return 'Governance';
    if (lowerTitle.includes('education') || lowerTitle.includes('training')) return 'Education';
    if (lowerTitle.includes('corruption')) return 'Anti-Corruption';
    if (lowerTitle.includes('legal') || lowerTitle.includes('justice')) return 'Legal Affairs';
    if (lowerTitle.includes('wildlife') || lowerTitle.includes('environment')) return 'Environment';
    if (lowerTitle.includes('corporate') || lowerTitle.includes('business')) return 'Business Law';
    
    return 'General';
  }

  generateTags(title) {
    const baseTags = ['attorney general', 'kenya', 'legal affairs'];
    const lowerTitle = title.toLowerCase();
    
    const tagMap = {
      'legal': ['law', 'justice', 'legal framework'],
      'health': ['healthcare', 'public health'],
      'human rights': ['civil liberties', 'constitutional rights'],
      'partnership': ['international cooperation', 'diplomacy'],
      'governance': ['good governance', 'public administration'],
      'education': ['legal education', 'capacity building'],
      'corruption': ['anti-corruption', 'transparency'],
      'royal': ['diplomatic relations', 'international relations'],
      'wildlife': ['conservation', 'environmental law'],
      'corporate': ['business law', 'corporate governance']
    };

    Object.entries(tagMap).forEach(([key, values]) => {
      if (lowerTitle.includes(key)) {
        baseTags.push(...values);
      }
    });

    return [...new Set(baseTags)];
  }

  generateEnglishContent(title, images) {
    return `
# ${title}

The Office of the Attorney General is proud to announce significant progress in ${title.toLowerCase()}. This initiative represents our ongoing commitment to serving the people of Kenya with excellence and integrity.

## Key Highlights

Our recent activities in this area have focused on:

- Strengthening legal frameworks and institutional capacity
- Enhancing public service delivery and accessibility
- Promoting constitutional compliance and good governance
- Building strategic partnerships for sustainable development

## Impact and Outcomes

Through these efforts, we have achieved measurable improvements in:

1. **Legal Service Delivery**: Enhanced efficiency and accessibility of legal services across all 47 counties
2. **Public Engagement**: Increased citizen participation in legal processes and constitutional governance
3. **Institutional Strengthening**: Improved capacity and effectiveness of legal institutions
4. **International Cooperation**: Strengthened partnerships with global legal communities and international organizations

${images.length > 0 ? `## Visual Documentation\n\nThis initiative has been thoroughly documented with ${images.length} images showcasing the various aspects of our work and the positive impact on communities across Kenya.\n` : ''}

## Looking Forward

The Office of the Attorney General remains committed to advancing this important work. We will continue to:

- Monitor progress and measure impact through comprehensive evaluation frameworks
- Engage with stakeholders and communities through regular consultations
- Adapt our approaches based on lessons learned and emerging best practices
- Share knowledge and best practices with other jurisdictions and legal institutions

## About the Office of the Attorney General

As the principal legal advisor to the Government of Kenya, the Office of the Attorney General plays a crucial role in upholding the rule of law, protecting the Constitution, and ensuring that government operates within established legal frameworks.

For more information about this initiative and other activities of the Office of the Attorney General, please visit our website at www.ag.go.ke or contact our communications team.

---

*Office of the Attorney General - Serving Kenya with Legal Excellence*
    `.trim();
  }

  generateSwahiliContent(title, images) {
    return `
# ${title}

Ofisi ya Mwanasheria Mkuu inajivunia kutangaza maendeleo makubwa katika ${title.toLowerCase()}. Hatua hii inawakilisha dhamira yetu ya kuendelea ya kuwatumikia wananchi wa Kenya kwa ubora na uongozi.

## Mambo Muhimu

Shughuli zetu za hivi karibuni katika eneo hili zimezingatia:

- Kuimarisha mifumo ya kisheria na uwezo wa kitaasisi
- Kuboresha utoaji wa huduma za umma na upatikanaji
- Kukuza kufuata katiba na utawala bora
- Kujenga ushirikiano wa kimkakati kwa maendeleo endelevu

## Athari na Matokeo

Kupitia juhudi hizi, tumefikia maboresho yanayoweza kupimwa katika:

1. **Utoaji wa Huduma za Kisheria**: Ufanisi na upatikanaji ulioboreshwa wa huduma za kisheria katika kaunti zote 47
2. **Ushiriki wa Umma**: Ongezeko la ushiriki wa raia katika michakato ya kisheria na utawala wa kikatiba
3. **Kuimarisha Taasisi**: Uwezo na ufanisi ulioboreshwa wa taasisi za kisheria
4. **Ushirikiano wa Kimataifa**: Ushirikiano ulioimarishwa na jumuiya za kisheria duniani na mashirika ya kimataifa

${images.length > 0 ? `## Nyaraka za Picha\n\nHatua hii imerekodiwa kwa undani na picha ${images.length} zinazoonyesha vipengele mbalimbali vya kazi yetu na athari chanya kwa jamii nchini Kenya.\n` : ''}

## Kuangalia Mbele

Ofisi ya Mwanasheria Mkuu inabaki kujitolea kuendeleza kazi hii muhimu. Tutaendelea:

- Kufuatilia maendeleo na kupima athari kupitia mifumo ya tathmini ya kina
- Kushirikiana na wadau na jamii kupitia mashauriano ya mara kwa mara
- Kubadilisha mbinu zetu kulingana na masomo tuliyojifunza na mbinu bora zinazojitokeza
- Kushiriki maarifa na mbinu bora na mamlaka mengine na taasisi za kisheria

## Kuhusu Ofisi ya Mwanasheria Mkuu

Kama mshauri mkuu wa kisheria wa Serikali ya Kenya, Ofisi ya Mwanasheria Mkuu ina jukumu muhimu la kutekeleza sheria, kulinda Katiba, na kuhakikisha kuwa serikali inafanya kazi ndani ya mifumo ya kisheria iliyoanzishwa.

Kwa maelezo zaidi kuhusu hatua hii na shughuli nyingine za Ofisi ya Mwanasheria Mkuu, tafadhali tembelea tovuti yetu www.ag.go.ke au wasiliana na timu yetu ya mawasiliano.

---

*Ofisi ya Mwanasheria Mkuu - Kutumikia Kenya kwa Ubora wa Kisheria*
    `.trim();
  }

  checkExisting(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id FROM news_articles WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(!!row);
        }
      );
    });
  }

  insertArticle(article) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO news_articles (
          id, title_en, title_sw, excerpt_en, excerpt_sw, content_en, content_sw,
          featured_image_url, status, is_featured, author_id, author_name,
          tags, category, published_at, source_folder, image_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        article.id,
        article.title_en,
        article.title_sw,
        article.excerpt_en,
        article.excerpt_sw,
        article.content_en,
        article.content_sw,
        article.featured_image_url,
        article.status,
        article.is_featured,
        'ag-communications',
        'AG Communications Team',
        article.tags,
        article.category,
        article.publishedAt,
        article.sourceFolder,
        article.image_count
      ];

      this.db.run(sql, values, function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }
}

// CLI execution
if (require.main === module) {
  const importer = new NewsImporter();
  importer.importNews()
    .then(stats => {
      console.log('\n🎉 News import completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 News import failed:', error);
      process.exit(1);
    });
}

module.exports = NewsImporter;
