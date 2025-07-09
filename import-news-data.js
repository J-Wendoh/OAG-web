const fs = require('fs');
const path = require('path');

// Function to process news folders and extract data
const processNewsFolder = (folderPath) => {
  const folderName = path.basename(folderPath);

  // Extract title from folder name (remove timestamp)
  const title = folderName.replace(/-\d{8}T\d{6}Z-\d+-\d{3}$/, '').replace(/-/g, ' ');

  // Generate slug from title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Default content based on title
  const content = `The Office of the Attorney General continues to advance ${title.toLowerCase()} through strategic legal frameworks and comprehensive policy development. This initiative represents our ongoing commitment to serving the people of Kenya with excellence and integrity.`;

  const excerpt = content.substring(0, 200) + '...';

  return {
    title_en: title,
    title_sw: title, // For now, using same title - can be translated later
    slug: slug,
    excerpt_en: excerpt,
    excerpt_sw: excerpt, // For now, using same excerpt - can be translated later
    content_en: content,
    content_sw: content, // For now, using same content - can be translated later
    status: 'published',
    is_featured: false,
    published_at: new Date().toISOString()
  };
};

// Read news folders and process them
const newsDir = './news';
const newsData = [];

if (fs.existsSync(newsDir)) {
  const folders = fs.readdirSync(newsDir).filter(item => {
    const fullPath = path.join(newsDir, item);
    return fs.statSync(fullPath).isDirectory() && !item.startsWith('.');
  });

  folders.forEach(folder => {
    const folderPath = path.join(newsDir, folder);
    const newsItem = processNewsFolder(folderPath);
    newsData.push(newsItem);
  });
}

// Add some sample featured articles if no news folders found
if (newsData.length === 0) {
  newsData.push(
    {
      title_en: "Historic Royal Engagement Celebrating Kenya's Legal Excellence",
      title_sw: "Mkutano wa Kihistoria wa Kifalme Kusherehekea Ubora wa Kisheria wa Kenya",
      slug: "historic-royal-engagement-celebrating-kenyas-legal-excellence",
      excerpt_en: "Attorney General Hon. Dorcas Oduor today held consultative meetings with His Majesty King Willem-Alexander and Her Majesty Queen Maxima of the Netherlands at the Supreme Court of Kenya during their state visit to Kenya.",
      excerpt_sw: "Mwanasheria Mkuu Mhe. Dorcas Oduor leo amefanya mikutano ya mazungumzo na Mfalme Willem-Alexander na Malkia Maxima wa Uholanzi katika Mahakama Kuu ya Kenya wakati wa ziara yao ya kikazi nchini Kenya.",
      content_en: "Attorney General Hon. Dorcas Oduor today held consultative meetings with His Majesty King Willem-Alexander and Her Majesty Queen Maxima of the Netherlands at the Supreme Court of Kenya during their state visit to Kenya. The engagement reaffirmed the strong partnership between Kenya and the Netherlands, emphasizing our shared commitment to Rule of Law, Democracy, and Good Governance. The Royal Couple celebrated Kenya's remarkable strides in female leadership across the justice sector, recognizing the exceptional growth of women in the legal profession and their pivotal role in championing equal access to justice.",
      content_sw: "Mwanasheria Mkuu Mhe. Dorcas Oduor leo amefanya mikutano ya mazungumzo na Mfalme Willem-Alexander na Malkia Maxima wa Uholanzi katika Mahakama Kuu ya Kenya wakati wa ziara yao ya kikazi nchini Kenya. Mkutano huu umethibitisha ushirikiano mkubwa kati ya Kenya na Uholanzi, ukisisitiza kujitolea kwetu pamoja kwa Utawala wa Sheria, Demokrasia, na Utawala Bora. Wajumbe wa Kifalme walisherehekea maendeleo makubwa ya Kenya katika uongozi wa kike katika sekta ya haki, wakitambua ukuaji wa kipekee wa wanawake katika taaluma ya sheria na jukumu lao muhimu katika kutetea upatikanaji wa haki kwa wote.",
      status: "published",
      is_featured: true,
      published_at: "2025-03-20T12:00:00Z"
    },
    {
      title_en: "Strengthening International Legal Cooperation",
      title_sw: "Kuimarisha Ushirikiano wa Kisheria wa Kimataifa",
      slug: "strengthening-international-legal-cooperation",
      excerpt_en: "The Royal Couple celebrated Kenya's remarkable strides in female leadership across the justice sector, recognizing the exceptional growth of women in the legal profession.",
      excerpt_sw: "Wajumbe wa Kifalme walisherehekea maendeleo makubwa ya Kenya katika uongozi wa kike katika sekta ya haki, wakitambua ukuaji wa kipekee wa wanawake katika taaluma ya sheria.",
      content_en: "The Royal Couple celebrated Kenya's remarkable strides in female leadership across the justice sector, recognizing the exceptional growth of women in the legal profession and their pivotal role in championing equal access to justice. This recognition highlights Kenya's commitment to gender equality and women's empowerment in the legal sector.",
      content_sw: "Wajumbe wa Kifalme walisherehekea maendeleo makubwa ya Kenya katika uongozi wa kike katika sekta ya haki, wakitambua ukuaji wa kipekee wa wanawake katika taaluma ya sheria na jukumu lao muhimu katika kutetea upatikanaji wa haki kwa wote. Utambuzi huu unaangazia kujitolea kwa Kenya kwa usawa wa kijinsia na uwezeshaji wa wanawake katika sekta ya kisheria.",
      status: "published",
      is_featured: false,
      published_at: "2025-01-18T14:30:00Z"
    }
  );
}

// Generate SQL insert statements
const generateSQL = () => {
  let sql = "-- News data import for news_articles table\n\n";

  newsData.forEach(article => {
    sql += `INSERT INTO news_articles (title_en, title_sw, slug, excerpt_en, excerpt_sw, content_en, content_sw, status, is_featured, published_at) VALUES (\n`;
    sql += `  '${article.title_en.replace(/'/g, "''")}',\n`;
    sql += `  '${article.title_sw.replace(/'/g, "''")}',\n`;
    sql += `  '${article.slug}',\n`;
    sql += `  '${article.excerpt_en.replace(/'/g, "''")}',\n`;
    sql += `  '${article.excerpt_sw.replace(/'/g, "''")}',\n`;
    sql += `  '${article.content_en.replace(/'/g, "''")}',\n`;
    sql += `  '${article.content_sw.replace(/'/g, "''")}',\n`;
    sql += `  '${article.status}',\n`;
    sql += `  ${article.is_featured},\n`;
    sql += `  '${article.published_at}'\n`;
    sql += `);\n\n`;
  });

  return sql;
};

// Write SQL to file
const sql = generateSQL();
fs.writeFileSync('news-import.sql', sql);
console.log('News import SQL generated: news-import.sql');
console.log(`Generated ${newsData.length} news articles for import.`);
