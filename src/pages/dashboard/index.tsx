import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, Clock, Wallet, Search, Star, Phone } from 'lucide-react';

export default function ClientDashboard() {
  // Mock data
  const upcomingCalls = [
    {
      dev: {
        name: "Sarah Chen",
        image: "/api/placeholder/100/100",
        specialty: "Full Stack Developer"
      },
      date: "Today",
      time: "2:00 PM",
      duration: "1 hour",
      status: "upcoming"
    }
  ];

  const availableDevelopers = [
    {
      name: "Alex Kumar",
      specialty: "Blockchain Expert",
      rate: "0.02 ETH/hr",
      status: "Available",
      rating: 4.8,
      image: "/api/placeholder/100/100"
    },
    {
      name: "Emma Wilson",
      specialty: "Frontend Specialist",
      rate: "0.012 ETH/hr",
      status: "In Call",
      rating: 4.9,
      image: "/api/placeholder/100/100"
    }
  ];

  const recentCalls = [
    {
      dev: {
        name: "David Park",
        image: "/api/placeholder/100/100",
        specialty: "Backend Developer"
      },
      date: "Yesterday",
      duration: "45 minutes",
      status: "completed"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your consultations and find developers</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <Wallet className="h-4 w-4" />
              0.5 ETH Balance
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
            {upcomingCalls.map((call, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={call.dev.image} />
                    <AvatarFallback>{call.dev.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{call.dev.name}</h3>
                    <p className="text-sm text-muted-foreground">{call.dev.specialty}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      {call.date} at {call.time}
                      <Clock className="h-4 w-4 ml-2" />
                      {call.duration}
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
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Developers</TabsTrigger>
            <TabsTrigger value="history">Call History</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div className="grid md:grid-cols-2 gap-4">
              {availableDevelopers.map((dev, index) => (
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
                          <Badge variant={dev.status === "Available" ? "default" : "secondary"}>
                            {dev.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{dev.specialty}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm">{dev.rating}</span>
                          </div>
                          <span className="font-semibold">{dev.rate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="w-full gap-2" disabled={dev.status !== "Available"}>
                        <Phone className="h-4 w-4" />
                        Book Now
                      </Button>
                      <Button variant="outline" className="w-full">View Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="pt-6">
                {recentCalls.map((call, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={call.dev.image} />
                        <AvatarFallback>{call.dev.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{call.dev.name}</h3>
                        <p className="text-sm text-muted-foreground">{call.dev.specialty}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4" />
                          {call.date}
                          <Clock className="h-4 w-4 ml-2" />
                          {call.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Leave Review</Button>
                      <Button variant="outline">Book Again</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}