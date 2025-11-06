import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { facultyAPI } from '@/services/api';
import { 
  Calendar as CalendarIcon, 
  Download, 
  FileText, 
  AlertCircle, 
  Clock,
  Bell,
  CheckCircle,
  FileWarning,
  UserCheck,
  Clock3,
  CalendarCheck2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isAfter, isBefore, isToday } from 'date-fns';

type ExamDuty = {
  id: string;
  examName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  room: string;
  role: 'invigilator' | 'supervisor' | 'coordinator';
};

type Announcement = {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
};

const FacultyDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingDuties, setUpcomingDuties] = useState<ExamDuty[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState({
    totalDuties: 0,
    completedDuties: 0,
    pendingTasks: 0,
    announcements: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch faculty duties
        const dutiesResponse = await facultyAPI.getMyDuties();
        if (dutiesResponse.success) {
          const duties = dutiesResponse.data.map((duty: any) => ({
            ...duty,
            status: getDutyStatus(duty.date, duty.startTime, duty.endTime)
          }));
          
          setUpcomingDuties(duties);
          
          // Calculate stats
          const completed = duties.filter((d: ExamDuty) => d.status === 'completed').length;
          const upcoming = duties.filter((d: ExamDuty) => d.status === 'upcoming').length;
          
          setStats(prev => ({
            ...prev,
            totalDuties: duties.length,
            completedDuties: completed,
            pendingTasks: upcoming
          }));
        }
        
        // Fetch announcements
        const announcementsResponse = await facultyAPI.getAnnouncements();
        if (announcementsResponse.success) {
          const announcements = announcementsResponse.data
            .sort((a: Announcement, b: Announcement) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 3); // Get only the 3 most recent
            
          setRecentAnnouncements(announcements);
          setStats(prev => ({
            ...prev,
            announcements: announcementsResponse.data.length
          }));
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user]);
  
  const getDutyStatus = (date: string, startTime: string, endTime: string) => {
    const now = new Date();
    const dutyDate = new Date(`${date}T${startTime}`);
    const dutyEnd = new Date(`${date}T${endTime}`);
    
    if (now > dutyEnd) return 'completed';
    if (now >= dutyDate && now <= dutyEnd) return 'ongoing';
    return 'upcoming';
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <Clock3 className="h-3 w-3" /> Ongoing
        </Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" /> Completed
        </Badge>;
      default:
        return <Badge variant="secondary" className="flex items-center gap-1">
          <CalendarCheck2 className="h-3 w-3" /> Upcoming
        </Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Low</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SEO title="Faculty Dashboard - Exam Duty Scheduler" />

      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || 'Faculty'}</h1>
          <p className="text-gray-600">
            Here's what's happening with your exam duties and schedule.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Duties</p>
                  <h3 className="text-2xl font-bold">{stats.totalDuties}</h3>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <h3 className="text-2xl font-bold">{stats.completedDuties}</h3>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                  <h3 className="text-2xl font-bold">{stats.pendingTasks}</h3>
                </div>
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FileWarning className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Announcements</p>
                  <h3 className="text-2xl font-bold">{stats.announcements}</h3>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Bell className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Duties */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Exam Duties</CardTitle>
                  <CardDescription>Your scheduled invigilation duties</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/faculty/duties')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingDuties.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDuties.slice(0, 3).map((duty) => (
                    <motion.div 
                      key={duty.id}
                      whileHover={{ x: 5 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/faculty/duties/${duty.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{duty.examName}</h4>
                          <p className="text-sm text-gray-500">
                            {format(new Date(duty.date), 'MMM d, yyyy')} • {duty.startTime} - {duty.endTime}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Room: {duty.room} • {duty.role.charAt(0).toUpperCase() + duty.role.slice(1)}
                          </p>
                        </div>
                        {getStatusBadge(duty.status)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No upcoming duties scheduled</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate('/faculty/availability')}
                  >
                    Update Availability
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>Important updates and notices</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/faculty/announcements')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentAnnouncements.length > 0 ? (
                <div className="space-y-4">
                  {recentAnnouncements.map((announcement) => (
                    <div 
                      key={announcement.id} 
                      className={`p-4 rounded-lg border ${!announcement.isRead ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{announcement.title}</h4>
                        {getPriorityBadge(announcement.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {announcement.message}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">
                          {format(new Date(announcement.date), 'MMM d, yyyy')}
                        </span>
                        {!announcement.isRead && (
                          <span className="text-xs text-blue-600 font-medium">New</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No recent announcements</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/faculty/availability')}
              >
                <CalendarIcon className="h-6 w-6" />
                <span>Update Availability</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/faculty/duties')}
              >
                <FileText className="h-6 w-6" />
                <span>View Duties</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/faculty/leave')}
              >
                <AlertCircle className="h-6 w-6" />
                <span>Request Leave</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/faculty/reports')}
              >
                <Download className="h-6 w-6" />
                <span>Download Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
