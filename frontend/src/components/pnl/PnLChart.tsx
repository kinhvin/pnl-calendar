import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import type { DayData } from "../../types";

/**
 * 📊 PnL Chart Component
 * 
 * This component visualizes your trading performance over time.
 * It takes your calendar data and transforms it into a chart showing:
 * - Daily PnL (profit/loss)
 * - Cumulative PnL (running total)
 * - Time range filtering (7 days, 30 days, or all data)
 */

interface PnLChartProps {
  // This is the same data structure from your calendar
  // The key is the date string (YYYY-MM-DD), value is the day's data
  data: Record<string, DayData>;
}

// 🎨 Chart configuration - defines colors and labels for the chart
const chartConfig = {
  dailyPnL: {
    label: "Daily P&L",
    color: "hsl(var(--chart-1))", // Uses your theme colors
  },
  cumulativePnL: {
    label: "Cumulative P&L",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function PnLChart({ data }: PnLChartProps) {
  // 📦 State: Track which time range the user wants to see
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

  /**
   * 🔄 Transform calendar data into chart-friendly format
   * 
   * Why we do this:
   * - The calendar stores data by date keys (object)
   * - Charts need an array of data points
   * - We need to calculate cumulative totals
   */
  const chartData = useMemo(() => {
    // Step 1: Convert object to array and sort by date
    const entries = Object.entries(data)
      .map(([dateStr, dayData]) => ({
        date: dateStr,
        dailyPnL: dayData.pnl,
        // We'll calculate cumulative later
        cumulativePnL: 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date)); // Sorts chronologically

    // Step 2: Calculate cumulative PnL (running total)
    let runningTotal = 0;
    entries.forEach((entry) => {
      runningTotal += entry.dailyPnL;
      entry.cumulativePnL = runningTotal;
    });

    return entries;
  }, [data]); // Only recalculate when data changes

  /**
   * 📅 Filter data based on selected time range
   * 
   * Why filtering:
   * - Shows relevant timeframe
   * - Makes charts more readable
   * - Improves performance with large datasets
   */
  const filteredData = useMemo(() => {
    if (timeRange === "all") return chartData;

    // Get the most recent date in the data (not currentDate)
    // This ensures we show the last N days of actual trading data
    if (chartData.length === 0) return [];
    
    const mostRecentDate = new Date(chartData[chartData.length - 1].date);
    const daysToShow = timeRange === "7d" ? 7 : 30;
    const cutoffDate = new Date(mostRecentDate);
    cutoffDate.setDate(cutoffDate.getDate() - daysToShow + 1); // +1 to include the start day

    // Filter to only show recent data
    return chartData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  }, [chartData, timeRange]);

  /**
   * 📊 Calculate statistics for the header
   */
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return { totalPnL: 0, winRate: 0, bestDay: 0, worstDay: 0 };
    }

    const totalPnL = filteredData[filteredData.length - 1]?.cumulativePnL || 0;
    const winningDays = filteredData.filter((d) => d.dailyPnL > 0).length;
    const winRate = (winningDays / filteredData.length) * 100;
    const bestDay = Math.max(...filteredData.map((d) => d.dailyPnL));
    const worstDay = Math.min(...filteredData.map((d) => d.dailyPnL));

    return { totalPnL, winRate, bestDay, worstDay };
  }, [filteredData]);

  /**
   * 🎨 Dynamic color based on PnL performance
   */
  const chartColor = useMemo(() => {
    const finalPnL = stats.totalPnL;
    return finalPnL >= 0 ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)';
  }, [stats.totalPnL]);

  // 💰 Helper function to format currency
  const formatCurrency = (value: number) => {
    const prefix = value >= 0 ? "+$" : "-$";
    return prefix + Math.abs(value).toFixed(2);
  };

  return (
    <Card>
      {/* 📋 Header with title and time range selector */}
      <CardHeader className="flex flex-col gap-4 space-y-0 border-b py-5 sm:flex-row sm:items-center">
        <div className="flex-1 space-y-1">
          <CardTitle>P&L Performance Chart</CardTitle>
          <CardDescription className="flex flex-wrap gap-x-4 gap-y-1">
            <span>Cumulative: <span className="font-medium">{formatCurrency(stats.totalPnL)}</span></span>
            <span>Win Rate: <span className="font-medium">{stats.winRate.toFixed(1)}%</span></span>
            <span>Best Day: <span className="font-medium">{formatCurrency(stats.bestDay)}</span></span>
            <span>Worst Day: <span className="font-medium">{formatCurrency(stats.worstDay)}</span></span>
          </CardDescription>
        </div>
        
        {/* Time range dropdown */}
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="all" className="rounded-lg">
              All time
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {/* 📈 Chart content */}
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          // Empty state - shown when no trading data exists
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No trading data available for this period
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              {/* Gradient definitions for the filled areas */}
              <defs>
                <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColor}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColor}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              {/* Grid lines for easier reading */}
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              {/* X-axis: Dates */}
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />

              {/* Y-axis: Dollar amounts */}
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value >= 0 ? `$${value}` : `-$${Math.abs(value)}`}
              />

              {/* Zero line - helps visualize profit vs loss */}
              <ReferenceLine
                y={0}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
              />

              {/* 
                Tooltip that appears when hovering 
                
                Key concept: Custom tooltip formatting
                - We need to tell the tooltip HOW to display our data
                - labelFormatter: formats the date label
                - formatter: formats the PnL values
                - We wrap it in our own component for full control
              */}
              <ChartTooltip
                content={({ active, payload }) => {
                  // Only show tooltip when hovering over a data point
                  if (!active || !payload || payload.length === 0) {
                    return null;
                  }

                  // Extract the data from the payload
                  const data = payload[0].payload;
                  
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      {/* Date label */}
                      <div className="mb-1 font-medium">
                        {new Date(data.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      
                      {/* Daily PnL */}
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
                        <span className="text-sm text-muted-foreground">Daily P&L:</span>
                        <span className="font-mono font-medium">
                          {formatCurrency(data.dailyPnL)}
                        </span>
                      </div>
                      
                      {/* Cumulative PnL */}
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
                        <span className="text-sm text-muted-foreground">Cumulative:</span>
                        <span className="font-mono font-medium">
                          {formatCurrency(data.cumulativePnL)}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />

              {/* The actual area/line showing cumulative PnL */}
              <Area
                dataKey="cumulativePnL"
                type="monotone"
                fill="url(#fillCumulative)"
                stroke={chartColor}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
