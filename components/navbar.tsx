"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Vote, Wallet } from "lucide-react"
import { useMockContract } from "@/hooks/use-mock-contract"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const { electionStatus } = useMockContract()

  const handleConnectWallet = () => {
    if (walletConnected) {
      setWalletConnected(false)
      setWalletAddress("")
    } else {
      // Simulate wallet connection
      const mockAddress =
        "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6)
      setWalletAddress(mockAddress)
      setWalletConnected(true)
    }
  }

  const getStatusConfig = () => {
    switch (electionStatus) {
      case "not-started":
        return {
          label: "Voting Not Started",
          className: "bg-secondary text-secondary-foreground",
          pulse: false,
        }
      case "active":
        return {
          label: "Voting Active",
          className: "bg-success text-success-foreground pulse-green",
          pulse: true,
        }
      case "ended":
        return {
          label: "Voting Ended",
          className: "bg-destructive text-destructive-foreground",
          pulse: false,
        }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Vote className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-foreground">{"CoblosIn"}</span>
          </div>

          {/* Status Badge */}
          <Badge className={cn("px-4 py-2 text-sm font-medium", statusConfig.className)}>{statusConfig.label}</Badge>

          {/* Connect Wallet Button */}
          <Button onClick={handleConnectWallet} variant={walletConnected ? "outline" : "default"} className="gap-2">
            <Wallet className="h-4 w-4" />
            {walletConnected ? walletAddress : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </nav>
  )
}
