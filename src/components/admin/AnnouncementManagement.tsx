import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowLeft,
  Calendar,
  Users,
  MessageSquare,
  Pin,
  Image,
  Upload
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isActive: boolean;
  isPinned: boolean;
  targetAudience: 'all' | 'basic' | 'intermediate' | 'advanced';
  imageUrl?: string;
  createdAt: any;
  updatedAt: any;
  createdBy: string;
}

const AnnouncementManagement: React.FC = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImagePosterModal, setShowImagePosterModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    isActive: true,
    isPinned: false,
    targetAudience: 'all' as 'all' | 'basic' | 'intermediate' | 'advanced',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const announcementsQuery = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(announcementsQuery);
      const announcementsData: Announcement[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        announcementsData.push({
          id: doc.id,
          title: data.title || '',
          content: data.content || '',
          type: data.type || 'info',
          isActive: data.isActive !== false,
          isPinned: data.isPinned || false,
          targetAudience: data.targetAudience || 'all',
          imageUrl: data.imageUrl || '',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          createdBy: data.createdBy || 'admin'
        });
      });
      
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const announcementData = {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'admin'
      };

      await addDoc(collection(db, 'announcements'), announcementData);
      
      setShowAddModal(false);
      setFormData({
        title: '',
        content: '',
        type: 'info',
        isActive: true,
        isPinned: false,
        targetAudience: 'all',
        imageUrl: ''
      });
      setImageFile(null);
      setImagePreview(null);
      
      fetchAnnouncements();
      alert('Announcement created successfully!');
    } catch (error) {
      console.error('Error adding announcement:', error);
      alert('Failed to create announcement');
    }
  };

  const handleEditAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnnouncement) return;

    try {
      await updateDoc(doc(db, 'announcements', selectedAnnouncement.id), {
        ...formData,
        updatedAt: new Date()
      });
      
      setShowEditModal(false);
      setSelectedAnnouncement(null);
      setFormData({
        title: '',
        content: '',
        type: 'info',
        isActive: true,
        isPinned: false,
        targetAudience: 'all',
        imageUrl: ''
      });
      setImageFile(null);
      setImagePreview(null);
      
      fetchAnnouncements();
      alert('Announcement updated successfully!');
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('Failed to update announcement');
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (window.confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'announcements', announcementId));
        fetchAnnouncements();
        alert('Announcement deleted successfully!');
      } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Failed to delete announcement');
      }
    }
  };

  const handleToggleActive = async (announcementId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'announcements', announcementId), {
        isActive: !currentStatus,
        updatedAt: new Date()
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement status:', error);
      alert('Failed to update announcement status');
    }
  };

  const handleTogglePinned = async (announcementId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'announcements', announcementId), {
        isPinned: !currentStatus,
        updatedAt: new Date()
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement pin status:', error);
      alert('Failed to update announcement pin status');
    }
  };

  const openEditModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      isActive: announcement.isActive,
      isPinned: announcement.isPinned,
      targetAudience: announcement.targetAudience,
      imageUrl: announcement.imageUrl || ''
    });
    setImageFile(null);
    setImagePreview(announcement.imageUrl || null);
    setShowEditModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToFirebase = async (file: File): Promise<string> => {
    // Convert file to base64 for storage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('Image converted to base64, length:', result.length);
        resolve(result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImagePosterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = formData.imageUrl;
      
      if (imageFile) {
        imageUrl = await uploadImageToFirebase(imageFile);
      }

      const announcementData = {
        ...formData,
        imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'admin'
      };

      await addDoc(collection(db, 'announcements'), announcementData);
      
      setShowImagePosterModal(false);
      setFormData({
        title: '',
        content: '',
        type: 'info',
        isActive: true,
        isPinned: false,
        targetAudience: 'all',
        imageUrl: ''
      });
      setImageFile(null);
      setImagePreview(null);
      
      fetchAnnouncements();
    } catch (error) {
      console.error('Error creating image poster:', error);
    } finally {
      setUploading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-3 sm:mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Announcement Management</h1>
                <p className="text-sm sm:text-base text-gray-600">Create and manage platform announcements</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Create Announcement</span>
                <span className="sm:hidden">Create</span>
              </button>
              <button
                onClick={() => setShowImagePosterModal(true)}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
              >
                <Image className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Create Image Poster</span>
                <span className="sm:hidden">Image Poster</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Announcements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(announcement.type)}`}>
                      {announcement.type}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAudienceColor(announcement.targetAudience)}`}>
                      {announcement.targetAudience}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {announcement.isPinned && (
                      <div title="Pinned">
                        <Pin className="w-4 h-4 text-yellow-500" />
                      </div>
                    )}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${announcement.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {announcement.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{announcement.title}</h3>
                {announcement.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={announcement.imageUrl} 
                      alt={announcement.title}
                      className="w-full h-24 sm:h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{announcement.content}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(announcement.createdAt)}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleToggleActive(announcement.id, announcement.isActive)}
                      className={`px-2 sm:px-3 py-1 text-xs rounded-lg transition-colors ${
                        announcement.isActive 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {announcement.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleTogglePinned(announcement.id, announcement.isPinned)}
                      className={`px-2 sm:px-3 py-1 text-xs rounded-lg transition-colors ${
                        announcement.isPinned 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      {announcement.isPinned ? 'Unpin' : 'Pin'}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(announcement)}
                      className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
                      title="Edit Announcement"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Bell className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements found</h3>
            <p className="mt-1 text-sm text-gray-500 px-4">
              Get started by creating your first announcement.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Create Announcement
            </button>
          </div>
        )}
      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Announcement</h3>
              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="basic">Basic Users</option>
                    <option value="intermediate">Intermediate Users</option>
                    <option value="advanced">Advanced Users</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active Announcement</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Pin to Top</label>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Create Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {showEditModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Announcement</h3>
              <form onSubmit={handleEditAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="basic">Basic Users</option>
                    <option value="intermediate">Intermediate Users</option>
                    <option value="advanced">Advanced Users</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active Announcement</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Pin to Top</label>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Update Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Poster Modal */}
      {showImagePosterModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Image Poster</h3>
              <form onSubmit={handleImagePosterSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Image Upload</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                        >
                          <span>Upload an image</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="basic">Basic Users</option>
                    <option value="intermediate">Intermediate Users</option>
                    <option value="advanced">Advanced Users</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active Poster</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Pin to Top</label>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImagePosterModal(false);
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {uploading ? 'Creating...' : 'Create Image Poster'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManagement;
