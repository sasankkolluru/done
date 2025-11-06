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
  Button,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  FileDownload as FileDownloadIcon,
  Email as EmailIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Sort as SortIcon,
  Person as PersonIcon,
  Event as EventIcon,
  MeetingRoom as RoomIcon,
  CalendarToday as CalendarIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

// Mock data for allocation summary
const mockAllocations = [
  {
    id: 1,
    examName: 'Midterm - CS101',
    date: '2023-11-15',
    timeSlot: '09:00 AM - 12:00 PM',
    room: 'A-101',
    faculty: 'Dr. Smith',
    status: 'confirmed',
    lastUpdated: '2023-11-10T14:30:00Z'
  },
  {
    id: 2,
    examName: 'Midterm - MATH201',
    date: '2023-11-15',
    timeSlot: '02:00 PM - 05:00 PM',
    room: 'B-205',
    faculty: 'Dr. Johnson',
    status: 'confirmed',
    lastUpdated: '2023-11-10T15:45:00Z'
  },
  {
    id: 3,
    examName: 'Quiz - PHYS101',
    date: '2023-11-16',
    timeSlot: '10:00 AM - 11:30 AM',
    room: 'C-102',
    faculty: 'Dr. Williams',
    status: 'pending',
    lastUpdated: '2023-11-11T09:15:00Z'
  },
  {
    id: 4,
    examName: 'Final - CHEM201',
    date: '2023-11-17',
    timeSlot: '09:00 AM - 12:00 PM',
    room: 'D-301',
    faculty: 'Dr. Brown',
    status: 'confirmed',
    lastUpdated: '2023-11-11T11:20:00Z'
  },
  {
    id: 5,
    examName: 'Midterm - ENG101',
    date: '2023-11-18',
    timeSlot: '02:00 PM - 05:00 PM',
    room: 'E-105',
    faculty: 'Dr. Davis',
    status: 'conflict',
    lastUpdated: '2023-11-12T16:10:00Z'
  },
];

const statusColors = {
  confirmed: 'success',
  pending: 'warning',
  conflict: 'error',
  draft: 'info'
};

const AllocationSummary = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(mockAllocations);
  const [filters, setFilters] = useState({
    status: [],
    date: '',
    faculty: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort data
  useEffect(() => {
    let result = [...mockAllocations];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.examName.toLowerCase().includes(term) ||
        item.faculty.toLowerCase().includes(term) ||
        item.room.toLowerCase().includes(term) ||
        item.date.includes(term) ||
        item.timeSlot.toLowerCase().includes(term)
      );
    }
    
    // Apply filters
    if (filters.status.length > 0) {
      result = result.filter(item => filters.status.includes(item.status));
    }
    
    if (filters.date) {
      result = result.filter(item => item.date === filters.date);
    }
    
    if (filters.faculty) {
      result = result.filter(item => item.faculty === filters.faculty);
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
  }, [searchTerm, filters, sortConfig]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleStatusFilterChange = (event) => {
    const value = event.target.value;
    setFilters({
      ...filters,
      status: typeof value === 'string' ? value.split(',') : value,
    });
    setPage(0);
  };

  const handleDateFilterChange = (event) => {
    setFilters({
      ...filters,
      date: event.target.value
    });
    setPage(0);
  };

  const handleFacultyFilterChange = (event) => {
    setFilters({
      ...filters,
      faculty: event.target.value
    });
    setPage(0);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredData.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting selected:', selected);
  };

  const handleNotify = () => {
    // Notification functionality
    console.log('Notifying selected:', selected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'pending':
        return <WarningIcon color="warning" fontSize="small" />;
      case 'conflict':
        return <ErrorIcon color="error" fontSize="small" />;
      default:
        return <InfoIcon color="info" fontSize="small" />;
    }
  };

  // Get unique dates for filter
  const uniqueDates = [...new Set(mockAllocations.map(item => item.date))];
  const uniqueFaculties = [...new Set(mockAllocations.map(item => item.faculty))];

  return (
    <Box>
      {/* Header and Actions */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center',
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h6" component="div">
          Invigilation Allocations
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={selected.length === 0}
          >
            Export
          </Button>
          
          <Button
            variant="contained"
            startIcon={<EmailIcon />}
            onClick={handleNotify}
            disabled={selected.length === 0}
          >
            Notify
          </Button>
        </Box>
      </Box>

      {/* Search and Filter Bar */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        gap: 2, 
        mb: 3,
        alignItems: isMobile ? 'stretch' : 'center'
      }}>
        <TextField
          placeholder="Search allocations..."
          variant="outlined"
          size="small"
          fullWidth={isMobile}
          sx={{ 
            maxWidth: isMobile ? '100%' : 400,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={handleSearch}
        />
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={filters.status}
              onChange={handleStatusFilterChange}
              inputProps={{ 'aria-label': 'Status filter' }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.length === 0 ? 'All Statuses' : `${selected.length} selected`}
                </Box>
              )}
            >
              {Object.entries(statusColors).map(([status, color]) => (
                <MenuItem key={status} value={status}>
                  <Checkbox checked={filters.status.indexOf(status) > -1} />
                  <ListItemText primary={status.charAt(0).toUpperCase() + status.slice(1)} />
                  <Box component="span" sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: `${color}.main`,
                    ml: 1
                  }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Date</InputLabel>
            <Select
              value={filters.date}
              onChange={handleDateFilterChange}
              label="Date"
              displayEmpty
            >
              <MenuItem value="">
                <em>All Dates</em>
              </MenuItem>
              {uniqueDates.map((date) => (
                <MenuItem key={date} value={date}>
                  {format(parseISO(date), 'MMM d, yyyy')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Faculty</InputLabel>
            <Select
              value={filters.faculty}
              onChange={handleFacultyFilterChange}
              label="Faculty"
              displayEmpty
            >
              <MenuItem value="">
                <em>All Faculty</em>
              </MenuItem>
              {uniqueFaculties.map((faculty) => (
                <MenuItem key={faculty} value={faculty}>
                  {faculty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setIsFilterOpen(true)}
          >
            More Filters
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Allocations
                  </Typography>
                  <Typography variant="h4">{filteredData.length}</Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: '50%' }}>
                  <EventIcon color="primary" />
                </Box>
              </Box>
              <Box sx={{ pt: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  <Box component="span" sx={{ color: 'success.main', display: 'inline-flex', alignItems: 'center' }}>
                    <ArrowUpwardIcon fontSize="small" /> 12%
                  </Box>{' '}
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Confirmed
                  </Typography>
                  <Typography variant="h4">
                    {filteredData.filter(item => item.status === 'confirmed').length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'success.light', borderRadius: '50%' }}>
                  <CheckCircleIcon color="success" />
                </Box>
              </Box>
              <Box sx={{ pt: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  {Math.round((filteredData.filter(item => item.status === 'confirmed').length / Math.max(1, filteredData.length)) * 100)}% of total
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Pending
                  </Typography>
                  <Typography variant="h4">
                    {filteredData.filter(item => item.status === 'pending').length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'warning.light', borderRadius: '50%' }}>
                  <WarningIcon color="warning" />
                </Box>
              </Box>
              <Box sx={{ pt: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Needs attention
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Conflicts
                  </Typography>
                  <Typography variant="h4">
                    {filteredData.filter(item => item.status === 'conflict').length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'error.light', borderRadius: '50%' }}>
                  <ErrorIcon color="error" />
                </Box>
              </Box>
              <Box sx={{ pt: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Immediate action required
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loading Indicator */}
      {isLoading && <LinearProgress />}

      {/* Allocations Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="allocations table" size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredData.length}
                    checked={filteredData.length > 0 && selected.length === filteredData.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all allocations' }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Exam Name
                    <IconButton size="small" onClick={() => handleSort('examName')}>
                      <SortIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Date
                    <IconButton size="small" onClick={() => handleSort('date')}>
                      <SortIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>Time Slot</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Faculty
                    <IconButton size="small" onClick={() => handleSort('faculty')}>
                      <SortIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${row.id}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        onClick={(event) => handleClick(event, row.id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          {row.examName}
                        </TableCell>
                        <TableCell>{format(parseISO(row.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{row.timeSlot}</TableCell>
                        <TableCell>
                          <Chip 
                            icon={<RoomIcon fontSize="small" />} 
                            label={row.room} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="action" fontSize="small" />
                            {row.faculty}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getStatusIcon(row.status)}
                            label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                            color={statusColors[row.status] || 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={format(parseISO(row.lastUpdated), 'PPpp')}>
                            <span>{format(parseISO(row.lastUpdated), 'MMM d, h:mm a')}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <InfoIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="subtitle1" color="textSecondary">
                        No allocations found
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Try adjusting your search or filter criteria
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* More Filters Dialog */}
      <Dialog open={isFilterOpen} onClose={() => setIsFilterOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Advanced Filters</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormGroup>
              <FormControlLabel 
                control={<Checkbox />} 
                label="Show only my allocations" 
              />
              <FormControlLabel 
                control={<Checkbox />} 
                label="Show past allocations" 
              />
              <FormControlLabel 
                control={<Checkbox defaultChecked />} 
                label="Show upcoming allocations" 
              />
            </FormGroup>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Room Type
              </Typography>
              <FormGroup row>
                <FormControlLabel control={<Checkbox />} label="Lecture Halls" />
                <FormControlLabel control={<Checkbox />} label="Labs" />
                <FormControlLabel control={<Checkbox />} label="Seminar Rooms" />
              </FormGroup>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Notification Status
              </Typography>
              <FormGroup>
                <FormControlLabel 
                  control={<Switch />} 
                  label="Show only unread notifications" 
                />
              </FormGroup>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFilterOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setIsFilterOpen(false);
              // Apply filters here
            }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllocationSummary;
