import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress,
  Chip
} from '@mui/material';
import { 
  Event as EventIcon, 
  People as PeopleIcon, 
  School as SchoolIcon, 
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  NotificationsActive as NotificationsActiveIcon,
  CalendarToday as CalendarTodayIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for the dashboard
const stats = [
  { id: 1, title: 'Upcoming Duties', value: '5', icon: <EventIcon />, color: 'primary.main', trend: 'up', trendValue: '12%' },
  { id: 2, title: 'Total Faculty', value: '42', icon: <PeopleIcon />, color: 'secondary.main', trend: 'up', trendValue: '5%' },
  { id: 3, title: 'Exams This Month', value: '8', icon: <SchoolIcon />, color: 'success.main', trend: 'down', trendValue: '3%' },
  { id: 4, title: 'Pending Approvals', value: '3', icon: <AssignmentIcon />, color: 'warning.main', trend: 'up', trendValue: '2%' },
];

const recentActivities = [
  { id: 1, title: 'New invigilation schedule published', date: '2023-11-06T10:30:00', type: 'announcement' },
  { id: 2, title: 'You have been assigned to CS101 Midterm', date: '2023-11-05T14:15:00', type: 'assignment' },
  { id: 3, title: 'Room change for MATH201 Final', date: '2023-11-04T09:45:00', type: 'update' },
  { id: 4, title: 'New faculty member added', date: '2023-11-03T16:20:00', type: 'new' },
];

const upcomingDuties = [
  { id: 1, course: 'CS101', type: 'Midterm', date: '2023-11-15', time: '09:00 AM - 12:00 PM', room: 'A-101', status: 'confirmed' },
  { id: 2, course: 'MATH201', type: 'Final', date: '2023-11-17', time: '02:00 PM - 05:00 PM', room: 'B-205', status: 'pending' },
  { id: 3, course: 'PHYS101', type: 'Quiz', date: '2023-11-20', time: '10:00 AM - 11:30 AM', room: 'C-102', status: 'confirmed' },
  { id: 4, course: 'CHEM201', type: 'Midterm', date: '2023-11-22', time: '01:00 PM - 04:00 PM', room: 'D-301', status: 'confirmed' },
];

const performanceData = [
  { name: 'Jan', duties: 12, hours: 24 },
  { name: 'Feb', duties: 8, hours: 16 },
  { name: 'Mar', duties: 15, hours: 30 },
  { name: 'Apr', duties: 10, hours: 20 },
  { name: 'May', duties: 18, hours: 36 },
  { name: 'Jun', duties: 14, hours: 28 },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'pending':
        return <PendingIcon color="warning" fontSize="small" />;
      case 'conflict':
        return <WarningIcon color="error" fontSize="small" />;
      default:
        return null;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'announcement':
        return <NotificationsActiveIcon color="info" />;
      case 'assignment':
        return <AssignmentIcon color="primary" />;
      case 'update':
        return <CalendarTodayIcon color="secondary" />;
      case 'new':
        return <PeopleIcon color="success" />;
      default:
        return <EventIcon color="action" />;
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your invigilation duties today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: `4px solid ${theme.palette[stat.color.split('.')[0]].main}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(stat.icon, { fontSize: 'large' })}
                  </Box>
                  <Chip 
                    label={`${stat.trend === 'up' ? '↑' : '↓'} ${stat.trendValue}`} 
                    size="small"
                    color={stat.trend === 'up' ? 'success' : 'error'}
                    variant="outlined"
                    sx={{ 
                      fontSize: '0.7rem',
                      height: 24,
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions sx={{ p: 1.5, pt: 1 }}>
                <Button 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  View all
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Performance Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" component="h2">
                Performance Overview
              </Typography>
              <Button size="small" endIcon={<TrendingUpIcon />}>
                View Report
              </Button>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="duties" fill={theme.palette.primary.main} name="Duties" />
                  <Bar dataKey="hours" fill={theme.palette.secondary.main} name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                Recent Activities
              </Typography>
              <Button size="small">View All</Button>
            </Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {recentActivities.map((activity) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(activity.date), 'MMM d, yyyy h:mm a')}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" sx={{ mx: 0 }} />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Duties */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" component="h2">
                Upcoming Invigilation Duties
              </Typography>
              <Button size="small" startIcon={<CalendarTodayIcon />}>
                View Calendar
              </Button>
            </Box>
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 800 }}>
                <List>
                  {upcomingDuties.map((duty, index) => (
                    <React.Fragment key={duty.id}>
                      <ListItem 
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                          },
                        }}
                        secondaryAction={
                          <Box display="flex" alignItems="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                              {getStatusIcon(duty.status)}
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ ml: 0.5, textTransform: 'capitalize' }}
                              >
                                {duty.status}
                              </Typography>
                            </Box>
                            <IconButton edge="end" size="small">
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        }
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box sx={{ width: '25%' }}>
                            <Typography variant="subtitle2" noWrap>
                              {duty.course} - {duty.type}
                            </Typography>
                          </Box>
                          <Box sx={{ width: '25%' }}>
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(duty.date), 'MMM d, yyyy')}
                            </Typography>
                          </Box>
                          <Box sx={{ width: '25%' }}>
                            <Typography variant="body2" color="text.secondary">
                              {duty.time}
                            </Typography>
                          </Box>
                          <Box sx={{ width: '25%' }}>
                            <Chip 
                              label={duty.room} 
                              size="small" 
                              variant="outlined"
                              sx={{ textTransform: 'uppercase' }}
                            />
                          </Box>
                        </Box>
                      </ListItem>
                      {index < upcomingDuties.length - 1 && <Divider variant="inset" component="li" sx={{ mx: 4 }} />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
