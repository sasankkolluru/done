import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, FileText, Bell, Upload } from 'lucide-react';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Upcoming Exams" 
            value="12" 
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />} 
            description="Next exam in 3 days"
          />
          <StatCard 
            title="Faculty On Duty" 
            value="24" 
            icon={<Users className="h-4 w-4 text-muted-foreground" />} 
            description="12 departments"
          />
          <StatCard 
            title="Pending Approvals" 
            value="5" 
            icon={<FileText className="h-4 w-4 text-muted-foreground" />} 
            description="3 swap requests, 2 leaves"
          />
          <StatCard 
            title="Notifications" 
            value="3 New" 
            icon={<Bell className="h-4 w-4 text-muted-foreground" />} 
            description="2 unread messages"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Exam
              </Button>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Bulk Upload
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Generate Reports
              </Button>
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Manage Faculty
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Calendar Preview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New invigilation schedule created</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="rounded-lg border p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Midterm Exam {item}</h3>
                      <span className="text-sm text-muted-foreground">Nov {10 + item}, 2025</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item === 1 ? '9:00 AM - 12:00 PM' : '2:00 PM - 5:00 PM'}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">5 Faculty Assigned</span>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
};

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-md bg-primary/10 p-2">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
