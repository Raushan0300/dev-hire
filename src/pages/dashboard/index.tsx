// src/pages/dashboard/index.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, Clock, Wallet, Search, Star, Phone, Users, History } from 'lucide-react';
import axiosInstance from "@/lib/axios";

interface ClientProfile {
  name: string;
  company?: string;
  totalSpent: number;
  completedCalls: number;
}

interface Developer {
  name: string;
  title: string;
  hourlyRate: number;
  availability: string;
  rating: number;
  image?: string;
}

interface Booking {
  developer: {
    name: string;
    image?: string;
    title: string;
  };
  startTime: Date;
  duration: number;
  status: string;
  amount: number;
}

export default function ClientDashboard() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [profileRes, developersRes, bookingsRes] = await Promise.all([
          axiosInstance.get<{ data: ClientProfile }>('/client/profile'),
          axiosInstance.get<{ data: Developer[] }>('/client/developers'),
          axiosInstance.get<{ data: Booking[] }>('/client/bookings')
        ]);

        setProfile(profileRes.data.data);
        setDevelopers(developersRes.data.data || []);
        setBookings(bookingsRes.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard data');
        setDevelopers([]);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const upcomingCalls = Array.isArray(bookings) 
    ? bookings.filter(booking => booking.status === 'pending' || booking.status === 'confirmed')
    : [];

  const completedCalls = Array.isArray(bookings) 
    ? bookings.filter(booking => booking.status === 'completed')
    : [];

  const EmptyState = ({ icon: Icon, title, description }: { 
    icon: any, 
    title: string, 
    description: string 
  }) => (
    <div className="text-center py-10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button>
        <Search className="h-4 w-4 mr-2" />
        Browse Developers
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.name}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <Wallet className="h-4 w-4" />
              {profile?.totalSpent.toFixed(3)} ETH Spent
            </Button>
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              Find Developers
            </Button>
          </div>
        </div>

        {/* Upcoming Calls Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Calls</CardTitle>
            <CardDescription>Your scheduled consultations</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingCalls.length > 0 ? (
              <div className="space-y-4">
                {upcomingCalls.map((call, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={call.developer.image} />
                        <AvatarFallback>{call.developer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{call.developer.name}</h3>
                        <p className="text-sm text-muted-foreground">{call.developer.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(call.startTime).toLocaleDateString()} at{' '}
                          {new Date(call.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <Clock className="h-4 w-4 ml-2" />
                          {call.duration} minutes
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2">
                        <Video className="h-4 w-4" />
                        Join Call
                      </Button>
                      <Button variant="outline" className="gap-2">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Calendar}
                title="No Upcoming Calls"
                description="You don't have any scheduled consultations yet."
              />
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Developers</TabsTrigger>
            <TabsTrigger value="history">Call History</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            {developers.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {developers.map((dev, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={dev.image} />
                          <AvatarFallback>{dev.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{dev.name}</h3>
                            <Badge variant={dev.availability === "Available" ? "default" : "secondary"}>
                              {dev.availability}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{dev.title}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="ml-1 text-sm">{dev.rating}</span>
                            </div>
                            <span className="font-semibold">{dev.hourlyRate} ETH/hr</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          className="w-full gap-2" 
                          disabled={dev.availability !== "Available"}
                        >
                          <Phone className="h-4 w-4" />
                          Book Now
                        </Button>
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent>
                  <EmptyState 
                    icon={Users}
                    title="No Developers Available"
                    description="There are currently no developers available. Please check back later."
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="pt-6">
                {completedCalls.length > 0 ? (
                  completedCalls.map((call, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={call.developer.image} />
                          <AvatarFallback>{call.developer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{call.developer.name}</h3>
                          <p className="text-sm text-muted-foreground">{call.developer.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(call.startTime).toLocaleDateString()}
                            <Clock className="h-4 w-4 ml-2" />
                            {call.duration} minutes
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Leave Review</Button>
                        <Button variant="outline">Book Again</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon={History}
                    title="No Call History"
                    description="You haven't had any calls yet. Book your first consultation!"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}