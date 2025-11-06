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
  Tooltip,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  Chip
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon, 
  Close as CloseIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

const FacultyUpload = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ 
    success: false, 
    message: '' 
  });

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

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus({ success: false, message: '' });

    try {
      // In a real app, you would send the file to your backend
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await axios.post('/api/upload/faculty', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUploadStatus({ 
        success: true, 
        message: 'Faculty data uploaded successfully!' 
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
        message: 'Failed to upload faculty data. Please try again.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionIcon color="primary" />
            Upload Faculty Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload a CSV file containing faculty availability and details
          </Typography>
        </Box>
        <Chip 
          label="CSV Template" 
          variant="outlined" 
          onClick={() => window.open('/templates/faculty_template.csv', '_blank')}
          clickable
          size="small"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

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
              {isUploading ? 'Uploading...' : 'Upload Faculty Data'}
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

export default FacultyUpload;
