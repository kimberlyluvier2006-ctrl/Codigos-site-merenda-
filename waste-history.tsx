import { Calendar, User, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WasteRecord } from "@/lib/data"

interface WasteHistoryProps {
  records: WasteRecord[]
}

export function WasteHistory({ records }: WasteHistoryProps) {
  const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case "vencimento":
        return "destructive"
      case "deterioração":
        return "secondary"
      case "contaminação":
        return "destructive"
      case "embalagem danificada":
        return "outline"
      case "sobra não consumida":
        return "secondary"
      default:
        return "outline"
    }
  }

  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Desperdícios</CardTitle>
        <CardDescription>Registros anteriores de itens desperdiçados</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedRecords.length > 0 ? (
          <div className="space-y-4">
            {sortedRecords.map((record) => (
              <div key={record.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{record.itemName}</span>
                      <Badge variant="outline">{record.quantity} unidades</Badge>
                    </div>
                    <Badge variant={getReasonColor(record.reason)}>{record.reason}</Badge>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(record.date).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  Registrado por: {record.registeredBy}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum registro de desperdício encontrado.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
