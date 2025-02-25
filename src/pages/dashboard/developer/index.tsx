import { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

// Add these interfaces at the top
interface TimeSlot {
  date: Date;
  time: string[];
}

interface Unavailability {
  timeSlots: TimeSlot[];
}

export default function DeveloperDashboard() {
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(true);
  // const [date, setDate] = useState<Date>(new Date());
  const [developerProfile, setDeveloperProfile] = useState<any | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [unavailability, setUnavailability] = useState<Unavailability | null>(null);

  // const [selectedTime, setSelectedTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const generateTimeSlots = (selectedDate: Date | undefined) => {
    const slots = [];
    const now = new Date();
    const isToday = selectedDate?.toDateString() === now.toDateString();

    let startHour = isToday ? now.getHours() + 1 : 0;
    const endHour = 23;

    for (let hour = startHour; hour <= endHour; hour++) {
      const time = new Date(selectedDate || now);
      time.setHours(hour, 0, 0, 0);
      slots.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    }

    return slots;
  };

  // const timeSlots = generateTimeSlots(selectedDate);

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

  useEffect(() => {
    const fetchUnavailability = async () => {
      try {
        const response = await axiosInstance.get('/developer/unavailability');
        setUnavailability(response.data.unavailability);
      } catch (error) {
        console.error('Error fetching unavailability:', error);
      }
    };

    fetchUnavailability();
  }, []);

useEffect(()=>{
  const showProfile = async()=>{  
    setIsLoading(true);
    const endpoint = '/developer/profile';
    const response = await axiosInstance.get(endpoint);
    const developerProfile = response.data;
    setIsOnline(developerProfile.availability === "Online");
    setDeveloperProfile(developerProfile);

    // Unavailibity

    setIsLoading(false);
  }
  showProfile();
},[]);

const handleSelectTimes = (time: string) => {
  // setSelectedTime(time);
  if (selectedTimes.includes(time)) {
    setSelectedTimes(selectedTimes.filter((t) => t !== time));
  } else {
    setSelectedTimes([...selectedTimes, time]);
  }
};

  const handleAvailability = async(availability: string)=>{
    setIsOnline(!isOnline);
    const endpoint = '/developer/availability';
    const payload = {
      availability: availability,
    };

    await axiosInstance.post(endpoint, payload);
  };


  const handleSetUnavailability = async () => {
    try {
      const payload = {
        date: selectedDate,
        times: selectedTimes.filter(time => time !== ""),
      };

      const response = await axiosInstance.post('/developer/set-unavailability', payload);
      
      if (response.data.unavailability) {
        setUnavailability(response.data.unavailability);
      }

      // Clear selection after successful update
      setSelectedTimes([]);
    } catch (error) {
      console.error('Error setting unavailability:', error);
    }
  };

  const isTimeSlotUnavailable = (time: string) => {
    if (!unavailability) return false;

    const todaySlot = unavailability.timeSlots.find(
      slot => new Date(slot.date).toDateString() === selectedDate.toDateString()
    );

    return todaySlot?.time.includes(time) || false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
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
              {developerProfile?.totalEarnings} ETH Earned
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
          <CardTitle>Set Your Unavailability</CardTitle>
          <CardDescription>Mark your unavailable time slots</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
          <div className="mt-4 grid grid-cols-4 gap-2">
            {generateTimeSlots(selectedDate).map((time) => (
              <Button 
                key={time} 
                variant="outline"
                className={`
                  ${selectedTimes.includes(time) ? 'bg-red-500 text-white hover:bg-red-600' : ''}
                  ${isTimeSlotUnavailable(time) ? 'bg-gray-200 cursor-not-allowed' : ''}
                `}
                onClick={() => handleSelectTimes(time)}
                disabled={isTimeSlotUnavailable(time)}
              >
                {time}
              </Button>
            ))}
          </div>
          <Button 
            className="mt-4 w-full" 
            onClick={handleSetUnavailability}
            disabled={selectedTimes.length === 0}
          >
            Save Unavailability
          </Button>
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
                    <AvatarFallback> {developerProfile?.fullName
      ? `${developerProfile.fullName.split(' ')[0][0]}${developerProfile.fullName.split(' ')[1][0]}`
      : ''}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{developerProfile?.fullName}</h2>
                  <p className="text-sm text-muted-foreground">{developerProfile?.title}</p>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 font-semibold">{developerProfile?.rating}</span>
                    <span className="text-sm text-muted-foreground ml-1">({developerProfile?.reviewCount})</span>
                  </div>
                  <div className="mt-4">
                    <Badge>{(developerProfile?.hourlyRate/10000).toFixed(3)} ETH/hr</Badge>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  {developerProfile && <EditProfileDialog profile={
                    {
                      fullName: `${developerProfile?.fullName}`,
                      title: `${developerProfile?.title}`,
                      hourlyRate: `${developerProfile?.hourlyRate/10000}`,
                      bio: `${developerProfile?.bio || ''}`,
                      skills: `${developerProfile?.skills.join(', ')}`,
                      image: `${developerProfile?.image}`,
                      timezone: `${developerProfile?.timezone}`,
                    }
                  } />}
                  <Button variant="outline" className="w-full" onClick={()=>navigate(`/dashboard/developer/profile?email=${developerProfile?.email}`)}>
                    View Public Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}