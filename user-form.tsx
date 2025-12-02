"use client"

import type { FormEvent } from "react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, RefreshCw } from "lucide-react"

import type { ExtendedUser } from "@/lib/users"
import { generatePassword } from "@/lib/users"

/*  
  TIPO CORRIGIDO → agora aceita password corretamente
*/
type UserFormPayload = Omit<ExtendedUser, "id" | "createdAt" | "lastLogin"> & {
  password?: string
}

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (user: UserFormPayload) => void
  editingUser?: ExtendedUser | null
}

export function UserForm({ isOpen, onClose, onSubmit, editingUser }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "merendeira" as ExtendedUser["type"],
    status: "active" as ExtendedUser["status"],
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState("")

  // Carregar dados ao abrir modal
  useEffect(() => {
    if (!isOpen) return

    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        type: editingUser.type,
        status: editingUser.status,
        password: "",
      })
      setGeneratedPassword("")
    } else {
      const newPassword = generatePassword()
      setFormData({
        name: "",
        email: "",
        type: "merendeira",
        status: "active",
        password: newPassword,
      })
      setGeneratedPassword(newPassword)
    }
  }, [isOpen, editingUser])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    onSubmit({
      name: formData.name,
      email: formData.email,
      type: formData.type,
      status: formData.status,
      password: formData.password, // corrigido — agora permitido no tipo
    })

    handleClose()
  }

  const handleClose = () => {
    onClose()

    // Limpa estado após fechar
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        type: "merendeira",
        status: "active",
        password: "",
      })
      setGeneratedPassword("")
    }, 200)
  }

  const handleGeneratePassword = () => {
    const newPassword = generatePassword()
    setFormData((prev) => ({ ...prev, password: newPassword }))
    setGeneratedPassword(newPassword)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{editingUser ? "Editar Usuário" : "Adicionar Novo Usuário"}</DialogTitle>
          <DialogDescription>
            {editingUser ? "Edite as informações do usuário." : "Adicione um novo usuário ao sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Maria Silva"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="usuario@escola.com"
              required
            />
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo de Usuário</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="merendeira">Merendeira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === "active"}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, status: checked ? "active" : "inactive" })
              }
            />
            <Label htmlFor="status">Usuário ativo</Label>
          </div>

          {/* Senha somente ao criar */}
          {!editingUser && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Button type="button" variant="ghost" size="sm" onClick={handleGeneratePassword}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Gerar Nova
                </Button>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {generatedPassword && (
                <Alert>
                  <AlertDescription>
                    <strong>Importante:</strong> Anote esta senha e compartilhe com o usuário. Ela não será exibida
                    novamente.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">{editingUser ? "Salvar Alterações" : "Criar Usuário"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
