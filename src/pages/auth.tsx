import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle, Code2 } from 'lucide-react';

export default function AuthPage() {
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {authType === 'login' ? 'Welcome back' : 'Create an account'}
          </CardTitle>
          <CardDescription className="text-center">
            {authType === 'login' 
              ? 'Enter your credentials to access your account' 
              : 'Sign up to get started'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="client">
                <div className="flex items-center space-x-2">
                  <UserCircle className="h-4 w-4" />
                  <span>Client</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="developer">
                <div className="flex items-center space-x-2">
                  <Code2 className="h-4 w-4" />
                  <span>Developer</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="client">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input id="client-email" type="email" placeholder="m@example.com" required />
                </div>
                {authType === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Full Name</Label>
                    <Input id="client-name" type="text" required />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="client-password">Password</Label>
                  <Input id="client-password" type="password" required />
                </div>
                {authType === 'login' && (
                  <div className="flex justify-end">
                    <button type="button" className="text-sm text-muted-foreground hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}
                <Button className="w-full">
                  {authType === 'login' ? 'Sign In as Client' : 'Create Client Account'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="developer">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dev-email">Email</Label>
                  <Input id="dev-email" type="email" placeholder="m@example.com" required />
                </div>
                {authType === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="dev-name">Full Name</Label>
                    <Input id="dev-name" type="text" required />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="dev-password">Password</Label>
                  <Input id="dev-password" type="password" required />
                </div>
                {authType === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="rate">Hourly Rate (ETH)</Label>
                    <Input 
                      id="rate" 
                      type="number" 
                      step="0.001" 
                      placeholder="0.015"
                      required 
                    />
                  </div>
                )}
                {authType === 'login' && (
                  <div className="flex justify-end">
                    <button type="button" className="text-sm text-muted-foreground hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}
                <Button className="w-full">
                  {authType === 'login' ? 'Sign In as Developer' : 'Create Developer Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-sm text-center text-muted-foreground">
            {authType === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthType('register')}
                  className="text-primary underline hover:text-primary/90"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthType('login')}
                  className="text-primary underline hover:text-primary/90"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}