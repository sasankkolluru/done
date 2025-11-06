import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/toast-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
<<<<<<< HEAD
import { supabase } from '@/lib/supabase';
=======
import { userAPI } from '@/services/api';
>>>>>>> 7dbaff3 (Resolve merge conflicts)

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    notifications: true,
    dark_mode: false,
  });
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
=======
      const response = await userAPI.getMe();
      
      if (!response.data) {
>>>>>>> 7dbaff3 (Resolve merge conflicts)
        navigate('/login');
        return;
      }

<<<<<<< HEAD
      // Fetch additional profile data if needed
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile({
        full_name: profileData?.full_name || user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: profileData?.phone || '',
        notifications: profileData?.notifications ?? true,
        dark_mode: profileData?.dark_mode ?? false,
=======
      const userData = response.data;
      setProfile({
        full_name: userData.full_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        notifications: userData.notifications ?? true,
        dark_mode: userData.dark_mode ?? false,
>>>>>>> 7dbaff3 (Resolve merge conflicts)
      });
    } catch (error: any) {
      addToast(error.message || 'Error loading profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

<<<<<<< HEAD
=======
  const handleToggle = (name: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      [name]: checked
    }));
  };

>>>>>>> 7dbaff3 (Resolve merge conflicts)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
<<<<<<< HEAD
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Update profile in the profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          phone: profile.phone,
          notifications: profile.notifications,
          dark_mode: profile.dark_mode,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update email in auth if changed
      if (user.email !== profile.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profile.email,
        });
        if (emailError) throw emailError;
      }

      addToast('Settings saved successfully!', 'success');
=======
      
      // Update user profile using the API service
      const response = await userAPI.updateMe({
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        notifications: profile.notifications,
        dark_mode: profile.dark_mode
      });

      if (response.data) {
        addToast('Profile updated successfully', 'success');
      }
>>>>>>> 7dbaff3 (Resolve merge conflicts)
    } catch (error: any) {
      addToast(error.message || 'Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

<<<<<<< HEAD
=======
  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await userAPI.changePassword({
        currentPassword,
        newPassword
      });
      
      if (response.data) {
        addToast('Password updated successfully', 'success');
        return true;
      }
      return false;
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Error updating password', 'error');
      return false;
    }
  };

>>>>>>> 7dbaff3 (Resolve merge conflicts)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive email notifications for important updates
                </p>
              </div>
              <Switch
                id="notifications"
                checked={profile.notifications}
                onCheckedChange={(checked) => 
                  setProfile(prev => ({ ...prev, notifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark_mode">Dark Mode</Label>
                <p className="text-sm text-gray-500">
                  Toggle between light and dark theme
                </p>
              </div>
              <Switch
                id="dark_mode"
                checked={profile.dark_mode}
                onCheckedChange={(checked) => 
                  setProfile(prev => ({ ...prev, dark_mode: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
