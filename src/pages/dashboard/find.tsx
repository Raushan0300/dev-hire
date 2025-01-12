import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios.ts';
import { Search, Sliders, Star, Clock, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Developer {
  image: string;
  fullName: string;
  availability: string;
  title: string;
  rating: number;
  hourlyRate: number;
  skills: string[];
}

const FindDeveloper = () => {
  const [priceRange, setPriceRange] = useState([0, 2]);
  const [expertise, setExpertise] = useState('');
  const [developers, setDevelopers] = useState<Developer[]>([]);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await axiosInstance.get('/developers/find-developer', {
          params: {
            hourlyRate: `${priceRange[0]}-${priceRange[1]}`,
            expertise,
          },
        });
        console.log('Response data:', response.data); // Debugging line
        setDevelopers(response.data);
      } catch (error) {
        console.error('Error fetching developers:', error);
      }
    };

    fetchDevelopers();
  }, [priceRange, expertise]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-black">Find a Developer</h1>
          <p className="text-gray-600">Connect with expert developers for your project needs</p>
        </div>

        {/* Search and Filter Section */}
        <Card className="bg-white border-black/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="Search by name, skills, or expertise..."
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select onValueChange={setExpertise}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Sliders className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Price Range (ETH/hr)</h3>
              <div className="flex items-center gap-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2}
                  step={0.1}
                  className="w-[200px]"
                />
                <span className="text-sm text-gray-600">From {priceRange[0]} to {priceRange[1]} ETH</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developers Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {developers.map((dev, index) => (
            <Card key={index} className="bg-white border-black/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={dev.image} />
                    <AvatarFallback>{dev.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-black">{dev.fullName}</h3>
                      <Badge variant={dev.availability === "Online" ? "default" : "secondary"}>
                        {dev.availability}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{dev.title}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{dev.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Wallet className="h-4 w-4 text-gray-400" />
                        <span className="ml-1 text-sm font-medium">{dev.hourlyRate} ETH/hr</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="ml-1 text-sm">Available Now</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {dev.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button className="w-full">View Profile</Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={dev.availability !== "Online"}
                  >
                    Book Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindDeveloper;