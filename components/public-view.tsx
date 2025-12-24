"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Search, CheckCircle2, XCircle, AlertCircle, Trophy, Users } from "lucide-react"

type Phase = "Setup" | "Registration" | "Voting" | "Counting" | "Ended"

interface PublicViewProps {
  currentPhase: Phase
}

const results = [
  { id: 1, name: "Ahmad Santoso", votes: 456, percentage: 38.4 },
  { id: 2, name: "Siti Nurhaliza", votes: 512, percentage: 43.1 },
  { id: 3, name: "Budi Prasetyo", votes: 221, percentage: 18.5 },
]

export function PublicView({ currentPhase }: PublicViewProps) {
  const [verifyAddress, setVerifyAddress] = useState("")
  const [verifyHash, setVerifyHash] = useState("")
  const [verificationResult, setVerificationResult] = useState<"valid" | "invalid" | null>(null)

  const handleVerify = () => {
    // Simulate verification
    if (verifyAddress && verifyHash) {
      setVerificationResult(verifyHash.length === 66 ? "valid" : "invalid")
    }
  }

  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0)
  const winner = results.reduce((max, r) => (r.votes > max.votes ? r : max), results[0])
  const showResults = currentPhase === "Counting" || currentPhase === "Ended"

  return (
    <div className="space-y-6">
      {/* Results Section */}
      {showResults ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <CardTitle>{"Real-time Election Results"}</CardTitle>
              </div>
              <CardDescription>{"Transparent and immutable vote counts from the blockchain"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Winner Highlight */}
              {currentPhase === "Ended" && (
                <Alert className="border-secondary bg-secondary/10">
                  <Trophy className="h-4 w-4 text-secondary" />
                  <AlertDescription>
                    <span className="font-semibold text-secondary">{winner.name}</span>
                    {" wins with "}
                    {winner.votes}
                    {" votes ("}
                    {winner.percentage}
                    {"%)"}
                  </AlertDescription>
                </Alert>
              )}

              {/* Vote Counts */}
              <div className="space-y-4">
                {results.map((candidate, index) => (
                  <div key={candidate.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {candidate.votes}
                            {" votes"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {candidate.percentage}
                          {"%"}
                        </p>
                      </div>
                    </div>
                    <Progress value={candidate.percentage} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Total Stats */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{"Total Votes Cast"}</span>
                </div>
                <span className="text-2xl font-bold">{totalVotes}</span>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {"Election results will be visible once the counting phase begins. Current phase: "}
            {currentPhase}
          </AlertDescription>
        </Alert>
      )}

      {/* Verify Vote Tool */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <CardTitle>{"Verify Your Vote"}</CardTitle>
          </div>
          <CardDescription>
            {"Check the validity of any vote using the voter address and transaction hash"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="verify-address">{"Voter Wallet Address"}</Label>
              <Input
                id="verify-address"
                placeholder="0x..."
                value={verifyAddress}
                onChange={(e) => setVerifyAddress(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="verify-hash">{"Vote Transaction Hash"}</Label>
              <Input
                id="verify-hash"
                placeholder="0x..."
                value={verifyHash}
                onChange={(e) => setVerifyHash(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <Button onClick={handleVerify} className="gap-2">
              <Search className="h-4 w-4" />
              {"Verify Vote"}
            </Button>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <Alert
              className={
                verificationResult === "valid"
                  ? "border-secondary bg-secondary/10"
                  : "border-destructive bg-destructive/10"
              }
            >
              {verificationResult === "valid" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <AlertDescription className="text-secondary">
                    {"✓ Valid Vote - This vote has been verified on the blockchain"}
                  </AlertDescription>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    {"✗ Invalid Vote - This vote could not be verified on the blockchain"}
                  </AlertDescription>
                </>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Blockchain Info */}
      <Card>
        <CardHeader>
          <CardTitle>{"Blockchain Transparency"}</CardTitle>
          <CardDescription>{"All votes are permanently recorded on the blockchain"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{"Smart Contract:"}</span>
              <span className="font-mono">{"0x742d...bEb"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{"Network:"}</span>
              <span>{"Ethereum Sepolia Testnet"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{"Block Height:"}</span>
              <span className="font-mono">{"4,523,891"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
