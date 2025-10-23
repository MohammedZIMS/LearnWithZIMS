import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX, ArrowLeft, Lock, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function NotAdminRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-1 rounded-full mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-full p-3">
              <ShieldX className="size-16 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">Access Restricted</h1>
          <p className="text-muted-foreground text-center max-w-md">
            You don't have permission to view this page
          </p>
        </div>

        <Card className="shadow-xl rounded-2xl overflow-hidden border-0 bg-background/90 backdrop-blur-sm dark:bg-gray-800/50">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="size-8 text-red-600 dark:text-red-400" />
              <CardTitle className="text-xl">Administrator Access Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Lock className="size-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  This page is restricted to authorized administrators only. 
                  If you believe this is an error, please contact your system administrator.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <ShieldAlert className="size-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Your current account does not have the necessary permissions 
                  to access this administrative area.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              
              <Button asChild className="py-6 flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                <Link href="/" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="size-5" />
                  Return to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Error Code: <span className="font-mono">403 Forbidden</span></p>
          <p className="mt-1">You are logged in as a standard user</p>
        </div>
      </div>
    </div>
  )
}