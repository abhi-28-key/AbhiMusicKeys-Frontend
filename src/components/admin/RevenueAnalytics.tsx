import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  ArrowLeft,
  BarChart3,
  PieChart,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  amount: number;
  currency: string;
  plan: string;
  planName?: string;
  status: string;
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: any;
  updatedAt?: any;
  planDuration?: string;
  failureReason?: string | null;
}

interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  averageOrderValue: number;
  revenueByPlan: {
    basic: number;
    intermediate: number;
    advanced: number;
    'styles-tones': number;
  };
  successRate: number;
  recentPayments: Payment[];
}

const RevenueAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    averageOrderValue: 0,
    revenueByPlan: {
      basic: 0,
      intermediate: 0,
      advanced: 0,
      'styles-tones': 0
    },
    successRate: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Backend API URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchRevenueData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchRevenueData();
    }, 30000);

    return () => clearInterval(interval);
  }, [timeFilter, planFilter]);

  const fetchRevenueData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch payment statistics
      const statsResponse = await fetch(`${API_BASE_URL}/api/payment-stats?timeFilter=${timeFilter}`);
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch payment statistics');
      }
      const statsData = await statsResponse.json();
      
      // Fetch recent payments
      const paymentsResponse = await fetch(`${API_BASE_URL}/api/payments?timeFilter=${timeFilter}&planFilter=${planFilter}&limit=10`);
      if (!paymentsResponse.ok) {
        throw new Error('Failed to fetch payments');
      }
      const paymentsData = await paymentsResponse.json();
      
      // Combine the data
      const combinedStats: RevenueStats = {
        totalRevenue: statsData.stats.totalRevenue || 0,
        monthlyRevenue: statsData.stats.monthlyRevenue || 0,
        totalPayments: statsData.stats.totalPayments || 0,
        successfulPayments: statsData.stats.successfulPayments || 0,
        failedPayments: statsData.stats.failedPayments || 0,
        averageOrderValue: statsData.stats.averageOrderValue || 0,
                 revenueByPlan: statsData.stats.revenueByPlan || {
           basic: 0,
           intermediate: 0,
           advanced: 0,
           'styles-tones': 0
         },
        successRate: statsData.stats.successRate || 0,
        recentPayments: paymentsData.payments || []
      };
      
      setStats(combinedStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'styles-tones': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFailureReason = (payment: Payment) => {
    if (payment.status === 'failed' && payment.failureReason) {
      return payment.failureReason;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading revenue data...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
                <p className="text-gray-600">Live payment tracking and revenue insights</p>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchRevenueData}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Plans</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="styles-tones">Styles & Tones</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchRevenueData}
                disabled={refreshing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {refreshing ? 'Updating...' : 'Update Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successfulPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Basic</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(stats.revenueByPlan.basic)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Intermediate</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(stats.revenueByPlan.intermediate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Advanced</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(stats.revenueByPlan.advanced)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Styles & Tones</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(stats.revenueByPlan['styles-tones'] || 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Payments</span>
                <span className="text-sm font-bold text-gray-900">{stats.totalPayments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Successful</span>
                <span className="text-sm font-bold text-green-600">{stats.successfulPayments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Failed</span>
                <span className="text-sm font-bold text-red-600">{stats.failedPayments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Success Rate</span>
                <span className="text-sm font-bold text-gray-900">{stats.successRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.userEmail}</div>
                      {payment.userName && (
                        <div className="text-sm text-gray-500">{payment.userName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(payment.plan)}`}>
                        {payment.planName || payment.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{formatCurrency(payment.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getFailureReason(payment) && (
                        <div className="text-red-600 text-xs">
                          Reason: {getFailureReason(payment)}
                        </div>
                      )}
                      {payment.razorpayPaymentId && (
                        <div className="text-xs text-gray-400">
                          ID: {payment.razorpayPaymentId}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {stats.recentPayments.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalytics;
