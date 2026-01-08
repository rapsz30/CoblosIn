"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Vote, Shield, Lock } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { ADMIN_ADDRESS } from "@/hooks/use-mock-contract"

interface LandingPageProps {
  onConnect: (address: string) => void
}

export function LandingPage({ onConnect }: LandingPageProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock: Randomly assign admin or voter address
    const addresses = [
      ADMIN_ADDRESS,
      "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
      "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    ]

    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)]
    onConnect(randomAddress)
    setIsConnecting(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img src="/coblosin-logo.png" alt="CoblosIn" className="h-10 w-auto" />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full space-y-12">
          {/* Hero Content */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Vote className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-foreground text-balance">{"Campus Elections on the Blockchain"}</h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              {"Cast your vote securely, transparently, and anonymously using blockchain technology"}
            </p>

            <div className="pt-4">
              <Button onClick={handleConnectWallet} disabled={isConnecting} size="lg" className="text-lg px-8 py-6">
                {isConnecting ? (
                  <>
                    <Spinner className="mr-2 h-5 w-5" />
                    {"Connecting..."}
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-5 w-5" />
                    {"Connect Wallet to Vote"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <Card>
              <CardContent className="pt-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
                  <Lock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">{"Secure Voting"}</h3>
                <p className="text-sm text-muted-foreground">
                  {"Your vote is encrypted and stored on the blockchain, ensuring maximum security"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">{"Transparent"}</h3>
                <p className="text-sm text-muted-foreground">
                  {"All votes are publicly verifiable on the blockchain while maintaining voter anonymity"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
                  <Vote className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">{"One Vote Only"}</h3>
                <p className="text-sm text-muted-foreground">
                  {"Smart contracts ensure each registered voter can only cast one vote"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          {"Powered by blockchain technology • Secure • Transparent • Verifiable"}
        </div>
      </footer>
    </div>
  )
}
