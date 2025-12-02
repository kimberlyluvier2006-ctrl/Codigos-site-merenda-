"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const monthlyData = [
  { month: "Jan", desperdicio: 45, meta: 30 },
  { month: "Fev", desperdicio: 38, meta: 30 },
  { month: "Mar", desperdicio: 52, meta: 30 },
  { month: "Abr", desperdicio: 41, meta: 30 },
  { month: "Mai", desperdicio: 35, meta: 30 },
  { month: "Jun", desperdicio: 28, meta: 30 },
  { month: "Jul", desperdicio: 33, meta: 30 },
  { month: "Ago", desperdicio: 29, meta: 30 },
  { month: "Set", desperdicio: 42, meta: 30 },
  { month: "Out", desperdicio: 37, meta: 30 },
  { month: "Nov", desperdicio: 31, meta: 30 },
  { month: "Dez", desperdicio: 22, meta: 30 },
]

export function WasteByPeriodChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desperdício por Período</CardTitle>
        <CardDescription>Comparativo mensal de desperdício vs meta estabelecida</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [`${value} itens`, name === "desperdicio" ? "Desperdício" : "Meta"]}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="desperdicio"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Desperdício"
            />
            <Line
              type="monotone"
              dataKey="meta"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Meta"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
