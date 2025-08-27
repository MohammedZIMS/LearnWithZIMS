"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useConfetti } from "@/hooks/use-confetti";
import { useEffect } from "react";

export default function PaymentSuccessfull() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, [])
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6">

                <Card className="w-full border-0 shadow-xl rounded-2xl overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="text-center">
                            {/* Icon */}
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                                <CheckIcon className="h-10 w-10 text-green-600 dark:text-green-500" />
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Payment Successfull!
                            </h2>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Congrats! Your payment was successful. You can now access the course.
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                                
                                <Button 
                                    asChild
                                    variant="outline" 
                                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                                >
                                    <Link href="/dashboard">
                                          Go to Dashboard
                                        <ArrowRight className="h-4 w-4 mr-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}