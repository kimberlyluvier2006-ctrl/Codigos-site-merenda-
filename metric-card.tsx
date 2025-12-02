import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  variant?: "default" | "warning" | "success"
}

export function MetricCard({ title, value, icon: Icon, description, variant = "default" }: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950"
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      default:
        return ""
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case "warning":
        return "text-orange-600 dark:text-orange-400"
      case "success":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-primary"
    }
  }

  return (
    <Card className={getVariantStyles()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${getIconStyles()}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
