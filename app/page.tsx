"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { StudentView } from "@/components/student-view"
import { AdminView } from "@/components/admin-view"
import { ADMIN_ADDRESS } from "@/hooks/use-mock-contract"

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"landing" | "student" | "admin">("landing")

  const handleConnect = (address: string) => {
    setWalletAddress(address)
    // Route based on wallet address
    if (address === ADMIN_ADDRESS) {
      setCurrentView("admin")
    } else {
      setCurrentView("student")
    }
  }

  const handleDisconnect = () => {
    setWalletAddress(null)
    setCurrentView("landing")
  }

  return (
    <div className="min-h-screen bg-background">
      {currentView === "landing" && <LandingPage onConnect={handleConnect} />}
      {currentView === "student" && <StudentView walletAddress={walletAddress!} onDisconnect={handleDisconnect} />}
      {currentView === "admin" && <AdminView walletAddress={walletAddress!} onDisconnect={handleDisconnect} />}
    </div>
  )
}
