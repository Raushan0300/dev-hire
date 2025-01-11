// src/pages/auth.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle, Code2 } from "lucide-react";
import { saveAuthToken } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import { Wallet } from "lucide-react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface AuthResponse {
  token: string;
  user: {
    email: string;
    role: "developer" | "client";
  };
}

interface FormData {
  email: string;
  password: string;
  name?: string;
  walletAddress?: string;
  hourlyRate?: number;
  title?: string;
  company?: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    walletAddress: "",
    hourlyRate: 0,
    title: "",
    company: "",
  });

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }

      setIsLoading(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setFormData((prev) => ({
          ...prev,
          walletAddress: accounts[0],
        }));
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // In your handleSubmit function in src/pages/auth.tsx
  const handleSubmit = async (
    e: React.FormEvent,
    role: "client" | "developer"
  ) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = authType === "login" ? "/auth/login" : "/auth/signup"; // Remove /api prefix
      const payload =
        authType === "login"
          ? {
              email: formData.email,
              password: formData.password,
            }
          : {
              email: formData.email,
              password: formData.password,
              role,
              name: formData.name,
              walletAddress: formData.walletAddress,
              ...(role === "developer"
                ? {
                    hourlyRate: parseFloat(
                      formData.hourlyRate?.toString() || "0"
                    ),
                    title: formData.title,
                  }
                : {
                    company: formData.company,
                  }),
            };

      const response = await axiosInstance.post<AuthResponse>(
        endpoint,
        payload
      );
      const { token, user } = response.data;

      saveAuthToken(token);

      if (user.role === "developer") {
        navigate("/dashboard/developer");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {authType === "login" ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center">
            {authType === "login"
              ? "Enter your credentials to access your account"
              : "Sign up to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="client"
            className="w-full">
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
              <form
                onSubmit={(e) => handleSubmit(e, "client")}
                className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="m@example.com"
                    required
                  />
                </div>

                {authType === "register" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Full Name</Label>
                      <Input
                        id="client-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wallet">Wallet Address</Label>
                      <div className="flex gap-2">
                        <Input
                          id="wallet"
                          name="walletAddress"
                          type="text"
                          value={formData.walletAddress}
                          onChange={handleInputChange}
                          placeholder="0x..."
                          required
                          disabled
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={connectWallet}
                          disabled={isLoading}
                          className="gap-2">
                          <Wallet className="h-4 w-4" />
                          {formData.walletAddress
                            ? "Connected"
                            : "Connect Wallet"}
                        </Button>
                      </div>
                      {!window.ethereum && (
                        <p className="text-sm text-destructive">
                          Please install MetaMask to connect your wallet
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-company">Company</Label>
                      <Input
                        id="client-company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="client-password">Password</Label>
                  <Input
                    id="client-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {error && <div className="text-sm text-red-500">{error}</div>}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}>
                  {isLoading
                    ? "Please wait..."
                    : authType === "login"
                    ? "Sign In"
                    : "Create Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="developer">
              <form
                onSubmit={(e) => handleSubmit(e, "developer")}
                className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dev-email">Email</Label>
                  <Input
                    id="dev-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="m@example.com"
                    required
                  />
                </div>

                {authType === "register" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="dev-name">Full Name</Label>
                      <Input
                        id="dev-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wallet">Wallet Address</Label>
                      <div className="flex gap-2">
                        <Input
                          id="wallet"
                          name="walletAddress"
                          type="text"
                          value={formData.walletAddress}
                          onChange={handleInputChange}
                          placeholder="0x..."
                          required
                          disabled
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={connectWallet}
                          disabled={isLoading}
                          className="gap-2">
                          <Wallet className="h-4 w-4" />
                          {formData.walletAddress
                            ? "Connected"
                            : "Connect Wallet"}
                        </Button>
                      </div>
                      {!window.ethereum && (
                        <p className="text-sm text-destructive">
                          Please install MetaMask to connect your wallet
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dev-title">Professional Title</Label>
                      <Input
                        id="dev-title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Full Stack Developer"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dev-rate">Hourly Rate (ETH)</Label>
                      <Input
                        id="dev-rate"
                        name="hourlyRate"
                        type="number"
                        step="0.001"
                        value={formData.hourlyRate}
                        onChange={handleInputChange}
                        placeholder="0.015"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="dev-password">Password</Label>
                  <Input
                    id="dev-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {error && <div className="text-sm text-red-500">{error}</div>}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}>
                  {isLoading
                    ? "Please wait..."
                    : authType === "login"
                    ? "Sign In"
                    : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-sm text-center text-muted-foreground">
            {authType === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setAuthType("register")}
                  className="text-primary underline hover:text-primary/90">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setAuthType("login")}
                  className="text-primary underline hover:text-primary/90">
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
