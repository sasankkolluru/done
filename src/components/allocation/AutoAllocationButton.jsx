// src/components/allocations/AutoAllocationButton.jsx
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
  Box
} from '@mui/material';
import { AutoFixHigh as AutoFixIcon } from '@mui/icons-material';
import { autoAllocationService } from '../../services/allocations/autoAllocationService';

const AutoAllocationButton = ({ 
  faculty = [], 
  exams = [], 
  onAllocationsGenerated,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => !isLoading && setOpen(false);

  const handleGenerate = async () => {
    if (faculty.length === 0 || exams.length === 0) {
      console.warn('No faculty or exams provided for allocation');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      const allocations = await autoAllocationService.generateAllocations(faculty, exams);
      clearInterval(progressInterval);
      setProgress(100);

      onAllocationsGenerated?.(allocations);
      setTimeout(() => setOpen(false), 500);
    } catch (error) {
      console.error('Auto-allocation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AutoFixIcon />}
        onClick={handleOpen}
        disabled={disabled || faculty.length === 0 || exams.length === 0}
      >
        Auto Allocate
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Auto-Generate Allocations</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            This will automatically assign faculty to invigilate exams based on:
          </Typography>
          <ul>
            <li>Faculty availability</li>
            <li>Workload distribution</li>
            <li>Leave schedules</li>
            <li>Room capacities</li>
          </ul>
          
          {isLoading && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Generating allocations...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            variant="contained"
            color="primary"
            disabled={isLoading || faculty.length === 0 || exams.length === 0}
            startIcon={isLoading ? null : <AutoFixIcon />}
          >
            {isLoading ? 'Generating...' : 'Generate Allocations'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AutoAllocationButton;