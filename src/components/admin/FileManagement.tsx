import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  FileText, 
  Music, 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowLeft,
  Download,
  Lock,
  Unlock,
  Plus,
  File,
  Archive
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  description: string;
  fileType: 'pdf' | 'styles' | 'tones';
  fileSize: string;
  downloadUrl: string;
  requiredPlan: 'intermediate' | 'advanced' | 'styles-tones';
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

const FileManagement: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFileUpload, setSelectedFileUpload] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fileType: 'pdf' as 'pdf' | 'styles' | 'tones',
    requiredPlan: 'intermediate' as 'intermediate' | 'advanced' | 'styles-tones',
    isActive: true
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const filesQuery = query(collection(db, 'downloadableFiles'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(filesQuery);
      const filesData: FileItem[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        filesData.push({
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          fileType: data.fileType || 'pdf',
          fileSize: data.fileSize || '0 MB',
          downloadUrl: data.downloadUrl || '',
          requiredPlan: data.requiredPlan || 'intermediate',
          isActive: data.isActive !== false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      
      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileUpload(file);
      // Update form data with file name
      setFormData(prev => ({
        ...prev,
        name: file.name,
        description: `Uploaded ${file.name}`
      }));
    }
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    // For now, we'll simulate file upload by converting to base64
    // In a real implementation, you'd upload to Firebase Storage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileUpload) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      // Upload file and get URL
      const downloadUrl = await uploadFileToStorage(selectedFileUpload);
      
      const fileData = {
        ...formData,
        fileSize: `${(selectedFileUpload.size / (1024 * 1024)).toFixed(2)} MB`,
        downloadUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Uploading file data:', fileData);

      const docRef = await addDoc(collection(db, 'downloadableFiles'), fileData);
      console.log('File uploaded with ID:', docRef.id);
      
      setShowAddModal(false);
      setSelectedFileUpload(null);
      setFormData({
        name: '',
        description: '',
        fileType: 'pdf',
        requiredPlan: 'intermediate',
        isActive: true
      });
      
      fetchFiles();
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleEditFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      await updateDoc(doc(db, 'downloadableFiles', selectedFile.id), {
        ...formData,
        updatedAt: new Date()
      });
      
      setShowEditModal(false);
      setSelectedFile(null);
      setFormData({
        name: '',
        description: '',
        fileType: 'pdf',
        requiredPlan: 'intermediate',
        isActive: true
      });
      
      fetchFiles();
      alert('File updated successfully!');
    } catch (error) {
      console.error('Error updating file:', error);
      alert('Failed to update file');
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'downloadableFiles', fileId));
        fetchFiles();
        alert('File deleted successfully!');
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Failed to delete file');
      }
    }
  };

  const openEditModal = (file: FileItem) => {
    setSelectedFile(file);
    setFormData({
      name: file.name,
      description: file.description,
      fileType: file.fileType,
      requiredPlan: file.requiredPlan,
      isActive: file.isActive
    });
    setShowEditModal(true);
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'styles': return <Music className="w-5 h-5" />;
      case 'tones': return <Archive className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return 'bg-blue-100 text-blue-800';
      case 'styles': return 'bg-green-100 text-green-800';
      case 'tones': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequiredPlanColor = (plan: string) => {
    switch (plan) {
      case 'intermediate': return 'bg-amber-100 text-amber-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'styles-tones': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">File Management</h1>
                <p className="text-gray-600">Upload and manage downloadable files</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload File
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* File Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <div key={file.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getFileTypeColor(file.fileType)}`}>
                    {getFileTypeIcon(file.fileType)}
                    {file.fileType.toUpperCase()}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${file.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {file.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{file.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{file.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    {file.fileSize}
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRequiredPlanColor(file.requiredPlan)}`}>
                    {file.requiredPlan === 'styles-tones' ? 'Styles & Tones' : file.requiredPlan}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Uploaded: {formatDate(file.createdAt)}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(file)}
                      className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
                      title="Edit File"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
                      title="Delete File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {files.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No files found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading your first file.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload File
            </button>
          </div>
        )}
      </div>

      {/* Add File Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New File</h3>
              <form onSubmit={handleAddFile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">File</label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.zip,.rar"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">File Type</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({...formData, fileType: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pdf">PDF</option>
                    <option value="styles">Styles</option>
                    <option value="tones">Tones</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Required Plan</label>
                  <select
                    value={formData.requiredPlan}
                    onChange={(e) => setFormData({...formData, requiredPlan: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="intermediate">Intermediate Course</option>
                    <option value="advanced">Advanced Course</option>
                    <option value="styles-tones">Styles & Tones</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active File</label>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit File Modal */}
      {showEditModal && selectedFile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit File</h3>
              <form onSubmit={handleEditFile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">File Type</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({...formData, fileType: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pdf">PDF</option>
                    <option value="styles">Styles</option>
                    <option value="tones">Tones</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Required Plan</label>
                  <select
                    value={formData.requiredPlan}
                    onChange={(e) => setFormData({...formData, requiredPlan: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="intermediate">Intermediate Course</option>
                    <option value="advanced">Advanced Course</option>
                    <option value="styles-tones">Styles & Tones</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active File</label>
                </div>
                
                <div className="flex justify-end space-x-3">
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
                    Update File
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

export default FileManagement;
