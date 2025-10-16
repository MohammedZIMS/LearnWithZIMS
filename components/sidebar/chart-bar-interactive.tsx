"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


export const description = "An interactive area chart"

const chartData = [
  {
    date: '2025-10-16', enrollments: 12,
  },
  {
    date: '2025-10-17', enrollments: 5,
  },
  {
    date: '2025-10-18', enrollments: 19,
  },
  {
    date: '2025-10-19', enrollments: 22,
  },
  {
    date: '2025-10-20', enrollments: 22,
  },
  {
    date: '2025-10-21', enrollments: 22,
  },
]

const chartConfig = {
  enrollments: {
    label: "Enrollment",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig

export function ChartBarInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

 

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollment</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total Enrollment for the last 30 days: 1200
          </span>
          <span className="@[540px]/card:hidden">Last 30 days: 1200</span>
        </CardDescription>
        
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart 
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Bar
              dataKey="enrollments"
              type="natural"
              fill="var(--color-enrollments)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
