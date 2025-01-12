import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axiosInstance from '@/lib/axios';

interface EditProfileDialogProps {
    profile?: {
        fullName: string;
        title: string;
        hourlyRate: string;
        bio: string;
        skills: string;
        image: string;
        timezone: string;
    };
}

const EditProfileDialog = ({ profile }: EditProfileDialogProps) => {
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    title: profile?.title || '',
    hourlyRate: profile?.hourlyRate || '',
    bio: profile?.bio || '',
    skills: profile?.skills || '',
    image: profile?.image || '',
    timezone: profile?.timezone || '',
  });

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const endpoint = '/developer/update-profile';
    const response = await axiosInstance.post(endpoint, formData);
    if(response.status === 200) {
      setDialogOpen(false);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.image} />
              <AvatarFallback>{formData.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (ETH)</Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  step="0.001"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={formData.timezone} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="UTC+5:30">India Standard Time (UTC+5:30)</SelectItem>
                    <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value='UTC-3'>Brasília Time (UTC-3)</SelectItem>
                    <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="UTC-4">Atlantic Time (UTC-4)</SelectItem>
                    <SelectItem value="UTC+2">Eastern European Time (UTC+2)</SelectItem>
                    <SelectItem value="UTC+3">Moscow Time (UTC+3)</SelectItem>
                    <SelectItem value="UTC+4">Gulf Standard Time (UTC+4)</SelectItem>
                    <SelectItem value="UTC+6">Bangladesh Standard Time (UTC+6)</SelectItem>
                    <SelectItem value="UTC+7">Indochina Time (UTC+7)</SelectItem>
                    <SelectItem value="UTC+9">Japan Standard Time (UTC+9)</SelectItem>
                    <SelectItem value="UTC+0">UTC</SelectItem>
                    <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            {!isLoading ? <Button type="submit">Save Changes</Button> : <Button disabled>Please Wait...</Button>}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;