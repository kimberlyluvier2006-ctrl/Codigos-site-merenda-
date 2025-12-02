"use client"

import type { FormEvent } from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { InventoryItem } from "@/lib/data"

interface InventoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (item: Omit<InventoryItem, "id">) => void
  editingItem?: InventoryItem | null
}

const categories = [
  "Grãos",
  "Laticínios",
  "Panificados",
  "Frutas",
  "Verduras",
  "Carnes",
  "Bebidas",
  "Condimentos",
  "Outros",
]

export function InventoryForm({ isOpen, onClose, onSubmit, editingItem }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    expiryDate: "",
  })

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        category: editingItem.category,
        quantity: editingItem.quantity.toString(),
        expiryDate: editingItem.expiryDate,
      })
    } else {
      setFormData({
        name: "",
        category: "",
        quantity: "",
        expiryDate: "",
      })
    }
  }, [editingItem, isOpen])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: formData.name,
      category: formData.category,
      quantity: Number.parseInt(formData.quantity),
      expiryDate: formData.expiryDate,
    })
    onClose()
  }

  const handleClose = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      expiryDate: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Editar Item" : "Adicionar Novo Item"}</DialogTitle>
          <DialogDescription>
            {editingItem ? "Edite as informações do item no estoque." : "Adicione um novo item ao estoque."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Item</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Arroz, Feijão, Leite..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Ex: 50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Data de Validade</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">{editingItem ? "Salvar Alterações" : "Adicionar Item"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
