import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/google`;

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, login, register, logout, updatePhoneNumber } = useAuth();
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        await register({
          email,
          password,
          firstName,
          lastName,
          phoneNumber,
        });
        toast({
          title: "Success",
          description: "Account created successfully",
        });
      }
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Error",
        description: axiosError.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate("/");
  };

  const handleGoogleSignIn = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  useEffect(() => {
    if (window.location.search.includes('google')) {
      window.location.href = window.location.pathname;
    }
  }, []);

  useEffect(() => {
    if (user && !user.phoneNumber) {
      setShowPhonePrompt(true);
    } else {
      setShowPhonePrompt(false);
    }
  }, [user]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneLoading(true);
    try {
      await updatePhoneNumber(phoneInput);
      setShowPhonePrompt(false);
      toast({ title: "Success", description: "Phone number added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update phone number", variant: "destructive" });
    } finally {
      setPhoneLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">My Account</CardTitle>
                <CardDescription>View and manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {user.avatar && (
                    <div className="flex flex-col items-center">
                      <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full mb-2" />
                      <Label className="text-sm font-medium text-muted-foreground">Profile Picture</Label>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                    <p className="text-lg">{user.firstName} {user.lastName}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                    <p className="text-lg">{user.phoneNumber || 'Not provided'}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Account Type</Label>
                    <p className="text-lg">{user.isAdmin ? "Administrator" : "Customer"}</p>
                  </div>
                  
                </div>
                <div className="flex justify-end space-x-4">
                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (user && showPhonePrompt) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>To continue, please provide your phone number.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={phoneLoading || !phoneInput}>
                  {phoneLoading ? "Saving..." : "Save"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {isLogin ? "Welcome back" : "Create an account"}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Fill in your details to create a new account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={isLogin ? "login" : "register"}
                onValueChange={(value) => setIsLogin(value === "login")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing in..." : "Sign in"}
                    </Button>
                  </form>
                  <div className="mt-4 flex flex-col items-center">
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                      Continue with Google
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="register">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating account..." : "Create account"}
                    </Button>
                  </form>
                  <div className="mt-4 flex flex-col items-center">
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                      Continue with Google
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
