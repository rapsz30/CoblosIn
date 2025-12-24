"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Vote,
  UserCheck,
  Activity,
  Plus,
  Calendar,
  Pause,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

type Phase = "Setup" | "Registration Candidate" | "Registration Voter" | "Voting" | "Counting" | "Ended"

interface PanitiaViewProps {
  currentPhase: Phase
  setCurrentPhase: (phase: Phase) => void
}

export function PanitiaView({ currentPhase, setCurrentPhase }: PanitiaViewProps) {
  const [currentSection, setCurrentSection] = useState<1 | 2 | 3>(1)
  const [candidateName, setCandidateName] = useState("")
  const [profileHash, setProfileHash] = useState("")
  const [voterName, setVoterName] = useState("")
  const [voterWallet, setVoterWallet] = useState("")
  const [votingStartDate, setVotingStartDate] = useState("")
  const [votingEndDate, setVotingEndDate] = useState("")
  const [candidates, setCandidates] = useState([
    { id: 1, name: "Ahmad Santoso", hash: "QmX4e...8f3a" },
    { id: 2, name: "Siti Nurhaliza", hash: "QmY5f...9g4b" },
    { id: 3, name: "Budi Prasetyo", hash: "QmZ6g...0h5c" },
  ])
  const [voters, setVoters] = useState([
    { id: 1, name: "Rina Wijaya", wallet: "0x1234...5678" },
    { id: 2, name: "Andi Saputra", wallet: "0x2345...6789" },
    { id: 3, name: "Dewi Lestari", wallet: "0x3456...7890" },
  ])

  const stats = {
    totalCandidates: candidates.length,
    totalEligibleVoters: voters.length,
    totalVotesCast:
      currentPhase === "Voting" ? 823 : currentPhase === "Counting" || currentPhase === "Ended" ? 1189 : 0,
  }

  const handleRegisterCandidate = () => {
    if (candidateName && profileHash) {
      setCandidates([
        ...candidates,
        {
          id: candidates.length + 1,
          name: candidateName,
          hash: profileHash,
        },
      ])
      setCandidateName("")
      setProfileHash("")
    }
  }

  const handleRegisterVoter = () => {
    if (voterName && voterWallet) {
      setVoters([
        ...voters,
        {
          id: voters.length + 1,
          name: voterName,
          wallet: voterWallet,
        },
      ])
      setVoterName("")
      setVoterWallet("")
    }
  }

  const handleNextToVoterRegistration = () => {
    setCurrentPhase("Registration Voter")
    setCurrentSection(2)
  }

  const handleBackToCandidateRegistration = () => {
    setCurrentPhase("Registration Candidate")
    setCurrentSection(1)
  }

  const handleNextToVotingSetup = () => {
    setCurrentPhase("Voting")
    setCurrentSection(3)
  }

  const handleBackToVoterRegistration = () => {
    setCurrentPhase("Registration Voter")
    setCurrentSection(2)
  }

  const handleActivateVoting = () => {
    setCurrentPhase("Voting")
    alert("Voting period activated!")
  }

  const handleEndElection = () => {
    setCurrentPhase("Ended")
    alert("Election has been officially ended. Results are now final and public.")
  }

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{"Current Phase"}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPhase}</div>
            <Badge variant={currentPhase === "Voting" ? "default" : "secondary"} className="mt-2">
              {currentPhase === "Voting" ? "Active" : "Inactive"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{"Total Candidates"}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">{"Registered candidates"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{"Eligible Voters"}</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEligibleVoters}</div>
            <p className="text-xs text-muted-foreground">{"Verified students"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{"Total Votes Cast"}</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotesCast}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalVotesCast > 0
                ? `${((stats.totalVotesCast / stats.totalEligibleVoters) * 100).toFixed(1)}% turnout`
                : "Waiting for votes"}
            </p>
          </CardContent>
        </Card>
      </div>

      {currentSection === 1 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{"Register New Candidate"}</CardTitle>
                <CardDescription>{"Step 1: Add candidates to the election ballot"}</CardDescription>
              </div>
              <Badge variant="secondary">{"Section 1 of 3"}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="candidate-name">{"Candidate Name"}</Label>
                <Input
                  id="candidate-name"
                  placeholder="Enter candidate full name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profile-hash">{"Off-chain Profile Hash"}</Label>
                <Input
                  id="profile-hash"
                  placeholder="Qm... (IPFS hash)"
                  value={profileHash}
                  onChange={(e) => setProfileHash(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRegisterCandidate} variant="outline" className="gap-2 flex-1 bg-transparent">
                  <Plus className="h-4 w-4" />
                  {"Save Candidate"}
                </Button>
                <Button onClick={handleNextToVoterRegistration} disabled={candidates.length === 0} className="gap-2">
                  {"Next: Register Voters"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Candidate List */}
            <div className="mt-6 space-y-2">
              <h4 className="text-sm font-medium">{"Registered Candidates (" + candidates.length + ")"}</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3"
                  >
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{candidate.hash}</p>
                    </div>
                    <Badge variant="outline">
                      {"ID: "}
                      {candidate.id}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentSection === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{"Register New Voter"}</CardTitle>
                <CardDescription>{"Step 2: Add eligible voters to the voting system"}</CardDescription>
              </div>
              <Badge variant="secondary">{"Section 2 of 3"}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="voter-name">{"Voter Name"}</Label>
                <Input
                  id="voter-name"
                  placeholder="Enter voter full name"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="voter-wallet">{"Wallet Address"}</Label>
                <Input
                  id="voter-wallet"
                  placeholder="0x..."
                  value={voterWallet}
                  onChange={(e) => setVoterWallet(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleBackToCandidateRegistration} variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  {"Back"}
                </Button>
                <Button onClick={handleRegisterVoter} variant="outline" className="gap-2 flex-1 bg-transparent">
                  <Plus className="h-4 w-4" />
                  {"Save Voter"}
                </Button>
                <Button onClick={handleNextToVotingSetup} disabled={voters.length === 0} className="gap-2">
                  {"Next: Setup Voting"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Voter List */}
            <div className="mt-6 space-y-2">
              <h4 className="text-sm font-medium">{"Registered Voters (" + voters.length + ")"}</h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {voters.map((voter) => (
                  <div
                    key={voter.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{voter.name}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{voter.wallet}</p>
                    </div>
                    <Badge variant="outline" className="ml-2 shrink-0">
                      {"#"}
                      {voter.id}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentSection === 3 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{"Activate Voting Period"}</CardTitle>
                <CardDescription>{"Step 3: Set voting schedule and begin the voting phase"}</CardDescription>
              </div>
              <Badge variant="secondary">{"Section 3 of 3"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">{"Start Date & Time"}</Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={votingStartDate}
                onChange={(e) => setVotingStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">{"End Date & Time"}</Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={votingEndDate}
                onChange={(e) => setVotingEndDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBackToVoterRegistration} variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                {"Back"}
              </Button>
              <Button
                disabled={!votingStartDate || !votingEndDate}
                className="flex-1 gap-2"
                onClick={handleActivateVoting}
              >
                <Calendar className="h-4 w-4" />
                {"Activate Voting Period"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentPhase === "Voting" && (
        <Card>
          <CardHeader>
            <CardTitle>{"Close Voting & Start Counting"}</CardTitle>
            <CardDescription>{"End the voting period and begin the counting phase"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setCurrentPhase("Counting")} variant="destructive" className="w-full gap-2">
              <Pause className="h-4 w-4" />
              {"Close Voting & Start Counting"}
            </Button>
          </CardContent>
        </Card>
      )}

      {currentPhase === "Counting" && (
        <Card>
          <CardHeader>
            <CardTitle>{"Finalize Election Results"}</CardTitle>
            <CardDescription>{"Officially end the election and publish final results"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleEndElection} className="w-full gap-2">
              <CheckCircle className="h-4 w-4" />
              {"End Election & Publish Results"}
            </Button>
          </CardContent>
        </Card>
      )}

      {currentPhase === "Ended" && (
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-secondary">{"Election Completed"}</CardTitle>
            <CardDescription>{"The election has been successfully completed and results are final"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-secondary/10 p-4">
                <div className="flex items-center gap-2 text-secondary">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">{"All results are now public and immutable on the blockchain"}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{"Total Candidates:"}</span>
                  <span className="font-medium">{stats.totalCandidates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{"Total Voters:"}</span>
                  <span className="font-medium">{stats.totalEligibleVoters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{"Total Votes Cast:"}</span>
                  <span className="font-medium">{stats.totalVotesCast}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{"Voter Turnout:"}</span>
                  <span className="font-medium">
                    {((stats.totalVotesCast / stats.totalEligibleVoters) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
