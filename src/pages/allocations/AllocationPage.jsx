// src/pages/allocations/AllocationPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Button
} from '@mui/material';
import { AutoAllocationButton } from '../../components/allocations';
import { useApi } from '../../hooks/api/useApi';

const AllocationPage = () => {
  // Sample test data
  const [faculty, setFaculty] = useState([
    { id: 'f1', name: 'Dr. Smith', department: 'Computer Science' },
    { id: 'f2', name: 'Dr. Johnson', department: 'Mathematics' },
    { id: 'f3', name: 'Dr. Williams', department: 'Physics' },
    { id: 'f4', name: 'Dr. Brown', department: 'Chemistry' },
  ]);
  
  const [exams, setExams] = useState([
    {
      id: 'e1',
      name: 'Midterm Exam',
      course: 'CS101',
      startTime: '2025-12-10T09:00:00',
      endTime: '2025-12-10T12:00:00',
      rooms: ['R101', 'R102']
    },
    {
      id: 'e2',
      name: 'Final Exam',
      course: 'MATH201',
      startTime: '2025-12-15T14:00:00',
      endTime: '2025-12-15T17:00:00',
      rooms: ['R101', 'R103']
    }
  ]);
  
  const [allocations, setAllocations] = useState([]);
  const { get, post } = useApi();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // In a real app, fetch from your API
      // const [facultyRes, examsRes, allocationsRes] = await Promise.all([
      //   get('/api/faculty'),
      //   get('/api/exams'),
      //   get('/api/allocations')
      // ]);
      // setFaculty(facultyRes.data);
      // setExams(examsRes.data);
      // setAllocations(allocationsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAllocationsGenerated = (newAllocations) => {
    setAllocations(newAllocations);
    // In a real app, save to your API
    // await post('/api/allocations/bulk', { allocations: newAllocations });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Exam Allocations</Typography>
        <AutoAllocationButton
          faculty={faculty}
          exams={exams}
          onAllocationsGenerated={handleAllocationsGenerated}
        />
      </Box>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Allocations ({allocations.length})
        </Typography>
        
        {allocations.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            {allocations.map((allocation, index) => {
              const exam = exams.find(e => e.id === allocation.examId);
              const facultyMember = faculty.find(f => f.id === allocation.facultyId);
              
              return (
                <Box 
                  key={allocation.id} 
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    border: '1px solid', 
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.paper'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <Typography variant="subtitle1">
                        {exam?.name || 'Unknown Exam'} - {exam?.course}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Room: {allocation.roomId}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body2">
                        {facultyMember?.name || 'Unassigned'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exam?.startTime ? new Date(exam.startTime).toLocaleString() : ''}
                      </Typography>
                    </div>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            No allocations generated yet. Click "Auto Allocate" to generate allocations.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default AllocationPage;