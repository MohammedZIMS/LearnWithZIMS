"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader2, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

// GitHub SVG Component
const GitHub = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="currentColor" />
  </svg>
);

// Google SVG Component
const Google = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" {...props}>
    <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" />
    <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" />
    <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" />
    <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" />
  </svg>
);

export function LoginForm() {
  const router =useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [googlePending, startGoogleTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");

  async function signinWithGithub() {
    startGithubTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: 'github',
          callbackURL: "/",
          fetchOptions: {
            onSuccess: () => {
              toast.success('Signed in with GitHub. Redirecting...');
            },
            onError: (error) => {
              toast.error(error.error?.message || "Failed to sign in with GitHub");
            },
          },
        });
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  }

  async function signinWithGoogle() {
    startGoogleTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: 'google',
          callbackURL: "/",
          fetchOptions: {
            onSuccess: () => {
              toast.success('Signed in with Google. Redirecting...');
            },
            onError: (error) => {
              toast.error(error.error?.message || "Failed to sign in with Google");
            },
          },
        });
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  }

  function signinWithEmail(){
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: 'sign-in',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Email sent')
            router.push(`/varify-request?email=${email}`)
          },
          onError: () => {
            toast.error('Error send');
          }
        }
      })
    })
  }
  

  return (
    <Card className="w-full max-w-md shadow-xl rounded-xl border-0 bg-background/90 backdrop-blur-sm dark:bg-gray-800/50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Welcome Back!
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            disabled={githubPending || googlePending}
            onClick={signinWithGithub}
            variant="outline"
            className="gap-2"
          >
            {githubPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <GitHub className="size-4" />
            )}
            GitHub
          </Button>
          
          <Button
            disabled={googlePending || githubPending}
            onClick={signinWithGoogle}
            variant="outline"
            className="gap-2"
          >
            {googlePending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Google className="size-4" />
            )}
            Google
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-sm text-muted-foreground dark:bg-gray-800/50">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email Login Form */}
        
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={email}
              type="email" 
              placeholder="Enter your email: e.g.:name@example.com" 
              onChange={(e) => setEmail(e.target.value)}
              required
              className="py-5"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={ emailPending || githubPending || googlePending }
            onClick={signinWithEmail}
            className="w-full py-5"
          >
            { emailPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Sending login link...
              </>
            ) : (
              <>
                <Mail className="size-4"/>
                <samp>
                  Continue with Email
                </samp>
              </>
            )}
          </Button>
       
      </CardContent>

      {/* <CardFooter className="flex justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link 
            href="/signup" 
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter> */}
    </Card>
  );
}