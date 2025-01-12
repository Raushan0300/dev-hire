import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Clock, Calendar as CalendarIcon, Wallet, ChevronLeft, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { ethers } from 'ethers';
import BookingContract from '@/lib/DevHireBooking.json';
import { useNavigate } from 'react-router-dom';

interface TimeSlot {
  date: Date;
  time: string[];
}

interface Unavailability {
  timeSlots: TimeSlot[];
}

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // const [date, setDate] = useState<Date | undefined>(new Date());
  const [duration, setDuration] = useState("1");
  // const [selectedTime, setSelectedTime] = useState("");

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [unavailability, setUnavailability] = useState<Unavailability | null>(null);

    const [isBooking, setIsBooking] = useState(false);
    const [notes, setNotes] = useState('');

  const developer = location.state as any;

  // Available time slots
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

  const timeSlots = generateTimeSlots(selectedDate);

  useEffect(() => {
    const fetchUnavailability = async () => {
      try {
        const response = await axiosInstance.get('/developer/unavailability?email=' + developer.email);
        setUnavailability(response.data.unavailability);
      } catch (error) {
        console.error('Error fetching unavailability:', error);
      }
    };

    fetchUnavailability();
  }, [developer]);

  // Calculate total cost
  const totalCost = parseFloat(developer.hourlyRate)/10000 * parseInt(duration);

// start

  const handleBooking = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to make bookings');
      return;
    }

    if (!selectedDate || !selectedTime || !duration) {
      alert('Please select date, time and duration');
      return;
    }

    if (!developer?.walletAddress) {
      alert('Developer wallet address is not available');
      return;
    }

    try {
      setIsBooking(true);

      // Connect to MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(
        import.meta.env.VITE_PUBLIC_BOOKING_CONTRACT_ADDRESS!,
        BookingContract.abi,
        signer
      );

      // Generate booking ID
      const startTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const bookingId = ethers.utils.id(
        `${developer.walletAddress}-${startTime.getTime()}-${Math.random()}`
      );

      // Send transaction
      const tx = await contract.createBooking(
        bookingId,
        developer.walletAddress,
        {
          value: ethers.utils.parseEther(totalCost.toString())
        }
      );

      // Wait for transaction confirmation
      await tx.wait();

      // Create booking in backend
      const response = await axiosInstance.post('/booking/create', {
        developerEmail: developer.email,
        startTime: startTime.toISOString(),
        duration: parseInt(duration) * 60, // Convert to minutes
        amount: totalCost,
        transactionHash: tx.hash,
        notes
      });
      console.log('Booking created:', response.data);

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(error.message || 'Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

  // ... existing render code




// emd

  const isTimeSlotUnavailable = (time: string) => {
    if (!unavailability) return false;

    const todaySlot = unavailability.timeSlots.find(
      slot => new Date(slot.date).toDateString() === selectedDate.toDateString()
    );

    return todaySlot?.time.includes(time) || false;
  };

  const handleSelectedTime = (time: string) => {
    setSelectedTime(time === selectedTime ? "" : time);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Button variant="ghost" className="mb-6 gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Developers
        </Button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
                <CardDescription>Choose your preferred consultation time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
                  // onSelect={}
                  className="rounded-md border"
                  disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
                
                <div className="space-y-4">
                  <Label>Available Time Slots</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                      key={time}
                      variant="outline"
                      className={`
                        ${time === selectedTime ? 'bg-black text-white hover:bg-gray-600' : ''}
                        ${isTimeSlotUnavailable(time) ? 'bg-gray-200 cursor-not-allowed' : ''}
                      `}
                      onClick={() => handleSelectedTime(time)}
                      disabled={isTimeSlotUnavailable(time)}
                    >
                      {time}
                    </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Meeting Details</Label>
                  <Input 
      placeholder="What would you like to discuss?"
      className="h-24"
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
    />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Developer Info & Summary */}
          <div className="space-y-6">
            {/* Developer Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={developer.image} />
                    <AvatarFallback>{developer.name.split(' ').map((n:any) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{developer.name}</h3>
                    <p className="text-sm text-muted-foreground">{developer.title}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 font-semibold">{developer.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({developer.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message Developer
                </Button>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Date</span>
                  </div>
                  <span>{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Duration</span>
                  </div>
                  <span>{duration} hour{parseInt(duration) > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Rate</span>
                  </div>
                  <span>{developer.hourlyRate/10000} ETH/hr</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Cost</span>
                  <span>{totalCost.toFixed(3)} ETH</span>
                </div>
              </CardContent>
              <CardFooter>
              <Button 
      className="w-full" 
      onClick={handleBooking}
      disabled={isBooking || !selectedDate || !selectedTime}
    >
      {isBooking ? 'Processing...' : 'Confirm Booking'}
    </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}