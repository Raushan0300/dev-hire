import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Clock, Calendar as CalendarIcon, Wallet, ChevronLeft, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [duration, setDuration] = useState("1");

  // Mock developer data
  const developer = {
    name: "Sarah Chen",
    specialty: "Full Stack Developer",
    rate: "0.015",
    rating: 4.9,
    reviews: 127,
    image: "/api/placeholder/100/100",
    timezone: "UTC-7 (PDT)"
  };

  // Available time slots
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  // Calculate total cost
  const totalCost = parseFloat(developer.rate) * parseInt(duration);

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
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
                
                <div className="space-y-4">
                  <Label>Available Time Slots</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        className="w-full"
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
                    <AvatarFallback>{developer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{developer.name}</h3>
                    <p className="text-sm text-muted-foreground">{developer.specialty}</p>
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
                  <span>{date?.toLocaleDateString()}</span>
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
                  <span>{developer.rate} ETH/hr</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Cost</span>
                  <span>{totalCost.toFixed(3)} ETH</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Confirm Booking
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}