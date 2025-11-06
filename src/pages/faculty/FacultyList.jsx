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
  Chip,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Breadcrumbs,
  Link,
  Stack
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon,
  UploadFile as UploadFileIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FilterAlt as FilterAltIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  MoreHoriz as MoreHorizIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { facultyAPI } from '../../services/api';
import { format } from 'date-fns';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../contexts/AuthContext';

const FacultyList = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({
    status: [],
    department: [],
    designation: []
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock departments and designations - in a real app, these would come from an API
  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Economics'
  ];

  const designations = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Visiting Faculty'
  ];

  // Fetch faculty data
  const fetchFaculty = async () => {
    try {
      setLoading(true);
      // In a real app, you would call your API like this:
      // const response = await facultyAPI.getAll();
      // setFaculty(response.data);
      
      // Mock data for now
      const mockFaculty = Array(25).fill().map((_, i) => ({
        id: `FAC-${1000 + i}`,
        name: `Dr. ${['John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'David', 'Lisa'][i % 8]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'][i % 8]}`,
        email: `faculty${i + 1}@university.edu`,
        phone: `+1 (555) ${100 + (i % 900)}-${1000 + (i % 9000)}`,
        department: departments[i % departments.length],
        designation: designations[i % designations.length],
        status: ['active', 'inactive', 'on_leave'][i % 3],
        joinDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString(),
        courses: ['CS101', 'MATH201', 'PHYS101', 'CHEM201', 'BIO101'].slice(0, 1 + (i % 3)),
        photo: `https://i.pravatar.cc/150?img=${i % 70}`,
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      setFaculty(mockFaculty);
      setFilteredData(mockFaculty);
    } catch (error) {
      console.error('Error fetching faculty:', error);
      enqueueSnackbar('Failed to load faculty data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchFaculty();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...faculty];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.department.toLowerCase().includes(term) ||
        item.designation.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter(item => filters.status.includes(item.status));
    }
    
    // Apply department filter
    if (filters.department.length > 0) {
      result = result.filter(item => filters.department.includes(item.department));
    }
    
    // Apply designation filter
    if (filters.designation.length > 0) {
      result = result.filter(item => filters.designation.includes(item.designation));
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
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
  }, [faculty, searchTerm, filters, sortConfig]);

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

  const handleEdit = (id) => {
    const facultyToEdit = faculty.find(f => f.id === id);
    setSelectedFaculty(facultyToEdit);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleView = (id) => {
    navigate(`/faculty/${id}`);
    handleMenuClose();
  };

  const handleDelete = async (id) => {
    try {
      await confirm({
        title: 'Delete Faculty Member',
        description: 'Are you sure you want to delete this faculty member? This action cannot be undone.',
        confirmationText: 'Delete',
        confirmationButtonProps: { variant: 'contained', color: 'error' },
        cancellationButtonProps: { variant: 'outlined' }
      });
      
      // In a real app, you would call your API like this:
      // await facultyAPI.delete(id);
      
      setFaculty(prev => prev.filter(f => f.id !== id));
      enqueueSnackbar('Faculty member deleted successfully', { variant: 'success' });
    } catch (error) {
      if (error !== 'cancelled') {
        console.error('Error deleting faculty:', error);
        enqueueSnackbar('Failed to delete faculty member', { variant: 'error' });
      }
    } finally {
      handleMenuClose();
    }
  };

  const handleAddNew = () => {
    setSelectedFaculty(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFaculty(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedFaculty) {
        // Update existing faculty
        // await facultyAPI.update(selectedFaculty.id, data);
        setFaculty(prev => prev.map(f => f.id === selectedFaculty.id ? { ...f, ...data } : f));
        enqueueSnackbar('Faculty member updated successfully', { variant: 'success' });
      } else {
        // Add new faculty
        // const response = await facultyAPI.create(data);
        // setFaculty(prev => [...prev, response.data]);
        const newFaculty = {
          ...data,
          id: `FAC-${1000 + faculty.length}`,
          status: 'active',
          joinDate: new Date().toISOString(),
          courses: []
        };
        setFaculty(prev => [...prev, newFaculty]);
        enqueueSnackbar('Faculty member added successfully', { variant: 'success' });
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving faculty:', error);
      enqueueSnackbar(`Failed to ${selectedFaculty ? 'update' : 'add'} faculty member`, { variant: 'error' });
    }
  };

  const handleExport = () => {
    // In a real app, you would call your API to export data
    enqueueSnackbar('Exporting faculty data...', { variant: 'info' });
    // Simulate export
    setTimeout(() => {
      enqueueSnackbar('Faculty data exported successfully', { variant: 'success' });
    }, 1500);
  };

  const handleImport = () => {
    // In a real app, you would implement file upload and import logic
    enqueueSnackbar('Import functionality will be implemented soon', { variant: 'info' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'on_leave':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'on_leave':
        return 'On Leave';
      default:
        return status;
    }
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
    }
    return <SortIcon fontSize="small" />;
  };

  if (loading && faculty.length === 0) {
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
            <PeopleIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Faculty
          </Typography>
        </Breadcrumbs>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="h4" component="h1">
            Faculty Management
          </Typography>
          
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={faculty.length === 0}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={handleImport}
            >
              Import
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddNew}
            >
              Add Faculty
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
              placeholder="Search faculty..."
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
                      <ClearIcon fontSize="small" />
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
                  {['active', 'inactive', 'on_leave'].map((status) => (
                    <MenuItem key={status} value={status}>
                      <Checkbox checked={filters.status.indexOf(status) > -1} />
                      <ListItemText primary={getStatusLabel(status)} />
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
              
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Designation</InputLabel>
                <Select
                  multiple
                  value={filters.designation}
                  onChange={(e) => handleFilterChange('designation', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.length === 0 ? 'All Designations' : `${selected.length} selected`}
                    </Box>
                  )}
                  startAdornment={
                    filters.designation.length > 0 && (
                      <InputAdornment position="start">
                        <FilterAltIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }
                >
                  {designations.map((desig) => (
                    <MenuItem key={desig} value={desig}>
                      <Checkbox checked={filters.designation.indexOf(desig) > -1} />
                      <ListItemText primary={desig} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {(filters.status.length > 0 || filters.department.length > 0 || filters.designation.length > 0) && (
                <Button
                  size="small"
                  onClick={() => setFilters({ status: [], department: [], designation: [] })}
                  startIcon={<CloseIcon />}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Faculty Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading && <LinearProgress />}
        
        <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)', minHeight: 300 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Faculty</TableCell>
                <TableCell 
                  onClick={() => handleSort('department')}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <Box display="flex" alignItems="center">
                    Department
                    <Box ml={0.5} display="flex" flexDirection="column">
                      {renderSortIcon('department')}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('designation')}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <Box display="flex" alignItems="center">
                    Designation
                    <Box ml={0.5} display="flex" flexDirection="column">
                      {renderSortIcon('designation')}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>Contact</TableCell>
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
                  .map((faculty) => (
                    <TableRow hover key={faculty.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            src={faculty.photo} 
                            alt={faculty.name}
                            sx={{ width: 40, height: 40, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">{faculty.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{faculty.id}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{faculty.department}</TableCell>
                      <TableCell>{faculty.designation}</TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column">
                          <Box display="flex" alignItems="center" mb={0.5}>
                            <EmailIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" noWrap>
                              {faculty.email}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center">
                            <PhoneIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {faculty.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(faculty.status)}
                          color={getStatusColor(faculty.status)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, faculty.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <PeopleIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="subtitle1" color="textSecondary">
                        No faculty members found
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
                          setFilters({ status: [], department: [], designation: [] });
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
        <MenuItem onClick={() => handleDelete(selectedId)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
      
      {/* Add/Edit Faculty Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
        </DialogTitle>
        <DialogContent dividers>
          {/* In a real app, you would use a form component here */}
          <Box p={2}>
            <Typography variant="body1">
              {selectedFaculty 
                ? `Edit details for ${selectedFaculty.name}`
                : 'Fill in the details for the new faculty member'}
            </Typography>
            {/* Form would go here */}
            <Box mt={3}>
              <Typography variant="subtitle2" color="text.secondary">
                Faculty form implementation would go here
              </Typography>
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
                selectedFaculty 
                  ? 'Faculty member updated successfully' 
                  : 'Faculty member added successfully',
                { variant: 'success' }
              );
            }}
          >
            {selectedFaculty ? 'Update' : 'Add'} Faculty
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyList;
