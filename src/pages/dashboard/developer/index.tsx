import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Video, Clock, Wallet, Calendar as CalendarIcon, 
  Settings, Star, MessageSquare
} from 'lucide-react';
import EditProfileDialog from '@/components/EditProfileDialog';
import axiosInstance from "@/lib/axios";

export default function DeveloperDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [date, setDate] = useState<Date>(new Date());

  // Mock data
  const upcomingCalls = [
    {
      client: {
        name: "John Anderson",
        image: "/api/placeholder/100/100"
      },
      date: "Today",
      time: "2:00 PM",
      duration: "1 hour",
      amount: "0.015 ETH"
    },
    {
      client: {
        name: "Lisa Wong",
        image: "/api/placeholder/100/100"
      },
      date: "Tomorrow",
      time: "10:00 AM",
      duration: "2 hours",
      amount: "0.03 ETH"
    }
  ];

  const recentEarnings = [
    {
      client: {
        name: "Michael Brown",
        image: "/api/placeholder/100/100"
      },
      date: "Yesterday",
      duration: "1 hour",
      amount: "0.015 ETH",
      rating: 5
    }
  ];

  const handleAvailability = async(availability: string)=>{
    setIsOnline(!isOnline);
    const endpoint = '/developer/availability';
    const payload = {
      availability: availability,
    };

    const response = await axiosInstance.post(endpoint, payload);
    const {message} = response.data;
    console.log(message);
  } 

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Developer Dashboard</h1>
            <p className="text-muted-foreground">Manage your consultations and availability</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Status:</span>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isOnline}
                  onCheckedChange={()=>{handleAvailability(isOnline ? "Offline" : "Online")}}
                />
                <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Wallet className="h-4 w-4" />
              1.25 ETH Earned
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Consultations</CardTitle>
                <CardDescription>Your scheduled calls for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingCalls.map((call, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={call.client.image} />
                          <AvatarFallback>{call.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{call.client.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <CalendarIcon className="h-4 w-4" />
                            {call.date} at {call.time}
                            <Clock className="h-4 w-4 ml-2" />
                            {call.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{call.amount}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Message
                          </Button>
                          <Button className="gap-2">
                            <Video className="h-4 w-4" />
                            Join Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="availability" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
              </TabsList>

              <TabsContent value="availability" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Set Your Availability</CardTitle>
                    <CardDescription>Mark your available time slots</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      className="rounded-md border"
                    />
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
                        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                        <Button key={time} variant="outline" className="w-full">
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="earnings">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Earnings</CardTitle>
                    <CardDescription>Your completed consultations and earnings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentEarnings.map((earning, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={earning.client.image} />
                            <AvatarFallback>{earning.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{earning.client.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <CalendarIcon className="h-4 w-4" />
                              {earning.date}
                              <Clock className="h-4 w-4 ml-2" />
                              {earning.duration}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1">{earning.rating}</span>
                          </div>
                          <span className="font-semibold">{earning.amount}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src="/api/placeholder/100/100" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">Sarah Chen</h2>
                  <p className="text-sm text-muted-foreground">Full Stack Developer</p>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 font-semibold">4.9</span>
                    <span className="text-sm text-muted-foreground ml-1">(127 reviews)</span>
                  </div>
                  <div className="mt-4">
                    <Badge>0.015 ETH/hr</Badge>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <EditProfileDialog profile={
                    {
                      name: 'Sarah Chen',
                      title: 'Full Stack Developer',
                      hourlyRate: '0.015',
                      bio: 'Experienced full stack developer specializing in React and Node.js',
                      skills: 'React, Node.js, TypeScript',
                      image: '/api/placeholder/100/100',
                      timezone: 'UTC-8'
                    }
                  } onSave={
                    (data) => console.log(data)
                  } />
                  <Button variant="outline" className="w-full">
                    View Public Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Earnings</span>
                    <span className="font-semibold">1.25 ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Completed Calls</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Hours Consulted</span>
                    <span className="font-semibold">36</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Response Rate</span>
                    <span className="font-semibold">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}