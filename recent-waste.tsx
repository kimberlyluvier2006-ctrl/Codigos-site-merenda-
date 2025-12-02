import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockWasteRecords } from "@/lib/data"

export function RecentWaste() {
  const recentWaste = mockWasteRecords.slice(0, 5)

  const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case "vencimento":
        return "destructive"
      case "deterioração":
        return "secondary"
      case "contaminação":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desperdícios Recentes</CardTitle>
        <CardDescription>Últimos registros de desperdício</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentWaste.map((waste) => (
            <div key={waste.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{waste.itemName}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={getReasonColor(waste.reason)} className="text-xs">
                    {waste.reason}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{waste.quantity} unidades</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{new Date(waste.date).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
