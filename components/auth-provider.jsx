"use client"

import { createContext, useContext, useEffect, useState } from "react"
import pocketbase from "@/lib/pocketbase"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      // Wait for PocketBase to initialize
      await pocketbase.waitForInit()

      // Check if user is already authenticated
      if (pocketbase.isAuthenticated) {
        setUser(pocketbase.currentUser)

        // Try to refresh the auth to ensure it's still valid
        const refreshed = await pocketbase.refreshAuth()
        if (!refreshed && pocketbase.isAuthenticated) {
          // If refresh failed but we still have auth, keep the user
          setUser(pocketbase.currentUser)
        } else if (!pocketbase.isAuthenticated) {
          setUser(null)
        }
      }

      setLoading(false)
    }

    initAuth()

    // Listen for auth changes
    const unsubscribe = pocketbase.pb.authStore.onChange(() => {
      setUser(pocketbase.currentUser)
    })

    return unsubscribe
  }, [])

  const login = async (email, password) => {
    const result = await pocketbase.login(email, password)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  const register = async (email, password, passwordConfirm, name) => {
    const result = await pocketbase.register(email, password, passwordConfirm, name)
    return result
  }

  const logout = () => {
    pocketbase.logout()
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && pocketbase.isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
