import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Typography, 
  Box,
  Divider
} from '@mui/material';
import { 
  Assignment as AssignmentIcon, 
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const activityData = [
  {
    id: 1,
    action: 'Allocation Completed',
    details: 'Successfully allocated invigilation duties for Midterm Exams',
    timestamp: new Date('2023-11-05T14:30:00'),
    type: 'success',
    user: 'John Doe'
  },
  {
    id: 2,
    action: 'New Faculty Added',
    details: 'Dr. Sarah Johnson added to the faculty list',
    timestamp: new Date('2023-11-05T12:15:00'),
    type: 'info',
    user: 'Admin'
  },
  {
    id: 3,
    action: 'Warning',
    details: 'Room A-101 has a scheduling conflict',
    timestamp: new Date('2023-11-05T10:45:00'),
    type: 'warning',
    user: 'System'
  },
  {
    id: 4,
    action: 'Error',
    details: 'Failed to send notification to faculty@example.com',
    timestamp: new Date('2023-11-05T09:20:00'),
    type: 'error',
    user: 'System'
  },
  {
    id: 5,
    action: 'Data Imported',
    details: 'Successfully imported faculty schedule data',
    timestamp: new Date('2023-11-05T08:10:00'),
    type: 'info',
    user: 'Jane Smith'
  }
];

const getActivityIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon color="success" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'info':
    default:
      return <InfoIcon color="info" />;
  }
};

const RecentActivities = () => {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {activityData.map((activity, index) => (
        <React.Fragment key={activity.id}>
          <ListItem alignItems="flex-start" sx={{ px: 0 }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'transparent' }}>
                {getActivityIcon(activity.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    component="span"
                    variant="subtitle2"
                    color="text.primary"
                    fontWeight={500}
                  >
                    {activity.action}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </Typography>
                </Box>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    display="block"
                  >
                    {activity.details}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: 'text.secondary',
                        mx: 0.5,
                      }}
                    />
                    {activity.user}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          {index < activityData.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default RecentActivities;
