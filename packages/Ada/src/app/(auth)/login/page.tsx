'use client';

import authServiceInstance from '@/api/authService';
import Navbar from '@/components/LoggedOut/navbar';
import { SparklesCore } from '@/components/LoggedOut/sparkles';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LoginSession from '@/lib/Sessions';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const data = await authServiceInstance.login(email, password);
      console.log('Login successful:', data);
      await LoginSession(data.token); // Set session token
      router.push('/dashboard'); // Redirect upon successful login
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: error.message || 'Failed to login. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[calc(100vh-76px)]">
          <Card className="w-full max-w-md backdrop-blur-sm bg-purple-900/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-400">
                Log in to your ResearchAI account to continue your journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="bg-purple-900/50 border-purple-500/50 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        className="bg-purple-900/50 border-purple-500/50 text-white placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <CardFooter className="flex flex-col space-y-4 mt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isLoading ? 'Logging in...' : 'Log In'}
                  </Button>
                  <div className="flex justify-between w-full text-sm">
                    <Link
                      href="/forgot-password"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Forgot password?
                    </Link>
                    <Link
                      href="/signup"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Create an account
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
