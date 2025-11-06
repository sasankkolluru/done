import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  IconButton, 
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Today as TodayIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  ViewAgenda as ViewAgendaIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, isSameMonth } from 'date-fns';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Setup the localizer with date-fns
const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse: () => {},
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay: (date) => new Date(date).getDay(),
  locales,
});

// Mock data for events
const mockEvents = [
  {
    id: 1,
    title: 'Midterm Exam - CS101',
    start: new Date(2023, 10, 15, 9, 0), // month is 0-indexed
    end: new Date(2023, 10, 15, 11, 0),
    resource: {
      room: 'A-101',
      faculty: 'Dr. Smith',
      type: 'exam',
      status: 'scheduled'
    },
  },
  {
    id: 2,
    title: 'Midterm Exam - MATH201',
    start: new Date(2023, 10, 15, 14, 0),
    end: new Date(2023, 10, 15, 16, 0),
    resource: {
      room: 'B-205',
      faculty: 'Dr. Johnson',
      type: 'exam',
      status: 'scheduled'
    },
  },
  {
    id: 3,
    title: 'Faculty Meeting',
    start: new Date(2023, 10, 16, 10, 0),
    end: new Date(2023, 10, 16, 12, 0),
    resource: {
      room: 'Conference Room A',
      faculty: 'All Faculty',
      type: 'meeting',
      status: 'tentative'
    },
  },
  // Add more mock events as needed
];

const ScheduleCalendar = () => {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(Views.WEEK);
  const [events, setEvents] = useState(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    faculty: 'all'
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterMenuOpen = Boolean(anchorEl);

  // Filter events based on search term and filters
  useEffect(() => {
    let result = [...events];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(term) ||
        event.resource.faculty.toLowerCase().includes(term) ||
        event.resource.room.toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter(event => event.resource.type === filters.type);
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(event => event.resource.status === filters.status);
    }
    
    setFilteredEvents(result);
  }, [events, searchTerm, filters]);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleView = (newView) => {
    setView(newView);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleNext = () => {
    setCurrentDate(addDays(currentDate, view === Views.WEEK ? 7 : 1));
  };

  const handlePrevious = () => {
    setCurrentDate(addDays(currentDate, view === Views.WEEK ? -7 : -1));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    handleFilterClose();
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const getEventStyle = (event, start, end, isSelected) => {
    let backgroundColor = '';
    let borderColor = '';
    
    switch (event.resource.type) {
      case 'exam':
        backgroundColor = theme.palette.primary.light;
        borderColor = theme.palette.primary.dark;
        break;
      case 'meeting':
        backgroundColor = theme.palette.secondary.light;
        borderColor = theme.palette.secondary.dark;
        break;
      default:
        backgroundColor = theme.palette.grey[300];
        borderColor = theme.palette.grey[500];
    }
    
    if (event.resource.status === 'tentative') {
      backgroundColor = alpha(backgroundColor, 0.6);
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: theme.palette.getContrastText(backgroundColor),
        border: `1px solid ${borderColor}`,
        display: 'block',
        fontSize: '0.8rem',
        padding: '2px 5px',
      },
    };
  };

  const CustomToolbar = ({ label }) => {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2,
          gap: 1,
          p: 1,
          backgroundColor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleToday}
            startIcon={<TodayIcon />}
          >
            Today
          </Button>
          <IconButton size="small" onClick={handlePrevious}>
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton size="small" onClick={handleNext}>
            <NavigateNextIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ minWidth: 150, textAlign: 'center' }}>
            {label}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            size="small" 
            color={view === Views.MONTH ? 'primary' : 'default'}
            onClick={() => handleView(Views.MONTH)}
          >
            <ViewAgendaIcon />
          </IconButton>
          <IconButton 
            size="small" 
            color={view === Views.WEEK ? 'primary' : 'default'}
            onClick={() => handleView(Views.WEEK)}
          >
            <ViewWeekIcon />
          </IconButton>
          <IconButton 
            size="small" 
            color={view === Views.DAY ? 'primary' : 'default'}
            onClick={() => handleView(Views.DAY)}
          >
            <ViewDayIcon />
          </IconButton>
        </Box>
      </Box>
    );
  };

  const CustomEvent = ({ event }) => {
    return (
      <Box sx={{ p: 0.5 }}>
        <Typography variant="caption" component="div" sx={{ fontWeight: 'bold' }}>
          {event.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" component="div">
            {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <Chip 
            label={event.resource.room} 
            size="small" 
            sx={{ 
              height: 18, 
              '& .MuiChip-label': { px: 0.75 },
              fontSize: '0.6rem'
            }} 
          />
          {event.resource.status === 'tentative' && (
            <Chip 
              label="Tentative" 
              size="small" 
              color="warning"
              sx={{ 
                height: 18, 
                '& .MuiChip-label': { px: 0.75 },
                fontSize: '0.6rem'
              }} 
            />
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
      {/* Search and Filter Bar */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: 2, 
          mb: 2,
          alignItems: isMobile ? 'stretch' : 'center'
        }}
      >
        <TextField
          placeholder="Search events..."
          variant="outlined"
          size="small"
          fullWidth={isMobile}
          sx={{ 
            maxWidth: isMobile ? '100%' : 300,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper'
            }
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
          value={searchTerm}
          onChange={handleSearch}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
            endIcon={<MoreVertIcon />}
            onClick={handleFilterClick}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Filters
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={filterMenuOpen}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem dense>Filter by:</MenuItem>
            <MenuItem>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  label="Type"
                  size="small"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="exam">Exam</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
            <MenuItem>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                  size="small"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="tentative">Tentative</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
          </Menu>
          
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setIsEventModalOpen(true)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            New Event
          </Button>
        </Box>
      </Box>

      {/* Calendar */}
      <Paper 
        elevation={0} 
        sx={{ 
          height: 'calc(100% - 64px)', 
          p: 2, 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          date={currentDate}
          view={view}
          onView={handleView}
          onNavigate={handleNavigate}
          onSelectEvent={handleEventClick}
          components={{
            toolbar: CustomToolbar,
            event: CustomEvent,
          }}
          eventPropGetter={getEventStyle}
          popup
          selectable
          step={30}
          timeslots={2}
          defaultView={Views.WEEK}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          min={new Date(0, 0, 0, 8, 0, 0)} // 8:00 AM
          max={new Date(0, 0, 0, 20, 0, 0)} // 8:00 PM
          dayLayoutAlgorithm={'no-overlap'}
        />
      </Paper>

      {/* Event Details Modal */}
      <Dialog 
        open={isEventModalOpen} 
        onClose={handleCloseEventModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedEvent ? 'Event Details' : 'Create New Event'}
          <IconButton
            aria-label="close"
            onClick={handleCloseEventModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEvent ? (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedEvent.title}</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Time
                </Typography>
                <Typography variant="body1">
                  {format(selectedEvent.start, 'EEEE, MMMM d, yyyy')}
                </Typography>
                <Typography variant="body1">
                  {format(selectedEvent.start, 'h:mm a')} - {format(selectedEvent.end, 'h:mm a')}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Location
                </Typography>
                <Typography variant="body1">{selectedEvent.resource.room}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Faculty
                </Typography>
                <Typography variant="body1">{selectedEvent.resource.faculty}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Status
                </Typography>
                <Chip 
                  label={selectedEvent.resource.status} 
                  color={
                    selectedEvent.resource.status === 'scheduled' ? 'success' : 
                    selectedEvent.resource.status === 'tentative' ? 'warning' : 'error'
                  } 
                  size="small"
                />
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1">Create new event form will go here...</Typography>
              {/* Add form fields for creating a new event */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedEvent && (
            <Button onClick={handleCloseEventModal} color="primary">
              Close
            </Button>
          )}
          <Button onClick={handleCloseEventModal} color="primary" variant="contained">
            {selectedEvent ? 'Edit' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleCalendar;
