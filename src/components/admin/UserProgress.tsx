import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  ArrowLeft,
  LogOut,
  Search,
  Filter
} from 'lucide-react';

interface UserProgressData {
  uid: string;
  email: string;
  displayName?: string;
  lastActivity?: string;
  basicProgress?: {
    enrolled: boolean;
    courseProgress: {
      introduction: boolean;
      basics: boolean;
      majorScales: boolean;
      minorScales: boolean;
      inversions: boolean;
      practicing: boolean;
      majorFamilyChords: boolean;
      minorFamilyChords: boolean;
    };
    sectionProgress: {
      [key: string]: boolean;
    };
    completedItems: {
      scales: string[];
      families: string[];
    };
  };
  intermediateProgress?: {
    enrolled: boolean;
    // Add intermediate progress structure when available
  };
  advancedProgress?: {
    enrolled: boolean;
    // Add advanced progress structure when available
  };
}

const UserProgress: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [sortBy, setSortBy] = useState('lastActivity');
  const [selectedUser, setSelectedUser] = useState<UserProgressData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      
      // Get all users from Firebase
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userProgressData: UserProgressData[] = [];

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        const uid = doc.id;
        
        // Get progress data from localStorage (this would normally be in Firebase)
        // For demo purposes, we'll simulate some progress data
        const basicProgress = getLocalStorageProgress(uid);
        
        userProgressData.push({
          uid,
          email: userData.email || 'Unknown',
          displayName: userData.displayName || userData.email?.split('@')[0] || 'User',
          basicProgress,
          lastActivity: userData.lastLoginAt || new Date().toISOString()
        });
      });

      setUsers(userProgressData);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalStorageProgress = (uid: string) => {
    try {
      const enrolled = localStorage.getItem(`enrolled_${uid}_basic`) === 'true';
      const progressData = localStorage.getItem(`progress_${uid}_basic`);
      const sectionProgressData = localStorage.getItem(`sectionProgress_${uid}_basic`);
      const completedItemsData = localStorage.getItem(`completedItems_${uid}_basic`);

      if (!enrolled && !progressData) {
        return undefined;
      }

      return {
        enrolled,
        courseProgress: progressData ? JSON.parse(progressData) : {
          introduction: false,
          basics: false,
          majorScales: false,
          minorScales: false,
          inversions: false,
          practicing: false,
          majorFamilyChords: false,
          minorFamilyChords: false
        },
        sectionProgress: sectionProgressData ? JSON.parse(sectionProgressData) : {},
        completedItems: completedItemsData ? JSON.parse(completedItemsData) : {
          scales: [],
          families: []
        }
      };
    } catch (error) {
      console.error('Error parsing localStorage progress:', error);
      return undefined;
    }
  };

  const calculateProgressPercentage = (progress: any) => {
    if (!progress) return 0;
    
    const courseSections = Object.values(progress.courseProgress);
    const completedSections = courseSections.filter(Boolean).length;
    return Math.round((completedSections / courseSections.length) * 100);
  };

  const getProgressStatus = (percentage: number) => {
    if (percentage === 0) return { text: 'Not Started', color: 'text-gray-500', bg: 'bg-gray-100' };
    if (percentage < 25) return { text: 'Beginner', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage < 50) return { text: 'In Progress', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (percentage < 75) return { text: 'Advanced', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (percentage < 100) return { text: 'Near Completion', color: 'text-purple-600', bg: 'bg-purple-100' };
    return { text: 'Completed', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewDetails = (user: UserProgressData) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedUser(null);
    setShowDetailsModal(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterCourse === 'all' || 
                         (filterCourse === 'basic' && user.basicProgress?.enrolled) ||
                         (filterCourse === 'intermediate' && user.intermediateProgress?.enrolled) ||
                         (filterCourse === 'advanced' && user.advancedProgress?.enrolled);
    
    return matchesSearch && matchesFilter;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'lastActivity':
        return new Date(b.lastActivity || 0).getTime() - new Date(a.lastActivity || 0).getTime();
      case 'progress':
        const aProgress = calculateProgressPercentage(a.basicProgress);
        const bProgress = calculateProgressPercentage(b.basicProgress);
        return bProgress - aProgress;
      case 'name':
        return (a.displayName || '').localeCompare(b.displayName || '');
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user progress...</p>
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
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Progress</h1>
                <p className="text-gray-600">Monitor user learning progress and engagement</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Learners</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.basicProgress?.enrolled).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    users
                      .filter(u => u.basicProgress?.enrolled)
                      .reduce((acc, user) => acc + calculateProgressPercentage(user.basicProgress), 0) /
                    Math.max(users.filter(u => u.basicProgress?.enrolled).length, 1)
                  )}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => calculateProgressPercentage(u.basicProgress) === 100).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Courses</option>
                <option value="basic">Basic Course</option>
                <option value="intermediate">Intermediate Course</option>
                <option value="advanced">Advanced Course</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lastActivity">Last Activity</option>
                <option value="progress">Progress</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Progress Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">User Progress Details</h3>
          </div>
          
          {sortedUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedUsers.map((user) => {
                    const progressPercentage = calculateProgressPercentage(user.basicProgress);
                    const status = getProgressStatus(progressPercentage);
                    
                    return (
                      <tr key={user.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.displayName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.basicProgress?.enrolled ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Enrolled
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <XCircle className="w-4 h-4 mr-1" />
                              Not Enrolled
                            </span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 mr-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {progressPercentage}%
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                                  {status.text}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                              <span>Scales: {user.basicProgress?.completedItems?.scales?.length || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                              <span>Families: {user.basicProgress?.completedItems?.families?.length || 0}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastActivity ? (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {new Date(user.lastActivity).toLocaleDateString()}
                            </div>
                          ) : (
                            <span>Never</span>
                          )}
                        </td>
                        
                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                           <button
                             onClick={() => handleViewDetails(user)}
                             className="text-blue-600 hover:text-blue-900 flex items-center"
                           >
                             <Eye className="w-4 h-4 mr-1" />
                             View Details
                           </button>
                         </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
                     )}
         </div>
       </div>

       {/* User Details Modal */}
       {showDetailsModal && selectedUser && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
               <h2 className="text-xl font-semibold text-gray-900">
                 Detailed Progress - {selectedUser.displayName}
               </h2>
               <button
                 onClick={closeDetailsModal}
                 className="text-gray-400 hover:text-gray-600 transition-colors"
               >
                 <XCircle className="w-6 h-6" />
               </button>
             </div>
             
             <div className="p-6">
               {/* User Information */}
               <div className="mb-6">
                 <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <p className="text-sm font-medium text-gray-500">Email</p>
                     <p className="text-sm text-gray-900">{selectedUser.email}</p>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-500">Display Name</p>
                     <p className="text-sm text-gray-900">{selectedUser.displayName || 'Not set'}</p>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-500">Last Activity</p>
                     <p className="text-sm text-gray-900">
                       {selectedUser.lastActivity ? new Date(selectedUser.lastActivity).toLocaleString() : 'Never'}
                     </p>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-500">User ID</p>
                     <p className="text-sm text-gray-900 font-mono">{selectedUser.uid}</p>
                   </div>
                 </div>
               </div>

               {/* Course Progress */}
               {selectedUser.basicProgress && (
                 <div className="mb-6">
                   <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Course Progress</h3>
                   
                   {/* Enrollment Status */}
                   <div className="mb-4">
                     <p className="text-sm font-medium text-gray-500 mb-2">Enrollment Status</p>
                     {selectedUser.basicProgress.enrolled ? (
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                         <CheckCircle className="w-4 h-4 mr-2" />
                         Enrolled
                       </span>
                     ) : (
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                         <XCircle className="w-4 h-4 mr-2" />
                         Not Enrolled
                       </span>
                     )}
                   </div>

                   {/* Overall Progress */}
                   <div className="mb-4">
                     <p className="text-sm font-medium text-gray-500 mb-2">Overall Progress</p>
                     <div className="flex items-center">
                       <div className="flex-1 mr-4">
                         <div className="flex items-center justify-between mb-1">
                           <span className="text-sm font-medium text-gray-900">
                             {calculateProgressPercentage(selectedUser.basicProgress)}%
                           </span>
                           <span className={`text-xs px-2 py-1 rounded-full ${getProgressStatus(calculateProgressPercentage(selectedUser.basicProgress)).bg} ${getProgressStatus(calculateProgressPercentage(selectedUser.basicProgress)).color}`}>
                             {getProgressStatus(calculateProgressPercentage(selectedUser.basicProgress)).text}
                           </span>
                         </div>
                         <div className="w-full bg-gray-200 rounded-full h-3">
                           <div
                             className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                             style={{ width: `${calculateProgressPercentage(selectedUser.basicProgress)}%` }}
                           ></div>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Course Sections */}
                   <div className="mb-4">
                     <p className="text-sm font-medium text-gray-500 mb-2">Course Sections</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {Object.entries(selectedUser.basicProgress.courseProgress).map(([section, completed]) => (
                         <div key={section} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                           <span className="text-sm font-medium text-gray-700 capitalize">
                             {section.replace(/([A-Z])/g, ' $1').trim()}
                           </span>
                           {completed ? (
                             <CheckCircle className="w-5 h-5 text-green-500" />
                           ) : (
                             <XCircle className="w-5 h-5 text-gray-400" />
                           )}
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Completed Items */}
                   <div className="mb-4">
                     <p className="text-sm font-medium text-gray-500 mb-2">Completed Items</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                           <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                           Scales ({selectedUser.basicProgress.completedItems.scales.length})
                         </p>
                         {selectedUser.basicProgress.completedItems.scales.length > 0 ? (
                           <div className="space-y-1">
                             {selectedUser.basicProgress.completedItems.scales.map((scale, index) => (
                               <div key={index} className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                                 {scale}
                               </div>
                             ))}
                           </div>
                         ) : (
                           <p className="text-xs text-gray-500">No scales completed</p>
                         )}
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                           <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                           Families ({selectedUser.basicProgress.completedItems.families.length})
                         </p>
                         {selectedUser.basicProgress.completedItems.families.length > 0 ? (
                           <div className="space-y-1">
                             {selectedUser.basicProgress.completedItems.families.map((family, index) => (
                               <div key={index} className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded">
                                 {family}
                               </div>
                             ))}
                           </div>
                         ) : (
                           <p className="text-xs text-gray-500">No families completed</p>
                         )}
                       </div>
                     </div>
                   </div>

                   {/* Section Progress */}
                   {Object.keys(selectedUser.basicProgress.sectionProgress).length > 0 && (
                     <div className="mb-4">
                       <p className="text-sm font-medium text-gray-500 mb-2">Section Progress</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {Object.entries(selectedUser.basicProgress.sectionProgress).map(([section, completed]) => (
                           <div key={section} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                             <span className="text-sm font-medium text-gray-700 capitalize">
                               {section.replace(/([A-Z])/g, ' $1').trim()}
                             </span>
                             {completed ? (
                               <CheckCircle className="w-5 h-5 text-green-500" />
                             ) : (
                               <XCircle className="w-5 h-5 text-gray-400" />
                             )}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               )}

               {/* No Progress Data */}
               {!selectedUser.basicProgress && (
                 <div className="text-center py-8">
                   <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                   <p className="text-gray-500">No progress data available for this user</p>
                   <p className="text-sm text-gray-400 mt-2">The user hasn't enrolled in any courses yet</p>
                 </div>
               )}
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default UserProgress;
