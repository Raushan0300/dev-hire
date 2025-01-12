import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Star,
  MessageSquare,
  Video,
  Check,
  Globe,
  Mail,
  Github
} from 'lucide-react';
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useLocation } from "react-router-dom";

const PublicProfile = () => {
  const location = useLocation();

  const [developer, setDeveloper] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const reviews = [
    {
      id: 1,
      client: {
        name: "John Anderson",
        image: "/api/placeholder/100/100",
      },
      rating: 5,
      date: "2 weeks ago",
      comment: "Sarah was incredibly helpful in debugging our production issues. Her expertise in React performance optimization saved us countless hours. Looking forward to working with her again!",
    },
    {
      id: 2,
      client: {
        name: "Lisa Wong",
        image: "/api/placeholder/100/100",
      },
      rating: 5,
      date: "1 month ago",
      comment: "Outstanding technical knowledge and communication skills. Sarah helped us implement a complex authentication system and explained everything clearly throughout the process.",
    },
  ];

  useEffect(()=>{
    const query = new URLSearchParams(location.search);
    const developerEmail = query.get('email');

    const fetchProfile = async()=>{
      setIsLoading(true);
      try {
        const {data} = await axiosInstance.get(`/public/developer/${developerEmail}`);
        setDeveloper(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();

  },[]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="w-full bg-black py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <Avatar className="h-32 w-32">
              <AvatarImage src={developer?.image} />
              <AvatarFallback>{developer?.fullName?.split(' ')?.map((n:any) => n[0])?.join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">{developer?.fullName}</h1>
              <p className="text-lg text-gray-300 mt-2">{developer?.title}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-white font-semibold">{developer?.rating}</span>
                  <span className="text-gray-300 ml-1">({developer?.reviewCount} reviews)</span>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {(developer?.hourlyRate/10000).toFixed(3)} ETH/hr
                </Badge>
                <Badge variant="outline" className="text-white border-white">
                  <Globe className="h-4 w-4 mr-1" />
                  {developer?.timezone}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                <Button className="gap-2">
                  <Video className="h-4 w-4" />
                  Book a Call
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent text-white border-white hover:text-black">
                  <MessageSquare className="h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{developer?.bio}</p>
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {developer?.skills?.map((skill:any) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.client.image} />
                          <AvatarFallback>{review.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{review.client.name}</h3>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <p className="mt-2 text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="mb-4" variant="outline">
                  <Check className="h-4 w-4 mr-1" />
                  {developer?.availability}
                </Badge>
                <Calendar
                  mode="single"
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{developer?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span className="text-sm">{developer?.github}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Languages: {developer?.languages?.join(', ') || ''}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;