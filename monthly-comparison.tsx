"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

const comparisonData = [
  { month: "Set", atual: 42, anterior: 35, economia: -7 },
  { month: "Out", atual: 37, anterior: 42, economia: 5 },
  { month: "Nov", atual: 31, anterior: 37, economia: 6 },
  { month: "Dez", atual: 22, anterior: 31, economia: 9 },
]

export function MonthlyComparison() {
  const totalEconomia = comparisonData.reduce((acc, item) => acc + item.economia, 0)
  const percentualMelhoria = (
    (totalEconomia / comparisonData.reduce((acc, item) => acc + item.anterior, 0)) *
    100
  ).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Total</CardTitle>
            {totalEconomia > 0 ? (
              <ArrowDown className="h-4 w-4 text-green-600" />
            ) : totalEconomia < 0 ? (
              <ArrowUp className="h-4 w-4 text-red-600" />
            ) : (
              <Minus className="h-4 w-4 text-gray-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.abs(totalEconomia)}</div>
            <p className="text-xs text-muted-foreground">
              {totalEconomia > 0
                ? "itens economizados"
                : totalEconomia < 0
                  ? "itens a mais desperdiçados"
                  : "sem alteração"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhoria</CardTitle>
            {Number.parseFloat(percentualMelhoria) > 0 ? (
              <ArrowDown className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowUp className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.abs(Number.parseFloat(percentualMelhoria))}%</div>
            <p className="text-xs text-muted-foreground">
              {Number.parseFloat(percentualMelhoria) > 0 ? "redução no desperdício" : "aumento no desperdício"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Mês</CardTitle>
            <ArrowDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dezembro</div>
            <p className="text-xs text-muted-foreground">22 itens desperdiçados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparativo Mensal</CardTitle>
          <CardDescription>Comparação do desperdício atual vs mês anterior</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [`${value} itens`, name === "atual" ? "Mês Atual" : "Mês Anterior"]}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Bar dataKey="anterior" fill="hsl(var(--chart-3))" name="Mês Anterior" />
              <Bar dataKey="atual" fill="hsl(var(--chart-2))" name="Mês Atual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
