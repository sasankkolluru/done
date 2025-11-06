import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast-provider';
<<<<<<< HEAD
import { supabase } from '@/lib/supabase';
=======
import api from '@/lib/axios';
>>>>>>> 7dbaff3 (Resolve merge conflicts)

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
  const [message, setMessage] = useState('');
>>>>>>> 7dbaff3 (Resolve merge conflicts)
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
<<<<<<< HEAD
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      addToast('Password reset link sent to your email!', 'success');
      
      navigate('/login');
    } catch (error: any) {
      addToast(error.error_description || error.message, 'error');
=======
    setMessage('');
    
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        setMessage('Password reset link has been sent to your email.');
        addToast('Password reset link sent to your email!', 'success');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email. Please try again.';
      setMessage(errorMessage);
      addToast(errorMessage, 'error');
>>>>>>> 7dbaff3 (Resolve merge conflicts)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:underline"
            >
              Back to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
