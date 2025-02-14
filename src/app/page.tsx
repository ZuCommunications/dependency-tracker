import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Activity,
  ArrowRight,
  BarChart,
  Calendar,
  Package,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
export default function LandingPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Dependency Tracker
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md text-base sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Effortlessly track dependencies across all your projects
          </p>
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<BarChart className="h-8 w-8" />}
            title="Dashboard Overview"
            description="View key metrics and insights about your projects' dependencies"
            buttonText="Go to Dashboard"
            buttonHref="/dashboard"
          />
          <FeatureCard
            icon={<Package className="h-8 w-8" />}
            title="Project Management"
            description="Browse and manage all your GitHub repositories and their dependencies"
            buttonText="View Projects"
            buttonHref="/projects"
          />
          <FeatureCard
            icon={<ArrowRight className="h-8 w-8" />}
            title="Version Tracking"
            description="Track version changes and updates across your project dependencies"
            buttonText="View Versions"
            buttonHref="/versions"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Security Alerts"
            description="Monitor Dependabot alerts and security vulnerabilities in your dependencies"
            buttonText="View Alerts"
            buttonHref="/security-alerts"
          />
          <FeatureCard
            icon={<Activity className="h-8 w-8" />}
            title="GitHub Actions"
            description="Monitor CI/CD workflows and automated dependency updates"
            buttonText="View Actions"
            buttonHref="/actions"
          />
          <FeatureCard
            icon={<Calendar className="h-8 w-8" />}
            title="Lifecycle Calendar"
            description="Track dependency lifecycle events like End of Life or End of Active Development Dates"
            buttonText="View Calendar"
            buttonHref="/calendar"
          />
        </div>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  buttonText: string
  buttonHref: string
}

function FeatureCard({
  icon,
  title,
  description,
  buttonText,
  buttonHref,
}: FeatureCardProps) {
  return (
    <Card className="bg-card flex flex-col" hover={false}>
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="mt-auto">
        <Link prefetch={true} href={buttonHref} className="w-full">
          <Button variant="outline" className="w-full">
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
