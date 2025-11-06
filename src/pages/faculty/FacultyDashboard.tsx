import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar as CalendarIcon, Download, FileText, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const FacultyDashboard = () => {
  const { profile } = useAuth();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [stats, setStats] = useState({
    upcomingDuties: 0,
    completedDuties: 0,
    totalHours: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      const { data: facultyData } = await supabase
        .from('faculty')
        .select('id')
        .eq('user_id', profile?.id)
        .maybeSingle();

      if (facultyData) {
        const [schedulesRes, requestsRes] = await Promise.all([
          supabase
            .from('duty_schedules')
            .select(`
              *,
              exams(exam_name, subject, exam_date, start_time, end_time),
              classrooms(room_number, building)
            `)
            .eq('faculty_id', facultyData.id)
            .order('duty_date', { ascending: true }),
          supabase
            .from('change_requests')
            .select('*', { count: 'exact', head: true })
            .eq('faculty_id', facultyData.id)
            .eq('status', 'pending'),
        ]);

        const schedules = schedulesRes.data || [];
        const today = new Date().toISOString().split('T')[0];

        setSchedules(schedules);
        setStats({
          upcomingDuties: schedules.filter((s: any) => s.duty_date >= today && s.status === 'scheduled').length,
          completedDuties: schedules.filter((s: any) => s.status === 'completed').length,
          totalHours: schedules.reduce((acc: number, s: any) => acc + (s.duty_hours || 0), 0),
          pendingRequests: requestsRes.count || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      scheduled: { variant: 'default', label: 'Scheduled' },
      completed: { variant: 'secondary', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
      pending_change: { variant: 'outline', label: 'Pending Change' },
    };

    const config = variants[status] || variants.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const statCards = [
    {
      title: 'Upcoming Duties',
      value: stats.upcomingDuties,
      icon: CalendarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Completed Duties',
      value: stats.completedDuties,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Total Hours',
      value: stats.totalHours,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SEO title="Faculty Dashboard - Exam Duty Scheduler" />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome, {profile?.full_name?.split(' ')[0] || 'Faculty'}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's your duty schedule overview
            </p>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download Schedule
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <div className={`${card.bgColor} p-2 rounded-lg`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Duties</CardTitle>
              <CardDescription>
                Your scheduled exam duties
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedules.filter((s) => s.status === 'scheduled').length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming duties scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules
                    .filter((s) => s.status === 'scheduled')
                    .slice(0, 5)
                    .map((schedule: any) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {schedule.exams?.exam_name}
                            </h3>
                            {getStatusBadge(schedule.status)}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {format(new Date(schedule.duty_date), 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {schedule.exams?.start_time} - {schedule.exams?.end_time}
                            </div>
                            {schedule.classrooms && (
                              <div>
                                Room: {schedule.classrooms.room_number}, {schedule.classrooms.building}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
