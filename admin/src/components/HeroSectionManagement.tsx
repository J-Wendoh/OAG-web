import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Upload, AlertCircle } from 'lucide-react';
import { api } from '../../../shared/utils/api';
import type { HeroSectionRow, HeroSectionFormData } from '../../../shared/types/database';

interface HeroSectionManagementProps {
  onClose?: () => void;
}

export default function HeroSectionManagement({ onClose }: HeroSectionManagementProps) {
  const [heroSections, setHeroSections] = useState<HeroSectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<HeroSectionRow | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<HeroSectionFormData>({
    title: '',
    subtitle: '',
    description: '',
    background_image_url: '',
    call_to_action_text: '',
    call_to_action_url: '',
    is_active: false
  });

  // Load hero sections
  const loadHeroSections = async () => {
    try {
      setLoading(true);
      const data = await api.heroSections.getAllHeroSections();
      setHeroSections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load hero sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeroSections();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingSection) {
        await api.heroSections.updateHeroSection(editingSection.id, formData);
      } else {
        await api.heroSections.createHeroSection(formData);
      }
      
      await loadHeroSections();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save hero section');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      background_image_url: '',
      call_to_action_text: '',
      call_to_action_url: '',
      is_active: false
    });
    setEditingSection(null);
  };

  // Edit hero section
  const handleEdit = (section: HeroSectionRow) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      subtitle: section.subtitle || '',
      description: section.description || '',
      background_image_url: section.background_image_url || '',
      call_to_action_text: section.call_to_action_text || '',
      call_to_action_url: section.call_to_action_url || '',
      is_active: section.is_active
    });
    setShowForm(true);
  };

  // Delete hero section
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero section?')) return;
    
    try {
      setLoading(true);
      await api.heroSections.deleteHeroSection(id);
      await loadHeroSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete hero section');
    } finally {
      setLoading(false);
    }
  };

  // Activate/deactivate hero section
  const handleToggleActive = async (id: string) => {
    try {
      setLoading(true);
      await api.heroSections.activateHeroSection(id);
      await loadHeroSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update hero section');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload (placeholder - you'll need to implement actual upload)
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      // TODO: Implement actual image upload to Supabase storage
      // For now, we'll use a placeholder URL
      const imageUrl = `https://via.placeholder.com/1200x600?text=${encodeURIComponent(file.name)}`;
      setFormData(prev => ({ ...prev, background_image_url: imageUrl }));
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (loading && heroSections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Section Management</h2>
          <p className="text-gray-600">Manage the hero sections displayed on the website homepage</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Section</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Sections List */}
      <div className="grid gap-6">
        {heroSections.map((section) => (
          <div
            key={section.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
              section.is_active ? 'border-green-500' : 'border-gray-200'
            }`}
          >
            <div className="relative">
              {section.background_image_url && (
                <img
                  src={section.background_image_url}
                  alt={section.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                {section.is_active && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Active
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h3>
                  {section.subtitle && (
                    <p className="text-gray-600 mb-2">{section.subtitle}</p>
                  )}
                  {section.description && (
                    <p className="text-gray-500 text-sm mb-4">{section.description}</p>
                  )}
                  {section.call_to_action_text && section.call_to_action_url && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <span>CTA: {section.call_to_action_text}</span>
                      <span>→</span>
                      <span className="font-mono text-xs">{section.call_to_action_url}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleToggleActive(section.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      section.is_active
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    title={section.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {section.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(section)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No hero sections message */}
      {heroSections.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Hero Sections</h3>
          <p className="text-gray-600 mb-4">Create your first hero section to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Hero Section
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingSection ? 'Edit Hero Section' : 'Create Hero Section'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter hero section title"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subtitle (optional)"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter description (optional)"
                  />
                </div>

                {/* Background Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={formData.background_image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, background_image_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter image URL or upload below"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </label>
                      {uploading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA Text
                    </label>
                    <input
                      type="text"
                      value={formData.call_to_action_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, call_to_action_text: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Learn More"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA Link
                    </label>
                    <input
                      type="url"
                      value={formData.call_to_action_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, call_to_action_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Set as active hero section
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Hero Section'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 