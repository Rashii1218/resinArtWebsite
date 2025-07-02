import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Verify if the current user matches the URL id
      if (parsedUser._id === id) {
        setUser(parsedUser);
      } else {
        // If not authorized, redirect to login
        navigate('/account');
        toast({
          title: "Access Denied ❌",
          description: "Please login to view this profile",
          variant: "destructive",
        });
      }
    } else {
      // If no user data, redirect to login
      navigate('/account');
      toast({
        title: "Please Login",
        description: "You need to login to view your profile",
        variant: "warning",
      });
    }
  }, [id, navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Goodbye! 👋",
      description: "You have been logged out successfully",
      variant: "warning",
    });
    navigate('/account');
  };

  // If no user data, don't render anything (will be redirected by useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
            <p className="text-muted-foreground">Manage your account information</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">First Name</h3>
                  <p className="text-lg">{user.firstName}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Last Name</h3>
                  <p className="text-lg">{user.lastName}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Email</h3>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Phone Number</h3>
                <p className="text-lg">{user.phoneNumber}</p>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile; 