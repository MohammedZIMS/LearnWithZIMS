import { IconBook, IconListCheck, IconShoppingCart, IconUser } from "@tabler/icons-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { adminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-stats"

export async function SectionCards() {

  const {totalSignups, totalCustomers, totalCourses, totalLectures} = await adminGetDashboardStats();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 lg:px-6">
      {/* Total Signups Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 dark:from-blue-400/5 dark:to-blue-500/10"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Total Signups
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {totalSignups}
            </CardTitle>
          </div>
          <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3">
            <IconUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardFooter className="relative flex-col items-start gap-1 pt-0">
          <p className="text-sm text-muted-foreground">Registered users on the platform</p>
        </CardFooter>
      </Card>

      {/* Total Customers Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 dark:from-green-400/5 dark:to-green-500/10"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {totalCustomers}
            </CardTitle>
          </div>
          <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3">
            <IconShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardFooter className="relative flex-col items-start gap-1 pt-0">
          <p className="text-sm text-muted-foreground">
            Users who have enrolled in courses
          </p>
        </CardFooter>
      </Card>

      {/* Total Courses Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 dark:from-purple-400/5 dark:to-purple-500/10"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Total Courses
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {totalCourses}
            </CardTitle>
          </div>
          <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3">
            <IconBook className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardFooter className="relative flex-col items-start gap-1 pt-0">
          <p className="text-sm text-muted-foreground">
            Available courses on the platform
          </p>
        </CardFooter>
      </Card>

      {/* Total Lectures Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10 dark:from-amber-400/5 dark:to-amber-500/10"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Total Lectures
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {totalLectures}
            </CardTitle>
          </div>
          <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 p-3">
            <IconListCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardFooter className="relative flex-col items-start gap-1 pt-0">
          <p className="text-sm text-muted-foreground">
            Total learning content available
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}