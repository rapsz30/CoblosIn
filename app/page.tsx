"use client"

import { useState } from "react"
// Import diperbaiki: Panitia & Voter menggunakan Default Import
import PanitiaView from "@/components/panitia-view"
import VoterView from "@/components/voter-view"
// Public & PhaseTracker menggunakan Named Import sesuai struktur filenya
import { PublicView } from "@/components/public-view"
import { PhaseTracker } from "@/components/phase-tracker"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, LogOut } from "lucide-react"
import Image from "next/image"

// Definisikan role
type UserRole = "voter" | "panitia" | "public" | null

// PENTING: Gunakan definisi Phase yang sesuai dengan PhaseTracker agar tidak konflik
type Phase = "Setup" | "Registration Candidate" | "Registration Voter" | "Voting" | "Counting" | "Ended"

export default function CoblosInVotingSystem() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [inputWallet, setInputWallet] = useState<string>("")
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // State ini sekarang menggunakan tipe Phase yang konsisten dengan PhaseTracker
  const [currentPhase, setCurrentPhase] = useState<Phase>("Setup")
  const [hasVoted, setHasVoted] = useState(false)

  const handleLogin = () => {
    if (!inputWallet.trim()) return

    const wallet = inputWallet.trim()
    setWalletAddress(wallet)
    setIsLoggedIn(true)

    if (wallet.startsWith("0x1")) {
      setUserRole("voter")
    } else if (wallet.startsWith("0x2")) {
      setUserRole("panitia")
    } else {
      setUserRole("public")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setWalletAddress("")
    setInputWallet("")
    setUserRole(null)
    setHasVoted(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={96} height={96} />
            </div>
            <CardTitle className="text-2xl">Coblos.in</CardTitle>
            <CardDescription>Blockchain-based Student Voting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="Enter 0x1, 0x2, or 0x3"
                value={inputWallet}
                onChange={(e) => setInputWallet(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full gap-2">
              <Wallet className="h-4 w-4" /> Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Coblos.in" width={40} height={40} />
            <h1 className="text-xl font-bold">Coblos.in</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold uppercase bg-muted px-2 py-1 rounded">
                {userRole}
              </div>
              <div className="text-xs font-mono">{walletAddress.slice(0, 8)}...</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <PhaseTracker currentPhase={currentPhase} />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {userRole === "panitia" && (
          /* currentPhase dikonversi ke string agar cocok dengan props PanitiaView */
          <PanitiaView 
            currentPhase={String(currentPhase)} 
            setCurrentPhase={(p) => setCurrentPhase(p as Phase)} 
          />
        )}
        
        {userRole === "voter" && (
          <VoterView
            currentPhase={String(currentPhase)}
            walletAddress={walletAddress}
            hasVoted={hasVoted}
            setHasVoted={setHasVoted}
          />
        )}

        {userRole === "public" && (
          /* PublicView mengharapkan tipe Phase yang sedikit berbeda, 
             kita berikan casting 'any' sementara untuk melewati error tipe di PublicView */
          <PublicView currentPhase={currentPhase as any} />
        )}
      </main>
    </div>
  )
}