import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  Divider,
  Breadcrumbs,
  Link,
  Stack,
  Badge,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon,
  UploadFile as UploadFileIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FilterAlt as FilterAltIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  MeetingRoom as RoomIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../contexts/AuthContext';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    department: []
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from an API
  const examTypes = ['Midterm', 'Final', 'Quiz', 'Assignment', 'Practical'];
  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

  // Fetch exams data
  const fetchExams = async () => {
    try {
      setLoading(true);
      // In a real app, you would call your API like this:
      // const response = await examAPI.getAll();
      // setExams(response.data);
      
      // Mock data for now
      const mockExams = Array(15).fill().map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + (i % 10) - 2); // Some past, some future dates
        const type = examTypes[i % examTypes.length];
        const department = departments[i % departments.length];
        const startTime = new Date(date);
        startTime.setHours(9 + (i % 8), 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 2);
        
        return {
          id: `EXAM-${1000 + i}`,
          name: `${department.substring(0, 3).toUpperCase()}${100 + (i % 900)} ${type}`,
          course: `${department.substring(0, 3).toUpperCase()}${100 + (i % 900)}`,
          type,
          department,
          date: date.toISOString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration: 120, // minutes
          totalStudents: 30 + (i % 70),
          rooms: [`A-${101 + (i % 10)}`, `A-${102 + (i % 5)}`],
          status: getExamStatus(date, startTime, endTime),
          invigilators: Array(1 + (i % 3)).fill().map((_, idx) => ({
            id: `FAC-${1000 + i + idx}`,
            name: `Prof. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][(i + idx) % 5]}`,
            role: ['Chief Invigilator', 'Invigilator', 'Support Staff'][idx % 3]
          })),
          isPublished: i % 3 !== 0
        };
      });
      
      setExams(mockExams);
      setFilteredData(mockExams);
    } catch (error) {
      console.error('Error fetching exams:', error);
      enqueueSnackbar('Failed to load exam data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Determine exam status based on current date/time
  const getExamStatus = (date, startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isBefore(now, start)) {
      return 'upcoming';
    } else if (isAfter(now, end)) {
      return 'completed';
    } else {
      return 'ongoing';
    }
  };

  // Initial data load
  useEffect(() => {
    fetchExams();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...exams];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.course.toLowerCase().includes(term) ||
        item.department.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter(item => filters.status.includes(item.status));
    }
    
    // Apply type filter
    if (filters.type.length > 0) {
      result = result.filter(item => filters.type.includes(item.type));
    }
    
    // Apply department filter
    if (filters.department.length > 0) {
      result = result.filter(item => filters.department.includes(item.department));
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Special handling for date sorting
        if (sortConfig.key === 'date') {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortConfig.direction === 'asc' 
            ? dateA - dateB 
            : dateB - dateA;
        }
        
        // Default sorting for other fields
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredData(result);
    setPage(0); // Reset to first page when filters change
  }, [exams, searchTerm, filters, sortConfig]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filter, value) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleView = (id) => {
    navigate(`/exams/${id}`);
    handleMenuClose();
  };

  const handleEdit = (id) => {
    const examToEdit = exams.find(e => e.id === id);
    setSelectedExam(examToEdit);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDelete = async (id) => {
    try {
      await confirm({
        title: 'Delete Exam',
        description: 'Are you sure you want to delete this exam? This action cannot be undone.',
        confirmationText: 'Delete',
        confirmationButtonProps: { variant: 'contained', color: 'error' },
        cancellationButtonProps: { variant: 'outlined' }
      });
      
      // In a real app, you would call your API like this:
      // await examAPI.delete(id);
      
      setExams(prev => prev.filter(e => e.id !== id));
      enqueueSnackbar('Exam deleted successfully', { variant: 'success' });
    } catch (error) {
      if (error !== 'cancelled') {
        console.error('Error deleting exam:', error);
        enqueueSnackbar('Failed to delete exam', { variant: 'error' });
      }
    } finally {
      handleMenuClose();
    }
  };

  const handleAddNew = () => {
    setSelectedExam(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExam(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedExam) {
        // Update existing exam
        // await examAPI.update(selectedExam.id, data);
        setExams(prev => prev.map(e => e.id === selectedExam.id ? { ...e, ...data } : e));
        enqueueSnackbar('Exam updated successfully', { variant: 'success' });
      } else {
        // Add new exam
        // const response = await examAPI.create(data);
        const newExam = {
          ...data,
          id: `EXAM-${1000 + exams.length}`,
          status: getExamStatus(data.date, data.startTime, data.endTime),
          invigilators: [],
          isPublished: false
        };
        setExams(prev => [newExam, ...prev]);
        enqueueSnackbar('Exam added successfully', { variant: 'success' });
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving exam:', error);
      enqueueSnackbar(`Failed to ${selectedExam ? 'update' : 'add'} exam`, { variant: 'error' });
    }
  };

  const handlePublish = async (id, publish) => {
    try {
      // In a real app, you would call your API like this:
      // await examAPI.updateStatus(id, { isPublished: publish });
      
      setExams(prev => prev.map(e => 
        e.id === id ? { ...e, isPublished: publish } : e
      ));
      
      enqueueSnackbar(
        publish ? 'Exam published successfully' : 'Exam unpublished successfully',
        { variant: 'success' }
      );
    } catch (error) {
      console.error('Error updating exam status:', error);
      enqueueSnackbar('Failed to update exam status', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'info';
      case 'ongoing':
        return 'success';
      case 'completed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming':
        return <InfoIcon color="info" fontSize="small" />;
      case 'ongoing':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'completed':
        return <EventIcon color="secondary" fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? 
        <ArrowUpwardIcon fontSize="small" /> : 
        <ArrowDownwardIcon fontSize="small" />;
    }
    return <SortIcon fontSize="small" />;
  };

  const formatDateTime = (dateTime) => {
    return format(parseISO(dateTime), 'MMM d, yyyy h:mm a');
  };

  if (loading && exams.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" color="inherit" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <AssignmentIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Exams
          </Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h4" component="h1">
            Exam Management
          </Typography>
          
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => enqueueSnackbar('Export functionality will be implemented soon', { variant: 'info' })}
              disabled={exams.length === 0}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
            >
              Add Exam
            </Button>
          </Box>
        </Box>
      </Box>
      
      {/* Filters */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box display="flex" gap={2} flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.length === 0 ? 'All Status' : `${selected.length} selected`}
                    </Box>
                  )}
                  startAdornment={
                    filters.status.length > 0 && (
                      <InputAdornment position="start">
                        <FilterAltIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }
                >
                  {['upcoming', 'ongoing', 'completed'].map((status) => (
                    <MenuItem key={status} value={status}>
                      <Checkbox checked={filters.status.indexOf(status) > -1} />
                      <ListItemText 
                        primary={
                          <Box display="flex" alignItems="center">
                            {getStatusIcon(status)}
                            <Box ml={1}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Box>
                          </Box>
                        } 
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  multiple
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.length === 0 ? 'All Types' : `${selected.length} selected`}
                    </Box>
                  )}
                  startAdornment={
                    filters.type.length > 0 && (
                      <InputAdornment position="start">
                        <FilterAltIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }
                >
                  {examTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Checkbox checked={filters.type.indexOf(type) > -1} />
                      <ListItemText primary={type} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  multiple
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.length === 0 ? 'All Departments' : `${selected.length} selected`}
                    </Box>
                  )}
                  startAdornment={
                    filters.department.length > 0 && (
                      <InputAdornment position="start">
                        <FilterAltIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      <Checkbox checked={filters.department.indexOf(dept) > -1} />
                      <ListItemText primary={dept} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {(filters.status.length > 0 || filters.type.length > 0 || filters.department.length > 0) && (
                <Button
                  size="small"
                  onClick={() => setFilters({ status: [], type: [], department: [] })}
                  startIcon={<CloseIcon />}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Exams Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading && <LinearProgress />}
        
        <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)', minHeight: 300 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Exam Details</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Rooms</TableCell>
                <TableCell>Invigilators</TableCell>
                <TableCell 
                  onClick={() => handleSort('status')}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <Box display="flex" alignItems="center">
                    Status
                    <Box ml={0.5} display="flex" flexDirection="column">
                      {renderSortIcon('status')}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((exam) => (
                    <TableRow hover key={exam.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            {exam.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {exam.course} • {exam.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {format(parseISO(exam.date), 'MMM d, yyyy')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(parseISO(exam.startTime), 'h:mm a')} - {format(parseISO(exam.endTime), 'h:mm a')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{exam.department}</TableCell>
                      <TableCell>
                        <Box display="flex" flexWrap="wrap" gap={0.5} maxWidth={150}>
                          {exam.rooms.map((room, idx) => (
                            <Chip 
                              key={idx} 
                              label={room} 
                              size="small" 
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex">
                          {exam.invigilators.length > 0 ? (
                            <Box display="flex" alignItems="center">
                              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.75rem' } }}>
                                {exam.invigilators.map((inv, idx) => (
                                  <Tooltip key={idx} title={`${inv.name} (${inv.role})`}>
                                    <Avatar 
                                      alt={inv.name} 
                                      src={`https://i.pravatar.cc/150?img=${idx + 10}`}
                                    >
                                      {inv.name.charAt(0)}
                                    </Avatar>
                                  </Tooltip>
                                ))}
                              </AvatarGroup>
                              {exam.invigilators.length > 3 && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                  +{exam.invigilators.length - 3} more
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Not assigned
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                          color={getStatusColor(exam.status)}
                          size="small"
                          icon={getStatusIcon(exam.status)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" justifyContent="flex-end">
                          <Tooltip title={exam.isPublished ? 'Unpublish' : 'Publish'}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePublish(exam.id, !exam.isPublished);
                                }}
                                color={exam.isPublished ? 'primary' : 'default'}
                                disabled={exam.status === 'completed'}
                              >
                                {exam.isPublished ? <CheckCircleIcon /> : <InfoIcon />}
                              </IconButton>
                            </span>
                          </Tooltip>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, exam.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <AssignmentIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="subtitle1" color="textSecondary">
                        No exams found
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Try adjusting your search or filter criteria
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="small" 
                        sx={{ mt: 2 }}
                        onClick={() => {
                          setSearchTerm('');
                          setFilters({ status: [], type: [], department: [] });
                        }}
                      >
                        Clear Filters
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleView(selectedId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View Details" />
        </MenuItem>
        <MenuItem onClick={() => handleEdit(selectedId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => {
            const exam = exams.find(e => e.id === selectedId);
            if (exam) {
              handlePublish(exam.id, !exam.isPublished);
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {exams.find(e => e.id === selectedId)?.isPublished ? (
              <ErrorIcon fontSize="small" color="error" />
            ) : (
              <CheckCircleIcon fontSize="small" color="primary" />
            )}
          </ListItemIcon>
          <ListItemText 
            primary={exams.find(e => e.id === selectedId)?.isPublished ? 'Unpublish' : 'Publish'} 
          />
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleDelete(selectedId)} 
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
      
      {/* Add/Edit Exam Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedExam ? 'Edit Exam' : 'Add New Exam'}
        </DialogTitle>
        <DialogContent dividers>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              {selectedExam 
                ? `Edit ${selectedExam.name}`
                : 'Enter exam details'}
            </Typography>
            
            {/* Form would go here */}
            <Box mt={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Exam form implementation would go here with fields for:
              </Typography>
              <ul>
                <li>Exam name and code</li>
                <li>Course and department</li>
                <li>Exam type (Midterm, Final, etc.)</li>
                <li>Date and time pickers</li>
                <li>Duration</li>
                <li>Assigned rooms</li>
                <li>Invigilators</li>
                <li>Additional notes</li>
              </ul>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              // In a real app, this would submit the form
              handleCloseDialog();
              enqueueSnackbar(
                selectedExam 
                  ? 'Exam updated successfully' 
                  : 'Exam added successfully',
                { variant: 'success' }
              );
            }}
          >
            {selectedExam ? 'Update' : 'Add'} Exam
          </Button>
          {selectedExam && (
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => {
                // In a real app, this would save and publish
                handleCloseDialog();
                handlePublish(selectedExam.id, true);
                enqueueSnackbar('Exam published successfully', { variant: 'success' });
              }}
            >
              Save & Publish
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper component for avatar group with tooltips
const AvatarGroup = ({ max, children, ...props }) => {
  const avatars = React.Children.toArray(children);
  const numAvatars = avatars.length;
  const displayAvatars = max ? avatars.slice(0, max) : avatars;
  
  return (
    <Box display="flex" {...props}>
      {displayAvatars.map((avatar, index) => (
        <Box key={index} ml={index > 0 ? -1 : 0}>
          {avatar}
        </Box>
      ))}
      {numAvatars > max && (
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32, 
            fontSize: '0.75rem',
            ml: -1,
            bgcolor: 'grey.300',
            color: 'grey.800'
          }}
        >
          +{numAvatars - max}
        </Avatar>
      )}
    </Box>
  );
};

export default ExamList;
