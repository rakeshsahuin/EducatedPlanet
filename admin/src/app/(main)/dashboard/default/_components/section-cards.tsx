"use client";

import { TrendingUp, TrendingDown, Users, GraduationCap, Star, DollarSign } from "lucide-react";
import { useDashboardOverview } from "@/hooks/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionCards() {
  const { data: dashboardData, isLoading, error } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        Failed to load dashboard statistics
      </div>
    );
  }

  const stats = dashboardData || {
    totalUsers: 0,
    totalTutors: 0,
    totalReviews: 0,
    averageRating: 0
  };

  // Calculate growth percentages (mock data for now)
  const userGrowth = 12.5;
  const tutorGrowth = -5.2;
  const reviewGrowth = 28.3;
  const ratingChange = 0.3;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Users className="size-4" />
            Total Users
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalUsers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant={userGrowth >= 0 ? "default" : "destructive"}>
              <TrendingUp className={`size-4 ${userGrowth < 0 ? 'rotate-180' : ''}`} />
              {userGrowth >= 0 ? '+' : ''}{userGrowth}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {userGrowth >= 0 ? 'Growing' : 'Declining'} this month
            <TrendingUp className={`size-4 ${userGrowth < 0 ? 'rotate-180 text-destructive' : 'text-green-600'}`} />
          </div>
          <div className="text-muted-foreground">Total registered users</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <GraduationCap className="size-4" />
            Total Tutors
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalTutors.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant={tutorGrowth >= 0 ? "default" : "destructive"}>
              <TrendingUp className={`size-4 ${tutorGrowth < 0 ? 'rotate-180' : ''}`} />
              {tutorGrowth >= 0 ? '+' : ''}{tutorGrowth}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {tutorGrowth >= 0 ? 'Increasing' : 'Decreasing'} tutor base
            <TrendingUp className={`size-4 ${tutorGrowth < 0 ? 'rotate-180 text-destructive' : 'text-green-600'}`} />
          </div>
          <div className="text-muted-foreground">Active tutors on platform</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Star className="size-4" />
            Total Reviews
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalReviews.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant={reviewGrowth >= 0 ? "default" : "destructive"}>
              <TrendingUp className={`size-4 ${reviewGrowth < 0 ? 'rotate-180' : ''}`} />
              {reviewGrowth >= 0 ? '+' : ''}{reviewGrowth}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {reviewGrowth >= 0 ? 'More reviews' : 'Fewer reviews'} this period
            <TrendingUp className={`size-4 ${reviewGrowth < 0 ? 'rotate-180 text-destructive' : 'text-green-600'}`} />
          </div>
          <div className="text-muted-foreground">Student feedback collected</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Star className="size-4" />
            Average Rating
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.averageRating.toFixed(1)}
          </CardTitle>
          <CardAction>
            <Badge variant={ratingChange >= 0 ? "default" : "destructive"}>
              <TrendingUp className={`size-4 ${ratingChange < 0 ? 'rotate-180' : ''}`} />
              {ratingChange >= 0 ? '+' : ''}{ratingChange}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {ratingChange >= 0 ? 'Improving' : 'Declining'} quality
            <TrendingUp className={`size-4 ${ratingChange < 0 ? 'rotate-180 text-destructive' : 'text-green-600'}`} />
          </div>
          <div className="text-muted-foreground">Platform average rating</div>
        </CardFooter>
      </Card>
    </div>
  );
}
