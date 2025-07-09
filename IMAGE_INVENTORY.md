# 📸 OAG Web System - Image Inventory & Usage Guide

## 🔍 **IMAGE AUDIT RESULTS**

### **Hero/Banner Images (High Resolution)**
| Filename | Dimensions | Size | Current Usage | Suggested Usage |
|----------|------------|------|---------------|-----------------|
| `Untitled-design-1.jpg` | 1920x1080 | Large | Hero slideshow | Primary hero banner |
| `Departments.jpg` | 1920x1080 | Large | Not used | Departments page banner |
| `Contactus.jpg` | 1920x1080 | Large | Not used | Contact page banner |
| `Ourservices.jpg` | 1920x1080 | Large | Not used | Services page banner |

### **Attorney General Images**
| Filename | Dimensions | Size | Current Usage | Suggested Usage |
|----------|------------|------|---------------|-----------------|
| `AG.jpg` | 2560x2365 | Very Large | Hero slideshow | About page - AG portrait |
| `AG2.jpeg` | Unknown | Medium | Not used | About page - AG in office |
| `AG3.jpg` | Unknown | Medium | Not used | About page - AG meetings |
| `AG5.jpg` | Unknown | Medium | Not used | About page - AG events |
| `AG7.jpeg` | Unknown | Medium | Not used | About page - AG ceremonies |
| `AGspeaking.png` | Text file | N/A | Not used | Corrupted - needs replacement |

### **Historical/Event Images**
| Filename | Dimensions | Size | Current Usage | Suggested Usage |
|----------|------------|------|---------------|-----------------|
| `AALC 2017.jpg` | Unknown | Medium | Not used | History page - 2017 events |
| `CWLM 2014.jpg` | Unknown | Medium | Not used | History page - 2014 events |
| `JLAC 2019.jpg` | Unknown | Medium | Not used | History page - 2019 events |
| `UN HUMAN RIGHTS STAKEHOLDERS.jpg` | Unknown | Medium | Not used | About page - International relations |

### **Numbered Series Images**
| Filename | Dimensions | Size | Current Usage | Suggested Usage |
|----------|------------|------|---------------|-----------------|
| `1.png` | 1920x1280 | Large | Not used | Services page - Legal services |
| `2.png` | 1920x1279 | Large | Hero slideshow | Services page - Constitutional law |
| `4.png` | Unknown | Medium | Not used | Services page - Public prosecution |
| `5.png` | Unknown | Medium | Not used | Services page - Legal advice |
| `6.png` | 1920x2320 | Very Large | Not used | About page - Office building |

### **Numbered Series with Parentheses**
| Filename | Dimensions | Size | Current Usage | Suggested Usage |
|----------|------------|------|---------------|-----------------|
| `1 (1).png` | Unknown | Medium | Not used | Gallery - Office interior |
| `1 (2).png` | Unknown | Medium | Not used | Gallery - Meeting rooms |
| `1 (3).png` | Unknown | Medium | Not used | Gallery - Reception area |
| `2 (1).png` | Unknown | Medium | Not used | Gallery - Staff working |
| `2 (2).png` | Unknown | Medium | Not used | Gallery - Legal library |
| `2 (3).png` | Unknown | Medium | Not used | Gallery - Conference room |
| `2 (4).png` | Unknown | Medium | Not used | Gallery - Court proceedings |
| `2 (5).png` | Unknown | Medium | Not used | Gallery - Public service |

### **Symbolic/Decorative Images**
| Filename | Dimensions | Size | Current Usage | Suggested Usage |
|----------|------------|------|---------------|-----------------|
| `courtofarms.jpeg` | Unknown | Small | Logo/favicon | Header logo, footer |
| `flagkenya.jpeg` | 275x183 | Small | Not used | About page - National identity |
| `cons.jpeg` | 300x168 | Small | Not used | About page - Constitution |
| `cons.jpg` | 850x500 | Medium | Not used | About page - Constitutional law |

### **Utility Images**
| Filename | Dimensions | Size | Current Usage | Suggested Usage |
|----------|------------|------|---------------|-----------------|
| `one.png` | Unknown | Medium | Hero slideshow | Services page icon |
| `Updates.png` | Unknown | Medium | Not used | News page - Updates section |
| `newsmarch20.png` | Unknown | Medium | Not used | News page - March 2020 updates |
| `image.png` | Unknown | Medium | Not used | Generic placeholder |
| `image-copy.png` | Unknown | Medium | Not used | Generic placeholder |
| `image copy copy.png` | Unknown | Medium | Not used | Generic placeholder |

### **Special Files**
| Filename | Type | Current Usage | Suggested Usage |
|----------|------|---------------|-----------------|
| `ag-message.mp4` | Video | Not used | About page - AG welcome message |
| `WhatsApp Image 2025-07-03 at 4.38.52 AM.jpeg` | Image | Not used | Recent photo - needs proper naming |

## 🎯 **STRATEGIC IMPLEMENTATION PLAN**

### **Priority 1: About Us Page Enhancement**
- **AG Portrait**: Use `AG.jpg` (optimized to 800x800)
- **Office Environment**: Use `6.png` for building exterior
- **Historical Context**: Use `AALC 2017.jpg`, `CWLM 2014.jpg`, `JLAC 2019.jpg`
- **Constitutional Focus**: Use `cons.jpg` for constitutional law section
- **International Relations**: Use `UN HUMAN RIGHTS STAKEHOLDERS.jpg`
- **Video Message**: Implement `ag-message.mp4` as welcome video

### **Priority 2: Services Page Enhancement**
- **Service Categories**: Use numbered series `1.png`, `2.png`, `4.png`, `5.png`
- **Banner**: Use `Ourservices.jpg` as page header
- **Legal Services**: Use appropriate AG images for credibility

### **Priority 3: Contact Page Enhancement**
- **Banner**: Use `Contactus.jpg` as page header
- **Office Images**: Use parentheses series for office interior gallery
- **National Identity**: Use `flagkenya.jpeg` and `courtofarms.jpeg`

### **Priority 4: Departments Page Enhancement**
- **Banner**: Use `Departments.jpg` as page header
- **Department Visuals**: Use remaining numbered images

### **Priority 5: News/Updates Enhancement**
- **News Banner**: Use `Updates.png` and `newsmarch20.png`
- **Historical Events**: Use dated images for timeline

## 🔧 **OPTIMIZATION REQUIREMENTS**

### **Performance Optimization**
- Resize large images (>1920px) to appropriate sizes
- Convert to WebP format where supported
- Implement lazy loading for all new images
- Add proper alt text for accessibility

### **File Naming Convention**
- Rename files with spaces and special characters
- Use descriptive, SEO-friendly names
- Follow kebab-case convention

### **Responsive Implementation**
- Create multiple sizes for different breakpoints
- Use srcset for responsive images
- Optimize for mobile-first approach

## ⚠️ **ISSUES TO ADDRESS**

### **Corrupted Files**
- `AGspeaking.png` - Text file instead of image, needs replacement

### **Poor Naming**
- `WhatsApp Image 2025-07-03 at 4.38.52 AM.jpeg` - Needs proper renaming
- Files with spaces and parentheses need renaming

### **Oversized Images**
- Several images are unnecessarily large (>2MB)
- Need optimization for web delivery

### **Missing Alt Text**
- All images need descriptive alt text for accessibility
- Must comply with WCAG AA standards

## 📋 **IMPLEMENTATION CHECKLIST**

- [ ] Rename problematic filenames
- [ ] Optimize oversized images
- [ ] Create responsive image variants
- [ ] Implement lazy loading
- [ ] Add comprehensive alt text
- [ ] Test performance impact
- [ ] Verify accessibility compliance
- [ ] Update image preloading strategy
