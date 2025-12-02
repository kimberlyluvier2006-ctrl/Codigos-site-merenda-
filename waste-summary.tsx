import { TrendingDown, AlertTriangle, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WasteRecord } from "@/lib/data"

interface WasteSummaryProps {
  records: WasteRecord[]
}

export function WasteSummary({ records }: WasteSummaryProps) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Calculate monthly waste
  const monthlyWaste = records
    .filter((record) => {
      const recordDate = new Date(record.date)
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
    })
    .reduce((total, record) => total + record.quantity, 0)

  // Calculate today's waste
  const todayWaste = records
    .filter((record) => {
      const recordDate = new Date(record.date)
      return (
        recordDate.getDate() === today.getDate() &&
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      )
    })
    .reduce((total, record) => total + record.quantity, 0)

  // Most wasted item this month
  const itemCounts = records
    .filter((record) => {
      const recordDate = new Date(record.date)
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
    })
    .reduce(
      (acc, record) => {
        acc[record.itemName] = (acc[record.itemName] || 0) + record.quantity
        return acc
      },
      {} as Record<string, number>,
    )

  const mostWastedItem = Object.entries(itemCounts).sort(([, a], [, b]) => b - a)[0]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Desperdício Hoje</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayWaste}</div>
          <p className="text-xs text-muted-foreground">itens desperdiçados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Desperdício do Mês</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthlyWaste}</div>
          <p className="text-xs text-muted-foreground">itens desperdiçados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Item Mais Desperdiçado</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostWastedItem?.[0] || "N/A"}</div>
          <p className="text-xs text-muted-foreground">
            {mostWastedItem ? `${mostWastedItem[1]} unidades` : "Nenhum registro"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
