"use client"

import { useState } from "react"
import { PanitiaView } from "@/components/panitia-view"
import { VoterView } from "@/components/voter-view"
import { PublicView } from "@/components/public-view"
import { PhaseTracker } from "@/components/phase-tracker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, LogOut } from "lucide-react"
import Image from "next/image"

type UserRole = "voter" | "panitia" | "public" | null
type Phase = "Setup" | "Registration Candidate" | "Registration Voter" | "Voting" | "Counting" | "Ended"

export default function CoblosInVotingSystem() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [inputWallet, setInputWallet] = useState<string>("")
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<Phase>("Setup")
  const [hasVoted, setHasVoted] = useState(false)

  const handleLogin = () => {
    if (!inputWallet.trim()) return

    const wallet = inputWallet.trim()
    setWalletAddress(wallet)
    setIsLoggedIn(true)

    // Determine role based on wallet address
    if (wallet.startsWith("0x1")) {
      setUserRole("voter")
    } else if (wallet.startsWith("0x2")) {
      setUserRole("panitia")
    } else if (wallet.startsWith("0x3")) {
      setUserRole("public")
    } else {
      setUserRole("public") // Default to public view for unknown addresses
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
              <Image
                src="/logo.png"
                alt="Coblos.in Logo"
                width={96}
                height={96}
                className="h-full w-full object-contain"
              />
            </div>
            <CardTitle className="text-2xl">{"Coblos.in"}</CardTitle>
            <CardDescription>{"Blockchain-based Student Voting"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">{"Wallet Address"}</Label>
              <Input
                id="wallet"
                type="text"
                placeholder="Enter your wallet address (e.g., 0x1, 0x2, 0x3)"
                value={inputWallet}
                onChange={(e) => setInputWallet(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                {"Development Mode: Use 0x1 (Voter), 0x2 (Admin), or 0x3 (Public)"}
              </p>
            </div>
            <Button onClick={handleLogin} className="w-full gap-2">
              <Wallet className="h-4 w-4" />
              {"Connect Wallet"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Coblos.in"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{"Coblos.in"}</h1>
                <p className="text-xs text-muted-foreground">{"Blockchain Voting System"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end gap-1">
                <div className="rounded-md bg-muted px-3 py-1 text-xs font-semibold uppercase">
                  {userRole === "panitia" && "Admin"}
                  {userRole === "voter" && hasVoted ? "Voted ✓" : userRole === "voter" && "Voter"}
                  {userRole === "public" && "Public"}
                </div>
                <div className="rounded-md bg-muted px-3 py-1 font-mono text-xs">{walletAddress.slice(0, 8)}...</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                {"Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Phase Tracker */}
      <PhaseTracker currentPhase={currentPhase} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {userRole === "panitia" && <PanitiaView currentPhase={currentPhase} setCurrentPhase={setCurrentPhase} />}
        {userRole === "voter" && (
          <VoterView
            currentPhase={currentPhase}
            walletAddress={walletAddress}
            hasVoted={hasVoted}
            setHasVoted={setHasVoted}
          />
        )}
        {userRole === "public" && <PublicView currentPhase={currentPhase} />}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            {"Coblos.in - Secure, Transparent, Decentralized Student Voting"} {" • "} {"Powered by Blockchain"}
          </p>
        </div>
      </footer>
    </div>
  )
}
