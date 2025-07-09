const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// News Import API
const newsImportRouter = require('./src/api/news-import-api.cjs');
app.use('/api/news', newsImportRouter);

// News API endpoints
app.get('/api/news', (req, res) => {
  const sql = `
    SELECT * FROM news_articles 
    WHERE status = 'published' 
    ORDER BY published_at DESC 
    LIMIT 20
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching news:', err);
      return res.status(500).json({ error: 'Failed to fetch news' });
    }
    
    // Parse tags JSON
    const articles = rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      is_featured: Boolean(row.is_featured)
    }));
    
    res.json(articles);
  });
});

app.get('/api/news/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  const sql = `
    SELECT * FROM news_articles 
    WHERE status = 'published' 
    AND (
      title_en LIKE ? OR 
      title_sw LIKE ? OR 
      content_en LIKE ? OR 
      content_sw LIKE ? OR
      excerpt_en LIKE ? OR
      excerpt_sw LIKE ?
    )
    ORDER BY published_at DESC 
    LIMIT 10
  `;
  
  const searchTerm = `%${query}%`;
  const params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error searching news:', err);
      return res.status(500).json({ error: 'Failed to search news' });
    }
    
    const articles = rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      is_featured: Boolean(row.is_featured)
    }));
    
    res.json(articles);
  });
});

app.get('/api/news/featured', (req, res) => {
  const sql = `
    SELECT * FROM news_articles 
    WHERE status = 'published' AND is_featured = 1
    ORDER BY published_at DESC 
    LIMIT 5
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching featured news:', err);
      return res.status(500).json({ error: 'Failed to fetch featured news' });
    }
    
    const articles = rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      is_featured: Boolean(row.is_featured)
    }));
    
    res.json(articles);
  });
});

// Hero sections API
app.get('/api/hero-sections', (req, res) => {
  // For now, return empty array since we don't have hero_sections table
  // This can be implemented later if needed
  res.json([]);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Database status
app.get('/api/db-status', (req, res) => {
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='news_articles'", (err, row) => {
    if (err) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Database connection failed',
        error: err.message 
      });
    }
    
    if (row) {
      db.get("SELECT COUNT(*) as count FROM news_articles", (err, countRow) => {
        if (err) {
          return res.status(500).json({ 
            status: 'error', 
            message: 'Failed to count articles',
            error: err.message 
          });
        }
        
        res.json({ 
          status: '✅ READY',
          database: 'connected',
          tables: ['news_articles'],
          articleCount: countRow.count,
          timestamp: new Date().toISOString()
        });
      });
    } else {
      res.json({ 
        status: '⚠️ NO TABLES',
        database: 'connected',
        tables: [],
        message: 'Database connected but no news_articles table found'
      });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.path 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📰 News API: http://localhost:${PORT}/api/news`);
  console.log(`📥 Import API: http://localhost:${PORT}/api/news/import`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('📊 Database connection closed');
    }
    process.exit(0);
  });
});

module.exports = app;
