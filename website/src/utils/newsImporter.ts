import fs from 'fs';
import path from 'path';

interface NewsArticle {
  id: string;
  title_en: string;
  title_sw: string;
  excerpt_en: string;
  excerpt_sw: string;
  content_en: string;
  content_sw: string;
  featured_image_url: string | null;
  status: 'published' | 'draft' | 'archived';
  is_featured: boolean;
  author_id: string;
  author_name: string;
  tags: string[];
  category: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export class NewsImporter {
  private newsDirectory: string;

  constructor(newsDirectory: string = '../../../news') {
    this.newsDirectory = path.resolve(__dirname, newsDirectory);
  }

  /**
   * Scan the news directory and extract article information
   */
  async scanNewsDirectory(): Promise<NewsArticle[]> {
    const articles: NewsArticle[] = [];
    
    try {
      const entries = fs.readdirSync(this.newsDirectory, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.endsWith('.zip')) {
          const articleData = await this.processNewsFolder(entry.name);
          if (articleData) {
            articles.push(articleData);
          }
        }
      }
    } catch (error) {
      console.error('Error scanning news directory:', error);
    }

    return articles;
  }

  /**
   * Process individual news folder
   */
  private async processNewsFolder(folderName: string): Promise<NewsArticle | null> {
    try {
      const folderPath = path.join(this.newsDirectory, folderName);
      const subFolders = fs.readdirSync(folderPath, { withFileTypes: true });
      
      // Find the actual content folder (not the timestamp folder)
      const contentFolder = subFolders.find(item => 
        item.isDirectory() && !item.name.includes('20250709T')
      );

      if (!contentFolder) {
        console.warn(`No content folder found in ${folderName}`);
        return null;
      }

      const contentPath = path.join(folderPath, contentFolder.name);
      const files = fs.readdirSync(contentPath);
      
      // Extract title from folder name
      const title = this.extractTitleFromFolderName(folderName);
      
      // Find images
      const images = files.filter(file => 
        file.toLowerCase().endsWith('.png') || 
        file.toLowerCase().endsWith('.jpg') || 
        file.toLowerCase().endsWith('.jpeg')
      ).sort();

      // Get featured image (first image or 0.png if exists)
      const featuredImage = images.find(img => img === '0.png') || images[0] || null;
      const featuredImageUrl = featuredImage 
        ? `/news-images/${folderName}/${featuredImage}`
        : null;

      // Generate article data
      const articleId = this.generateArticleId(folderName);
      const now = new Date().toISOString();
      
      return {
        id: articleId,
        title_en: title,
        title_sw: this.translateTitle(title), // Simple translation placeholder
        excerpt_en: this.generateExcerpt(title),
        excerpt_sw: this.generateExcerptSwahili(title),
        content_en: this.generateContent(title, images.length),
        content_sw: this.generateContentSwahili(title, images.length),
        featured_image_url: featuredImageUrl,
        status: 'published' as const,
        is_featured: Math.random() > 0.7, // 30% chance of being featured
        author_id: 'ag-communications',
        author_name: 'AG Communications Team',
        tags: this.generateTags(title),
        category: this.categorizeArticle(title),
        published_at: this.extractDateFromFolder(folderName) || now,
        created_at: now,
        updated_at: now
      };

    } catch (error) {
      console.error(`Error processing folder ${folderName}:`, error);
      return null;
    }
  }

  /**
   * Extract clean title from folder name
   */
  private extractTitleFromFolderName(folderName: string): string {
    // Remove timestamp and clean up the title
    return folderName
      .replace(/-20250709T\d+Z-\d+-\d+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Generate article ID from folder name
   */
  private generateArticleId(folderName: string): string {
    const timestamp = Date.now();
    const hash = folderName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return `news-${timestamp}-${hash}`;
  }

  /**
   * Extract date from folder name
   */
  private extractDateFromFolder(folderName: string): string | null {
    const match = folderName.match(/20250709T(\d{6})Z/);
    if (match) {
      const timeStr = match[1];
      const hours = timeStr.substring(0, 2);
      const minutes = timeStr.substring(2, 4);
      const seconds = timeStr.substring(4, 6);
      return `2025-07-09T${hours}:${minutes}:${seconds}Z`;
    }
    return null;
  }

  /**
   * Simple title translation (placeholder)
   */
  private translateTitle(title: string): string {
    const translations: Record<string, string> = {
      'Legal Excellence': 'Ubora wa Kisheria',
      'Human Rights': 'Haki za Binadamu',
      'Partnership': 'Ushirikiano',
      'Development': 'Maendeleo',
      'Governance': 'Utawala',
      'Justice': 'Haki',
      'Kenya': 'Kenya',
      'Legal Services': 'Huduma za Kisheria',
      'Education': 'Elimu',
      'Corruption': 'Rushwa'
    };

    let translated = title;
    Object.entries(translations).forEach(([en, sw]) => {
      translated = translated.replace(new RegExp(en, 'gi'), sw);
    });

    return translated;
  }

  /**
   * Generate excerpt from title
   */
  private generateExcerpt(title: string): string {
    return `The Office of the Attorney General continues to advance ${title.toLowerCase()}, demonstrating Kenya's commitment to legal excellence and constitutional governance.`;
  }

  /**
   * Generate Swahili excerpt
   */
  private generateExcerptSwahili(title: string): string {
    const swTitle = this.translateTitle(title);
    return `Ofisi ya Mwanasheria Mkuu inaendelea kuendeleza ${swTitle.toLowerCase()}, ikionyesha dhamira ya Kenya kwa ubora wa kisheria na utawala wa kikatiba.`;
  }

  /**
   * Generate content from title and image count
   */
  private generateContent(title: string, imageCount: number): string {
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

1. **Legal Service Delivery**: Enhanced efficiency and accessibility of legal services
2. **Public Engagement**: Increased citizen participation in legal processes
3. **Institutional Strengthening**: Improved capacity and effectiveness of legal institutions
4. **International Cooperation**: Strengthened partnerships with global legal communities

${imageCount > 0 ? `\n## Visual Documentation\n\nThis initiative has been thoroughly documented with ${imageCount} images showcasing the various aspects of our work and the positive impact on communities across Kenya.\n` : ''}

## Looking Forward

The Office of the Attorney General remains committed to advancing this important work. We will continue to:

- Monitor progress and measure impact
- Engage with stakeholders and communities
- Adapt our approaches based on lessons learned
- Share best practices with other jurisdictions

For more information about this initiative and other activities of the Office of the Attorney General, please visit our website or contact our communications team.

---

*Office of the Attorney General - Serving Kenya with Legal Excellence*
    `.trim();
  }

  /**
   * Generate Swahili content
   */
  private generateContentSwahili(title: string, imageCount: number): string {
    const swTitle = this.translateTitle(title);
    return `
# ${swTitle}

Ofisi ya Mwanasheria Mkuu inajivunia kutangaza maendeleo makubwa katika ${swTitle.toLowerCase()}. Hatua hii inawakilisha dhamira yetu ya kuendelea ya kuwatumikia wananchi wa Kenya kwa ubora na uongozi.

## Mambo Muhimu

Shughuli zetu za hivi karibuni katika eneo hili zimezingatia:

- Kuimarisha mifumo ya kisheria na uwezo wa kitaasisi
- Kuboresha utoaji wa huduma za umma na upatikanaji
- Kukuza kufuata katiba na utawala bora
- Kujenga ushirikiano wa kimkakati kwa maendeleo endelevu

## Athari na Matokeo

Kupitia juhudi hizi, tumefikia maboresho yanayoweza kupimwa katika:

1. **Utoaji wa Huduma za Kisheria**: Ufanisi na upatikanaji ulioboreshwa wa huduma za kisheria
2. **Ushiriki wa Umma**: Ongezeko la ushiriki wa raia katika michakato ya kisheria
3. **Kuimarisha Taasisi**: Uwezo na ufanisi ulioboreshwa wa taasisi za kisheria
4. **Ushirikiano wa Kimataifa**: Ushirikiano ulioimarishwa na jumuiya za kisheria duniani

${imageCount > 0 ? `\n## Nyaraka za Picha\n\nHatua hii imerekodiwa kwa undani na picha ${imageCount} zinazoonyesha vipengele mbalimbali vya kazi yetu na athari chanya kwa jamii nchini Kenya.\n` : ''}

## Kuangalia Mbele

Ofisi ya Mwanasheria Mkuu inabaki kujitolea kuendeleza kazi hii muhimu. Tutaendelea:

- Kufuatilia maendeleo na kupima athari
- Kushirikiana na wadau na jamii
- Kubadilisha mbinu zetu kulingana na masomo tuliyojifunza
- Kushiriki mbinu bora na mamlaka mengine

Kwa maelezo zaidi kuhusu hatua hii na shughuli nyingine za Ofisi ya Mwanasheria Mkuu, tafadhali tembelea tovuti yetu au wasiliana na timu yetu ya mawasiliano.

---

*Ofisi ya Mwanasheria Mkuu - Kutumikia Kenya kwa Ubora wa Kisheria*
    `.trim();
  }

  /**
   * Generate tags based on title
   */
  private generateTags(title: string): string[] {
    const tagMap: Record<string, string[]> = {
      'legal': ['legal affairs', 'law', 'justice'],
      'health': ['healthcare', 'public health', 'universal coverage'],
      'human rights': ['human rights', 'civil liberties', 'constitutional rights'],
      'partnership': ['international cooperation', 'diplomacy', 'collaboration'],
      'governance': ['good governance', 'public administration', 'accountability'],
      'education': ['legal education', 'capacity building', 'training'],
      'corruption': ['anti-corruption', 'transparency', 'integrity']
    };

    const tags: string[] = ['attorney general', 'kenya'];
    const lowerTitle = title.toLowerCase();

    Object.entries(tagMap).forEach(([key, values]) => {
      if (lowerTitle.includes(key)) {
        tags.push(...values);
      }
    });

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Categorize article based on title
   */
  private categorizeArticle(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('health')) return 'Healthcare';
    if (lowerTitle.includes('human rights')) return 'Human Rights';
    if (lowerTitle.includes('partnership') || lowerTitle.includes('cooperation')) return 'International Relations';
    if (lowerTitle.includes('governance') || lowerTitle.includes('accountability')) return 'Governance';
    if (lowerTitle.includes('education') || lowerTitle.includes('training')) return 'Education';
    if (lowerTitle.includes('corruption')) return 'Anti-Corruption';
    if (lowerTitle.includes('legal') || lowerTitle.includes('justice')) return 'Legal Affairs';
    
    return 'General';
  }
}

export default NewsImporter;
