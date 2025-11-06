import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Link as MuiLink,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  LockOutlined as LockIcon, 
  EmailOutlined as EmailIcon, 
  Visibility, 
  VisibilityOff,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError('');
        await signIn(values.email, values.password);
        // The actual navigation will be handled by the AuthProvider after successful login
      } catch (error) {
        console.error('Login error:', error);
        setError(error.message || 'Failed to sign in. Please check your credentials.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth with your backend
    console.log('Google login');
  };

  const handleGitHubLogin = () => {
    // TODO: Implement GitHub OAuth with your backend
    console.log('GitHub login');
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook OAuth with your backend
    console.log('Facebook login');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" mb={3}>
            Sign in
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                    name="rememberMe"
                  />
                }
                label="Remember me"
              />
              <MuiLink component={Link} to="/forgot-password" variant="body2">
                Forgot password?
              </MuiLink>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <Divider sx={{ my: 3 }}>OR</Divider>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
              <IconButton onClick={handleGoogleLogin} color="primary">
                <GoogleIcon />
              </IconButton>
              <IconButton onClick={handleGitHubLogin} color="inherit">
                <GitHubIcon />
              </IconButton>
              <IconButton onClick={handleFacebookLogin} color="primary">
                <FacebookIcon />
              </IconButton>
            </Box>
            
            <Box textAlign="center" mt={2}>
              <MuiLink component={Link} to="/register" variant="body2">
                Don't have an account? Sign Up
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
