"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const mostWastedData = [
  { item: "Pão", quantidade: 45, categoria: "Panificados" },
  { item: "Banana", quantidade: 38, categoria: "Frutas" },
  { item: "Leite", quantidade: 32, categoria: "Laticínios" },
  { item: "Maçã", quantidade: 28, categoria: "Frutas" },
  { item: "Arroz", quantidade: 22, categoria: "Grãos" },
]

const chartData = mostWastedData.map((item) => ({
  name: item.item,
  quantidade: item.quantidade,
}))

export function MostWastedItems() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Itens Mais Desperdiçados</CardTitle>
          <CardDescription>Top 5 itens com maior desperdício no período</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip
                formatter={(value) => [`${value} itens`, "Quantidade"]}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Bar dataKey="quantidade" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Item</CardTitle>
          <CardDescription>Lista detalhada dos itens mais desperdiçados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posição</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Impacto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mostWastedData.map((item, index) => (
                <TableRow key={item.item}>
                  <TableCell>
                    <Badge variant={index === 0 ? "destructive" : index === 1 ? "secondary" : "outline"}>
                      {index + 1}º
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>{item.quantidade} unidades</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.quantidade > 40 ? "destructive" : item.quantidade > 30 ? "secondary" : "outline"}
                    >
                      {item.quantidade > 40 ? "Alto" : item.quantidade > 30 ? "Médio" : "Baixo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
