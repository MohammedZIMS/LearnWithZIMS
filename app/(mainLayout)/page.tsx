"use client";

import { ModeToggle } from "@/components/ModeToggleButton";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { ArrowRight, BookOpen, GraduationCap, Users, BarChart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: FeatureProps[] = [
  {
    title: "Comprehensive Courses",
    description: "Access a wide range of carefully curated courses designed by industry experts.",
    icon: <BookOpen className="w-8 h-8" />
  },
  {
    title: "Interactive Learning",
    description: "Engage with interactive content, quizzes and assignments to enhance your learning experience.",
    icon: <GraduationCap className="w-8 h-8" />
  },
  {
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics and personalized insights.",
    icon: <BarChart className="w-8 h-8" />
  },
  {
    title: "Community Support",
    description: "Join a vibrant community of learners and get support from peers and mentors.",
    icon: <Users className="w-8 h-8" />
  }
];

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  async function signout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signout successfuly");
        },
      },
    });
  }
  return (
    <>
      <section className="relative py-18 px-4 bg-gradient-to-r">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            backgroundBlendMode: "multiply",
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          }}
        />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge
              variant={"outline"}
              className="text-white"
            >
              The future of Online Education
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tigh text-white">
              Elevate your <span className="text-primary">Learning</span> Experience
            </h1>

            <p className="max-w-[700px] md:text-xl text-white">
              Discover a new way to learn, connect, and grow with interactive courses, expert instructors, and a vibrant community designed to help you achieve your goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link
                href={"/courses"}
                className={buttonVariants({
                  size: "lg",
                  className: "text-white font-bold shadow-lg transform transition hover:scale-105"
                })}
              >
                Explore Courses <ArrowRight className="ml-2 w-4 h-4" />
              </Link>

              <div className="hidden sm:block">
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-transparent border border-white/10 backdrop-blur-md hover:shadow-lg transition-shadow mt-8"
              >
                <CardHeader>
                  <div className="text-3xl text-white mb-4">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
