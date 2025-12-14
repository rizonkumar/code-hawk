import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Github,
  GitPullRequest,
  Star,
  TrendingUp,
  Users,
  Code,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const MainPage = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back! 👋
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your repositories today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Repositories
            </CardTitle>
            <Github className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open PRs
            </CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reviews Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">89</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Contributors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">156</div>
            <p className="text-xs text-muted-foreground">+8 this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest reviews and updates from your repositories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                repo: "codehawk/frontend",
                action: "PR #123 reviewed",
                time: "2 hours ago",
                status: "approved",
              },
              {
                repo: "codehawk/api",
                action: "Security issue detected",
                time: "4 hours ago",
                status: "warning",
              },
              {
                repo: "codehawk/mobile",
                action: "Performance improvement suggested",
                time: "6 hours ago",
                status: "info",
              },
              {
                repo: "codehawk/docs",
                action: "Documentation updated",
                time: "1 day ago",
                status: "success",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  {activity.status === "approved" && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {activity.status === "warning" && (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                  {activity.status === "info" && (
                    <Code className="h-5 w-5 text-blue-500" />
                  )}
                  {activity.status === "success" && (
                    <Star className="h-5 w-5 text-purple-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.repo}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start gap-2 h-10"
              variant="outline"
            >
              <Github className="h-4 w-4" />
              View Repositories
            </Button>
            <Button
              className="w-full justify-start gap-2 h-10"
              variant="outline"
            >
              <GitPullRequest className="h-4 w-4" />
              Open Pull Requests
            </Button>
            <Button
              className="w-full justify-start gap-2 h-10"
              variant="outline"
            >
              <Users className="h-4 w-4" />
              Team Overview
            </Button>
            <Button
              className="w-full justify-start gap-2 h-10"
              variant="outline"
            >
              <Code className="h-4 w-4" />
              Code Analysis
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <CardHeader>
          <CardTitle>Repository Health Overview</CardTitle>
          <CardDescription>
            Code quality metrics across your repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Code Coverage", value: 85, color: "bg-green-500" },
              { name: "Performance Score", value: 92, color: "bg-blue-500" },
              { name: "Security Rating", value: 78, color: "bg-orange-500" },
            ].map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {metric.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {metric.value}%
                  </span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainPage;
