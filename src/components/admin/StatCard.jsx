import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3,
      },
    }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            color="textSecondary"
            gutterBottom
            sx={{ fontSize: '0.9rem', fontWeight: 500 }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              backgroundColor: `${color}.lighter`,
              color: `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { fontSize: 'small' })}
          </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'success.main',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderBottom: '5px solid',
                borderBottomColor: 'success.main',
                mr: 0.5,
              }}
            />
            12% from last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
