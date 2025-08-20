import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  BarChart3, 
  Bell, 
  LogOut,
  TrendingUp,
  UserCheck,
  FileText,
  Calendar
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  activeCourses: number;
  recentAnnouncements: number;
}

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the encrypted hash from the current URL
  const getEncryptedHash = () => {
    const parts = location.pathname.split('/');
    return parts[2]; // The hash part of /secure-admin-panel/{hash}/...
  };
  
  const encryptedHash = getEncryptedHash();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRevenue: 0,
    activeCourses: 0,
    recentAnnouncements: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch total users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        // Fetch revenue data (from payments collection)
        const paymentsSnapshot = await getDocs(collection(db, 'payments'));
        let totalRevenue = 0;
        paymentsSnapshot.forEach(doc => {
          const payment = doc.data();
          if (payment.amount) {
            totalRevenue += payment.amount;
          }
        });

        // Fetch active courses
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const activeCourses = coursesSnapshot.size;

        // Fetch recent announcements
        const announcementsQuery = query(
          collection(db, 'announcements'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const announcementsSnapshot = await getDocs(announcementsQuery);
        const recentAnnouncements = announcementsSnapshot.size;

        setStats({
          totalUsers,
          totalRevenue,
          activeCourses,
          recentAnnouncements
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const adminMenuItems = [
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: <Users className="w-6 h-6" />,
      path: `/secure-admin-panel/${encryptedHash}/users`,
      color: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
      hoverColor: 'hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600'
    },
    {
      title: 'File Management',
      description: 'Upload and manage downloadable files',
      icon: <FileText className="w-6 h-6" />,
      path: `/secure-admin-panel/${encryptedHash}/files`,
      color: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500',
      hoverColor: 'hover:from-emerald-500 hover:via-teal-600 hover:to-cyan-600'
    },
    {
      title: 'Revenue Analytics',
      description: 'Track payments and revenue',
      icon: <DollarSign className="w-6 h-6" />,
      path: `/secure-admin-panel/${encryptedHash}/revenue`,
      color: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
      hoverColor: 'hover:from-yellow-500 hover:via-orange-600 hover:to-red-600'
    },
    {
      title: 'User Progress',
      description: 'Monitor user learning progress',
      icon: <BarChart3 className="w-6 h-6" />,
      path: `/secure-admin-panel/${encryptedHash}/progress`,
      color: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500',
      hoverColor: 'hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600'
    },
    {
      title: 'Announcements',
      description: 'Create and manage announcements',
      icon: <Bell className="w-6 h-6" />,
      path: `/secure-admin-panel/${encryptedHash}/announcements`,
      color: 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-500',
      hoverColor: 'hover:from-pink-600 hover:via-rose-600 hover:to-red-600'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-indigo-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Vibrant Modern Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl border-b border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Admin Dashboard</h1>
              <p className="text-indigo-100 font-medium">Manage your music learning platform</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-6 py-3 text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl border border-white/30"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards with Vibrant Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Active Courses</p>
                <p className="text-2xl font-bold text-slate-900">{stats.activeCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Recent Announcements</p>
                <p className="text-2xl font-bold text-slate-900">{stats.recentAnnouncements}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Admin Menu Grid with Vibrant Gradients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-3"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-2xl ${item.color} ${item.hoverColor} text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  {item.icon}
                </div>
                <h3 className="ml-4 text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">{item.title}</h3>
              </div>
              <p className="text-slate-600 group-hover:text-slate-700 transition-colors">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Enhanced Quick Actions with Vibrant Gradients */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate(`/secure-admin-panel/${encryptedHash}/announcements`)}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Bell className="w-5 h-5 mr-2" />
              Create Announcement
            </button>
            <button
              onClick={() => navigate(`/secure-admin-panel/${encryptedHash}/files`)}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Add New Course
            </button>
            <button
              onClick={() => navigate(`/secure-admin-panel/${encryptedHash}/users`)}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl hover:from-pink-600 hover:to-rose-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <UserCheck className="w-5 h-5 mr-2" />
              View Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
