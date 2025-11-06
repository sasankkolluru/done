import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, School, AlertCircle, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/toast-provider';
import adminAPI from '@/services/adminAPI';
import { useSocket } from '@/contexts/SocketContext';

interface DashboardStats {
  totalFaculty: number;
  totalExams: number;
  totalSchedules: number;
  pendingRequests: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFaculty: 0,
    totalExams: 0,
    totalSchedules: 0,
    pendingRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    action: string;
    timestamp: string;
    user: string;
  }>>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const socket = useSocket();

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await adminAPI.getDashboardStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      
      // Fetch recent activity
      const activityResponse = await adminAPI.getRecentActivity();
      if (activityResponse.success) {
        setRecentActivity(activityResponse.data);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up socket listeners for real-time updates
    if (socket) {
      socket.on('dashboardUpdate', (data) => {
        if (data.type === 'stats') {
          setStats(prev => ({
            ...prev,
            ...data.data
          }));
        }
        
        if (data.type === 'activity') {
          setRecentActivity(prev => [data.data, ...prev].slice(0, 5));
        }
      });
      
      return () => {
        socket.off('dashboardUpdate');
      };
    }
  }, [fetchDashboardData, socket]);

  const handleRefresh = () => {
    fetchDashboardData();
    toast({
      title: 'Refreshing...',
      description: 'Updating dashboard data',
    });
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'bg-blue-100 text-blue-600',
    onClick 
  }: { 
    title: string; 
    value: number | string; 
    icon: React.ElementType; 
    color?: string;
    onClick?: () => void;
  }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <SEO title="Admin Dashboard" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here's what's happening with your institution.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Total Faculty" 
                value={stats.totalFaculty} 
                icon={Users} 
                color="bg-purple-100 text-purple-600"
                onClick={() => navigate('/admin/faculty')}
              />
              <StatCard 
                title="Upcoming Exams" 
                value={stats.totalExams} 
                icon={School} 
                color="bg-green-100 text-green-600"
                onClick={() => navigate('/admin/exams')}
              />
              <StatCard 
                title="Scheduled Sessions" 
                value={stats.totalSchedules} 
                icon={Calendar} 
                color="bg-yellow-100 text-yellow-600"
                onClick={() => navigate('/admin/schedules')}
              />
              <StatCard 
                title="Pending Requests" 
                value={stats.pendingRequests} 
                icon={AlertCircle} 
                color="bg-red-100 text-red-600"
                onClick={() => navigate('/admin/requests')}
              />
            </div>
            
            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest actions in the system</CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/admin/activity')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="p-2 bg-gray-100 rounded-full">
                            <Clock className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.user}</p>
                            <p className="text-sm text-gray-500">{activity.action}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => navigate('/admin/faculty/add')}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Add New Faculty
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => navigate('/admin/exams/schedule')}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Exam
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => navigate('/admin/reports')}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Generate Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
