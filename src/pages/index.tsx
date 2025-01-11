import { Video, Bitcoin, Calendar, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const featuredDevs = [
  {
    name: "Sarah Chen",
    specialty: "Full Stack Developer",
    rate: "0.015 ETH/hr",
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    name: "Alex Kumar",
    specialty: "Blockchain Expert",
    rate: "0.02 ETH/hr",
    rating: 4.8,
    reviews: 93,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    name: "Emma Wilson",
    specialty: "Frontend Specialist",
    rate: "0.012 ETH/hr",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200"
  }
];

function Home() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = getAuthToken();
  //   if (!token) {
  //     navigate('/auth');
  //   }
  // }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Instant Developer Consultations</h1>
            <p className="text-xl mb-8 text-gray-300">Connect with expert developers instantly through video calls. Pay with crypto. Get solutions now.</p>
            <Button size="lg" className="inline-flex items-center bg-white text-black hover:bg-gray-100" onClick={() => navigate('/dashboard')}>
              Find a Developer
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-black/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Video Calls</h3>
              <p className="text-gray-600">Connect with developers instantly through high-quality video calls</p>
            </div>
            <div className="text-center">
              <div className="bg-black/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bitcoin className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Crypto Payments</h3>
              <p className="text-gray-600">Pay securely using cryptocurrency for seamless transactions</p>
            </div>
            <div className="text-center">
              <div className="bg-black/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Booking</h3>
              <p className="text-gray-600">Book consultations instantly based on developer availability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Developers Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Developers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredDevs.map((dev, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarImage src={dev.image} alt={dev.name} />
                    <AvatarFallback>{dev.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{dev.name}</h3>
                    <p className="text-gray-600 text-sm">{dev.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-black fill-current" />
                    <span className="ml-1 font-semibold">{dev.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({dev.reviews} reviews)</span>
                  </div>
                  <span className="font-semibold">{dev.rate}</span>
                </div>
                <Button className="w-full bg-black text-white hover:bg-black/90">
                  Book Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="mb-8 text-gray-300">Join our platform and connect with expert developers today</p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')}>
              Find a Developer
            </Button>
            <Button variant="secondary" size="lg" className='bg-transparent text-white hover:text-black' onClick={() => navigate('/dashboard/developer')}>
              Become a Developer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;