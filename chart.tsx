"use client"

import type {ReactNode} from "react"
import {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import type {User} from "@/lib/auth"

interface AuthGuardProps {
  children: ReactNode
  allowedRoles?: User["type"][]
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    if (isLoading) {
      return
    }

    // Verificação direta sem função callback
    if (!user) {
      router.replace("/login")
      setIsAuthorized(false)
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.type)) {
      router.replace("/dashboard")
      setIsAuthorized(false)
      return
    }

    setIsAuthorized(true)
  }, [user, isLoading, allowedRoles, router])

  // Estado de carregamento
  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não está autorizado, não renderiza nada
  if (!isAuthorized) {
    return null
  }

  // Renderiza o conteúdo protegido sem fragmento desnecessário
  return children
}