
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"


const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--accent))",
  },
} satisfies Record<string, { label: string; color: string }>;


export function SampleChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Trends</CardTitle>
        <CardDescription>Monthly sales data comparison for Desktop vs Mobile.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full aspect-auto">
          {/* ResponsiveContainer is handled by ChartContainer */}
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="hsl(var(--foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="desktop" fill={chartConfig.desktop.color} radius={[4, 4, 0, 0]} />
            <Bar dataKey="mobile" fill={chartConfig.mobile.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

