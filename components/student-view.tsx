"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, User, LogOut, FileText } from "lucide-react"
import { useMockContract } from "@/hooks/use-mock-contract"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { ManifestoModal } from "@/components/manifesto-modal"
import type { Candidate } from "@/hooks/use-mock-contract"

interface StudentViewProps {
  walletAddress: string
  onDisconnect: () => void
}

export function StudentView({ walletAddress, onDisconnect }: StudentViewProps) {
  const { candidates, electionStatus, hasVoted, voteForCandidate, endTime } = useMockContract()
  const { toast } = useToast()
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 })
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  useEffect(() => {
    if (electionStatus === "active" && endTime) {
      const interval = setInterval(() => {
        const now = new Date().getTime()
        const distance = endTime.getTime() - now

        if (distance > 0) {
          setTimeRemaining({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          })
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [electionStatus, endTime])

  const handleVote = async (candidateId: number) => {
    if (hasVoted) {
      toast({
        title: "Error",
        description: "You have already voted",
        variant: "destructive",
      })
      return
    }

    setLoadingId(candidateId)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    voteForCandidate(candidateId)
    setLoadingId(null)

    toast({
      title: "Vote Submitted",
      description: "Your vote has been recorded on the blockchain",
    })
  }

  const getStatusBadge = () => {
    if (electionStatus === "not-started") {
      return (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          {"Voting Not Started"}
        </Badge>
      )
    } else if (electionStatus === "active") {
      return (
        <Badge className="bg-success text-success-foreground pulse-green">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-success-foreground" />
            {"Voting Active"}
          </div>
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive" className="bg-destructive text-destructive-foreground">
          {"Voting Ended"}
        </Badge>
      )
    }
  }

  return (
    <>
      {/* Top Bar */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/coblosin-logo.png" alt="CoblosIn" className="h-9 w-auto" />
              <div className="hidden md:block">
                <Badge variant="outline" className="font-mono text-xs">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {getStatusBadge()}
              <Button variant="outline" size="sm" onClick={onDisconnect}>
                <LogOut className="h-4 w-4 mr-2" />
                {"Disconnect"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground text-balance">
              {"Welcome, Student. Please cast your vote carefully."}
            </h1>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              {"Review each candidate's manifesto before making your decision"}
            </p>

            {/* Countdown Timer */}
            {electionStatus === "active" && (
              <Card className="max-w-md mx-auto bg-accent/10 border-accent">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-accent-foreground">
                    <Clock className="h-5 w-5" />
                    {"Time Remaining"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-accent-foreground">{timeRemaining.days}</div>
                      <div className="text-sm text-muted-foreground">{"Days"}</div>
                    </div>
                    <div className="text-3xl font-bold text-accent-foreground">{":"}</div>
                    <div>
                      <div className="text-3xl font-bold text-accent-foreground">{timeRemaining.hours}</div>
                      <div className="text-sm text-muted-foreground">{"Hours"}</div>
                    </div>
                    <div className="text-3xl font-bold text-accent-foreground">{":"}</div>
                    <div>
                      <div className="text-3xl font-bold text-accent-foreground">{timeRemaining.minutes}</div>
                      <div className="text-sm text-muted-foreground">{"Minutes"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {hasVoted && (
              <Badge className="bg-success text-success-foreground px-4 py-2">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {"You have voted"}
              </Badge>
            )}
          </div>

          {/* Candidates Grid */}
          {candidates.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{"No Candidates Yet"}</h3>
                <p className="text-muted-foreground">{"Waiting for admin to add candidates"}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <img
                      src={candidate.profile.fotoUrl || "/placeholder.svg"}
                      alt={candidate.name}
                      className="w-full h-48 object-cover bg-muted"
                    />
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <CardTitle className="text-xl mb-1">{candidate.name}</CardTitle>
                      <CardDescription>
                        {"Candidate ID: "}
                        {candidate.id}
                      </CardDescription>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {"View Manifesto"}
                      </Button>

                      <Button
                        onClick={() => handleVote(candidate.id)}
                        disabled={hasVoted || electionStatus !== "active" || loadingId !== null}
                        className="w-full"
                        variant={hasVoted ? "secondary" : "default"}
                      >
                        {loadingId === candidate.id ? (
                          <>
                            <Spinner className="mr-2 h-4 w-4" />
                            {"Submitting..."}
                          </>
                        ) : hasVoted ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {"Voted"}
                          </>
                        ) : (
                          "VOTE"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Manifesto Modal */}
      <ManifestoModal
        candidate={selectedCandidate}
        isOpen={selectedCandidate !== null}
        onClose={() => setSelectedCandidate(null)}
      />
    </>
  )
}
