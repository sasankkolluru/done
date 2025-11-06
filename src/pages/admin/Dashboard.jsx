import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Tabs, 
  Tab,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Upload as UploadIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Email as EmailIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
  CloudUpload as CloudUploadIcon,
  AutoFixHigh as AutoFixHighIcon,
  PictureAsPdf as PdfIcon,
  Send as SendIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import StatCard from '../../components/admin/StatCard';
import RecentActivities from '../../components/admin/RecentActivities';
import ScheduleCalendar from '../../components/calendar/ScheduleCalendar';
import FacultyUpload from '../../components/upload/FacultyUpload';
import RoomUpload from '../../components/upload/RoomUpload';
import AllocationSummary from '../../components/allocation/AllocationSummary';
import { useAuth } from '../../contexts/AuthContext';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
  height: '100%'
}));

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Mock data - replace with actual API calls
  const stats = [
    { title: 'Total Faculty', value: '124', icon: <AssignmentIcon />, color: 'primary' },
    { title: 'Rooms Available', value: '45', icon: <ScheduleIcon />, color: 'secondary' },
    { title: 'Upcoming Exams', value: '18', icon: <AssignmentIcon />, color: 'success' },
    { title: 'Pending Approvals', value: '7', icon: <EmailIcon />, color: 'warning' },
  ];

  const quickActions = [
    { 
      label: 'Upload Faculty Data', 
      icon: <CloudUploadIcon />, 
      action: () => setActiveTab(1) 
    },
    { 
      label: 'Auto Allocate', 
      icon: <AutoFixHighIcon />, 
      action: () => console.log('Auto Allocate') 
    },
    { 
      label: 'Generate PDFs', 
      icon: <PdfIcon />, 
      action: () => console.log('Generate PDFs') 
    },
    { 
      label: 'Send Notifications', 
      icon: <SendIcon />, 
      action: () => console.log('Send Notifications') 
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Welcome back, {user?.name || 'Admin'}!
        </Typography>
      </Box>
      
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard 
              title={stat.title} 
              value={stat.value} 
              icon={stat.icon} 
              color={stat.color}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons={isMobile ? 'auto' : false}
              allowScrollButtonsMobile
              sx={{ mb: 2 }}
            >
              <Tab label="Schedule" icon={<ScheduleIcon />} iconPosition="start" />
              <Tab label="Upload Data" icon={<UploadIcon />} iconPosition="start" />
              <Tab label="Allocations" icon={<AssignmentIcon />} iconPosition="start" />
              <Tab label="Analytics" icon={<BarChart />} iconPosition="start" />
              <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
            </Tabs>

            <Box sx={{ mt: 2 }}>
              {activeTab === 0 && (
                <Box>
                  <ScheduleCalendar />
                </Box>
              )}
              {activeTab === 1 && (
                <Box>
                  <FacultyUpload />
                  <Box sx={{ mt: 4 }}>
                    <RoomUpload />
                  </Box>
                </Box>
              )}
              {activeTab === 2 && (
                <AllocationSummary />
              )}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Analytics Dashboard
                  </Typography>
                  <Typography>Analytics content will be displayed here</Typography>
                </Box>
              )}
              {activeTab === 4 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Settings
                  </Typography>
                  <Typography>Settings will be displayed here</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Quick Actions */}
            <Item>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoFixHighIcon /> Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <Button
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={action.action}
                      fullWidth
                      sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                    >
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Item>

            {/* Recent Activities */}
            <Item>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon /> Recent Activities
              </Typography>
              <RecentActivities />
            </Item>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
