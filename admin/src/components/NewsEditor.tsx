import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { Save, X, Upload, Eye, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface NewsEditorProps {
  article?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function NewsEditor({ article, onClose, onSave }: NewsEditorProps) {
  const { addNewsArticle, updateNewsArticle, logActivity } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    publishDate: new Date().toISOString().split('T')[0],
    status: 'draft' as 'published' | 'draft' | 'archived',
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        image: article.image,
        publishDate: new Date(article.publishDate).toISOString().split('T')[0],
        status: article.status,
      });
    }
  }, [article]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const articleData = {
      ...formData,
      publishDate: new Date(formData.publishDate),
      author: 'OAG Head of Communications',
      order: article?.order || 0,
    };

    if (article) {
      updateNewsArticle(article.id, articleData);
      logActivity({
        userId: user?.id || '',
        userName: user?.name || '',
        action: 'News Article Updated',
        details: `Updated article: ${formData.title}`,
        type: 'news',
      });
      toast.success('Article updated successfully');
    } else {
      addNewsArticle(articleData);
      logActivity({
        userId: user?.id || '',
        userName: user?.name || '',
        action: 'News Article Created',
        details: `Created new article: ${formData.title}`,
        type: 'news',
      });
      toast.success('Article created successfully');
    }

    onSave();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <div className="glass-card rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {article ? 'Edit Article' : 'Create New Article'}
              </h1>
              <p className="text-blue-100 mt-2">
                {article ? 'Update your news article' : 'Share important updates with the public'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-white hover:bg-white/20 rounded-xl transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Article Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg font-medium"
              placeholder="Enter a compelling article title"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Featured Image
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 group"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors duration-300" />
                    <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">
                      Upload Image
                    </p>
                  </div>
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Or paste image URL"
                />
              </div>
              {formData.image && (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Article Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Brief description that will appear in article previews"
            />
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Publish Date
              </label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Article Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={16}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-mono text-sm"
              placeholder="Write your article content here. You can use HTML tags for formatting."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col lg:flex-row items-center justify-between pt-6 border-t border-gray-200 space-y-4 lg:space-y-0">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost w-full lg:w-auto"
            >
              Cancel
            </button>
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <button
                type="button"
                className="btn-secondary flex items-center space-x-2 flex-1 lg:flex-none"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2 flex-1 lg:flex-none"
              >
                <Save className="w-4 h-4" />
                <span>{article ? 'Update Article' : 'Create Article'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}