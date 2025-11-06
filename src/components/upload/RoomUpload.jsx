import React, { useState, useCallback } from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  Chip,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon, 
  Close as CloseIcon,
  MeetingRoom as MeetingRoomIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

const RoomUpload = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ 
    success: false, 
    message: '' 
  });
  const [manualEntry, setManualEntry] = useState({
    roomNumber: '',
    building: '',
    floor: '',
    capacity: '',
    type: 'lecture',
    isActive: true
  });
  const [showManualForm, setShowManualForm] = useState(false);

  const buildings = ['A', 'B', 'C', 'D', 'E', 'F'];
  const floors = ['Ground', '1', '2', '3', '4', '5'];
  const roomTypes = [
    { value: 'lecture', label: 'Lecture Hall' },
    { value: 'lab', label: 'Laboratory' },
    { value: 'seminar', label: 'Seminar Room' },
    { value: 'other', label: 'Other' }
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const csvFile = acceptedFiles[0];
    if (!csvFile) return;

    setFile(csvFile);
    setUploadStatus({ success: false, message: '' });
    
    // Parse CSV file
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreviewData(results.data.slice(0, 5)); // Show first 5 rows for preview
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setUploadStatus({ 
          success: false, 
          message: 'Error parsing CSV file. Please check the format.' 
        });
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1
  });

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewData([]);
    setUploadStatus({ success: false, message: '' });
  };

  const handleManualInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setManualEntry({
      ...manualEntry,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddRoom = async () => {
    // Validate form
    if (!manualEntry.roomNumber || !manualEntry.building || !manualEntry.floor || !manualEntry.capacity) {
      setUploadStatus({ 
        success: false, 
        message: 'Please fill in all required fields' 
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ success: false, message: '' });

    try {
      // In a real app, you would send this to your backend
      // const response = await axios.post('/api/rooms', manualEntry);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadStatus({ 
        success: true, 
        message: 'Room added successfully!' 
      });
      
      // Reset form
      setManualEntry({
        roomNumber: '',
        building: '',
        floor: '',
        capacity: '',
        type: 'lecture',
        isActive: true
      });
      
      // Hide form after successful submission
      setTimeout(() => {
        setShowManualForm(false);
        setUploadStatus({ success: false, message: '' });
      }, 1500);
    } catch (error) {
      console.error('Error adding room:', error);
      setUploadStatus({ 
        success: false, 
        message: 'Failed to add room. Please try again.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus({ success: false, message: '' });

    try {
      // In a real app, you would send the file to your backend
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await axios.post('/api/upload/rooms', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUploadStatus({ 
        success: true, 
        message: 'Room data uploaded successfully!' 
      });
      
      // Clear the form after successful upload
      setTimeout(() => {
        setFile(null);
        setPreviewData([]);
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        success: false, 
        message: 'Failed to upload room data. Please try again.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MeetingRoomIcon color="primary" />
            Upload Room Availability
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload a CSV file with room details or add rooms manually
          </Typography>
        </Box>
        <Chip 
          label="CSV Template" 
          variant="outlined" 
          onClick={() => window.open('/templates/room_template.csv', '_blank')}
          clickable
          size="small"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {!showManualForm ? (
        <>
          {!file ? (
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'action.hover',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'action.selected',
                  borderColor: 'primary.dark',
                },
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">
                {isDragActive ? 'Drop the file here' : 'Drag & drop a CSV file here, or click to select'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Only .csv files are accepted
              </Typography>
            </Box>
          ) : (
            <Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                backgroundColor: 'success.light',
                borderRadius: 1,
                mb: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="body2">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Typography>
                </Box>
                <IconButton size="small" onClick={handleRemoveFile}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {previewData.length > 0 && (
                <Box sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview (first 5 rows):
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {Object.keys(previewData[0]).map((header, index) => (
                            <TableCell key={index} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewData.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {Object.values(row).map((value, colIndex) => (
                              <TableCell key={colIndex}>
                                {value || '-'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={isUploading}
                  startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                >
                  {isUploading ? 'Uploading...' : 'Upload Room Data'}
                </Button>
              </Box>
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">OR</Typography>
            </Divider>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowManualForm(true)}
            >
              Add Room Manually
            </Button>
          </Box>
        </>
      ) : (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Add New Room
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Room Number"
                name="roomNumber"
                value={manualEntry.roomNumber}
                onChange={handleManualInputChange}
                required
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Building</InputLabel>
                <Select
                  name="building"
                  value={manualEntry.building}
                  onChange={handleManualInputChange}
                  label="Building"
                >
                  {buildings.map((building) => (
                    <MenuItem key={building} value={building}>
                      Building {building}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Floor</InputLabel>
                <Select
                  name="floor"
                  value={manualEntry.floor}
                  onChange={handleManualInputChange}
                  label="Floor"
                >
                  {floors.map((floor) => (
                    <MenuItem key={floor} value={floor}>
                      {floor === 'Ground' ? 'Ground Floor' : `${floor}${floor === '1' ? 'st' : floor === '2' ? 'nd' : floor === '3' ? 'rd' : 'th'} Floor`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Capacity"
                name="capacity"
                type="number"
                value={manualEntry.capacity}
                onChange={handleManualInputChange}
                required
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Room Type</InputLabel>
                <Select
                  name="type"
                  value={manualEntry.type}
                  onChange={handleManualInputChange}
                  label="Room Type"
                >
                  {roomTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setShowManualForm(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddRoom}
              disabled={isUploading}
              startIcon={isUploading ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {isUploading ? 'Adding...' : 'Add Room'}
            </Button>
          </Box>
        </Box>
      )}

      {uploadStatus.message && (
        <Box sx={{ mt: 2 }}>
          <Alert 
            severity={uploadStatus.success ? 'success' : 'error'}
            onClose={() => setUploadStatus({ success: false, message: '' })}
          >
            <AlertTitle>{uploadStatus.success ? 'Success' : 'Error'}</AlertTitle>
            {uploadStatus.message}
          </Alert>
        </Box>
      )}
    </Paper>
  );
};

export default RoomUpload;
