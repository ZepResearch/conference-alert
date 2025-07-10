import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});


export const metadata = {
  title: "Conference Alert - Discover Academic Conferences",
  description: "Find and submit academic conferences, seminars, and workshops worldwide",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} antialiased `}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
