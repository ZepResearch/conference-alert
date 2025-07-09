"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import pocketbase from "@/lib/pocketbase"

const AuthContext = createContext({})

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Protected route logic
function useProtectedRoute(user, isInitialized) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isInitialized) return

    const isAuthPage = pathname === "/login" || pathname === "/register"
    const isProtectedPage = pathname.startsWith("/dashboard")
    const isHomePage = pathname === "/"

    if (!user && isProtectedPage) {
      // User not logged in but trying to access protected page
      console.log("Redirecting to login - user not authenticated")
      router.push("/login")
    } else if (user && isAuthPage) {
      // User logged in but on auth page, redirect to dashboard
      console.log("Redirecting to dashboard - user already authenticated")
      router.push("/dashboard")
    }
    // Allow all other routes to load normally
  }, [user, pathname, isInitialized, router])
}

export function AuthProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = () => {
      // Check if user is already authenticated
      const isValid = pocketbase.isAuthenticated
      const currentUser = pocketbase.currentUser

      setIsLoggedIn(isValid)
      setUser(isValid ? currentUser : null)
      setIsInitialized(true)
      setLoading(false)

      console.log("Auth initialized:", { isValid, currentUser })
    }

    // Initialize auth state
    initializeAuth()

    // Listen for auth changes
    const unsubscribe = pocketbase.onChange((token, model) => {
      const isValid = !!token && !!model
      setIsLoggedIn(isValid)
      setUser(isValid ? model : null)

      console.log("Auth changed:", { isValid, model })
    })

    return unsubscribe
  }, [])

  const signIn = async (email, password) => {
    try {
      const result = await pocketbase.login(email, password)

      if (result.success) {
        setUser(result.user)
        setIsLoggedIn(true)
        console.log("Sign in successful:", result.user)
      }

      return result
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      pocketbase.logout()
      setUser(null)
      setIsLoggedIn(false)
      console.log("Sign out successful")
      return { success: true }
    } catch (error) {
      console.error("Sign out error:", error)
      return { success: false, error: error.message }
    }
  }

  const createAccount = async ({ email, password, passwordConfirm, name }) => {
    try {
      const result = await pocketbase.register(email, password, passwordConfirm, name)
      console.log("Account creation result:", result)
      return result
    } catch (error) {
      console.error("Create account error:", error)
      return { success: false, error: error.message }
    }
  }

  // Use protected route logic
  useProtectedRoute(user, isInitialized)

  const value = {
    signIn,
    signOut,
    createAccount,
    isLoggedIn,
    isInitialized,
    user,
    loading,
    isAuthenticated: isLoggedIn,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
