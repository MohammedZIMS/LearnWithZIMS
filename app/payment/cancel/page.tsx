import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XIcon, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-6">

                <Card className="w-full border-0 shadow-xl rounded-2xl overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        <div className="text-center">
                            {/* Icon */}
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                                <XIcon className="h-10 w-10 text-red-600 dark:text-red-500" />
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Payment Cancelled
                            </h2>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                No worries, you won't be charged. Feel free to try again whenever you're ready.
                            </p>

                            {/* Additional Info */}
                            <div className="flex items-start justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg mb-6">
                                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-left">
                                    Your transaction was not completed. This can happen if you closed the payment window or cancelled the process.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                                <Button 
                                    asChild
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Link href="/courses">
                                        Browse Courses
                                    </Link>
                                </Button>
                                <Button 
                                    asChild
                                    variant="outline" 
                                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                                >
                                    <Link href="/">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Home
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Info */}
                {/* <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Need help?{" "}
                    <a 
                        href="mailto:support@example.com" 
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        Contact support
                    </a>
                </div> */}
            </div>
        </div>
    );
}