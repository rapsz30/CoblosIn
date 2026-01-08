"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  CheckCircle,
  Clock,
  UserPlus,
  CalendarClock,
  Trash2,
  LogOut,
  Shield,
  Upload,
  FileCheck,
  AlertCircle,
} from "lucide-react"
import { useMockContract, type CandidateProfile } from "@/hooks/use-mock-contract"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { CsvUploadZone } from "@/components/csv-upload-zone"

interface AdminViewProps {
  walletAddress: string
  onDisconnect: () => void
}

export function AdminView({ walletAddress, onDisconnect }: AdminViewProps) {
  const {
    candidates,
    totalVoters,
    totalVotes,
    electionStatus,
    addCandidate,
    registerVoters,
    setVotingPeriod,
    removeCandidate,
  } = useMockContract()
  const { toast } = useToast()

  // Candidate form state - Manual Entry
  const [candidateName, setCandidateName] = useState("")
  const [fotoUrl, setFotoUrl] = useState("")
  const [biodata, setBiodata] = useState("")
  const [visiMisi, setVisiMisi] = useState("")
  const [programKerja, setProgramKerja] = useState("")
  const [addingCandidate, setAddingCandidate] = useState(false)

  const [directHashName, setDirectHashName] = useState("")
  const [directHash, setDirectHash] = useState("")
  const [addingDirectCandidate, setAddingDirectCandidate] = useState(false)

  // Voting period state
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [settingPeriod, setSettingPeriod] = useState(false)

  const handleAddCandidateManual = async () => {
    if (!candidateName.trim()) {
      toast({
        title: "Error",
        description: "Please enter candidate name",
        variant: "destructive",
      })
      return
    }

    if (!biodata.trim() || !visiMisi.trim() || !programKerja.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all candidate profile fields",
        variant: "destructive",
      })
      return
    }

    setAddingCandidate(true)

    // Simulate IPFS upload to Pinata
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const profile: CandidateProfile = {
      fotoUrl: fotoUrl || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(candidateName)}`,
      biodata,
      visiMisi,
      programKerja,
    }

    // Simulate generated IPFS hash
    const generatedHash = `QmPinata${Math.random().toString(36).substring(2, 15)}...`

    addCandidate(candidateName, generatedHash, profile)

    // Reset form
    setCandidateName("")
    setFotoUrl("")
    setBiodata("")
    setVisiMisi("")
    setProgramKerja("")
    setAddingCandidate(false)

    toast({
      title: "Success",
      description: `Candidate added with IPFS hash: ${generatedHash}`,
    })
  }

  const handleAddCandidateDirect = async () => {
    if (!directHashName.trim() || !directHash.trim()) {
      toast({
        title: "Error",
        description: "Please enter both candidate name and IPFS hash",
        variant: "destructive",
      })
      return
    }

    setAddingDirectCandidate(true)

    // Simulate fetching from IPFS
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock profile data from IPFS
    const profile: CandidateProfile = {
      fotoUrl: `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(directHashName)}`,
      biodata: "Profile fetched from IPFS hash",
      visiMisi: "Vision and mission retrieved from decentralized storage",
      programKerja: "Work programs loaded from IPFS",
    }

    addCandidate(directHashName, directHash, profile)

    // Reset form
    setDirectHashName("")
    setDirectHash("")
    setAddingDirectCandidate(false)

    toast({
      title: "Success",
      description: "Candidate added from IPFS hash",
    })
  }

  const handleSetPeriod = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please set both start and end dates",
        variant: "destructive",
      })
      return
    }

    setSettingPeriod(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setVotingPeriod(new Date(startDate), new Date(endDate))
    setSettingPeriod(false)

    toast({
      title: "Success",
      description: "Voting period set successfully",
    })
  }

  const handleRemoveCandidate = async (id: number) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    removeCandidate(id)
    toast({
      title: "Success",
      description: "Candidate removed",
    })
  }

  const handleVotersUploaded = async (addresses: string[]) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    registerVoters(addresses)

    toast({
      title: "Success",
      description: `${addresses.length} voters registered on blockchain`,
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
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src="/coblosin-logo.png" alt="CoblosIn" className="h-8 w-auto" />
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">{"Admin Panel"}</span>
              </div>
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
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{"Total Voters Registered"}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalVoters}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{"Total Votes Cast"}</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{totalVotes}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{"Voter Turnout"}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0}
                  {"%"}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                {"Candidate Management"}
              </CardTitle>
              <CardDescription>{"Add candidates using manual entry or direct IPFS hash"}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="manual">{"Manual Entry"}</TabsTrigger>
                  <TabsTrigger value="direct">{"Direct Hash (Advanced)"}</TabsTrigger>
                </TabsList>

                {/* Manual Entry Mode */}
                <TabsContent value="manual" className="space-y-6">
                  <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4">
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{"Auto-IPFS Integration"}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {
                            "This information will be automatically packaged into JSON and uploaded to IPFS (Pinata) upon submission"
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{"Candidate Name"}</Label>
                        <Input
                          id="name"
                          placeholder="Enter candidate name"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fotoUrl">{"Photo URL (optional)"}</Label>
                        <Input
                          id="fotoUrl"
                          placeholder="Enter image URL or leave blank"
                          value={fotoUrl}
                          onChange={(e) => setFotoUrl(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="biodata">{"Biodata"}</Label>
                      <Textarea
                        id="biodata"
                        placeholder="Brief background and experience of the candidate"
                        rows={3}
                        value={biodata}
                        onChange={(e) => setBiodata(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visiMisi">{"Vision & Mission"}</Label>
                      <Textarea
                        id="visiMisi"
                        placeholder="Candidate's vision and mission statement"
                        rows={4}
                        value={visiMisi}
                        onChange={(e) => setVisiMisi(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="programKerja">{"Work Programs"}</Label>
                      <Textarea
                        id="programKerja"
                        placeholder="Detailed work programs and initiatives"
                        rows={5}
                        value={programKerja}
                        onChange={(e) => setProgramKerja(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleAddCandidateManual} disabled={addingCandidate} className="w-full">
                      {addingCandidate ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          {"Uploading to IPFS & Adding..."}
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          {"Generate IPFS Hash & Add Candidate"}
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                {/* Direct Hash Mode */}
                <TabsContent value="direct" className="space-y-6">
                  <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{"Advanced Mode"}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {"Use this if you have already uploaded the candidate profile JSON to IPFS manually"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="directName">{"Candidate Name"}</Label>
                      <Input
                        id="directName"
                        placeholder="Enter candidate name"
                        value={directHashName}
                        onChange={(e) => setDirectHashName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="directHash">{"IPFS Hash"}</Label>
                      <Input
                        id="directHash"
                        placeholder="Qm..."
                        className="font-mono text-sm"
                        value={directHash}
                        onChange={(e) => setDirectHash(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        {"The hash should point to a JSON file containing fotoUrl, biodata, visiMisi, and programKerja"}
                      </p>
                    </div>

                    <Button
                      onClick={handleAddCandidateDirect}
                      disabled={addingDirectCandidate}
                      className="w-full"
                      variant="secondary"
                    >
                      {addingDirectCandidate ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          {"Fetching from IPFS..."}
                        </>
                      ) : (
                        <>
                          <FileCheck className="mr-2 h-4 w-4" />
                          {"Add Candidate from IPFS Hash"}
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Existing Candidates */}
              {candidates.length > 0 && (
                <div className="space-y-3 mt-6 pt-6 border-t">
                  <Label>{"Existing Candidates"}</Label>
                  <div className="space-y-2">
                    {candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={candidate.profile.fotoUrl || "/placeholder.svg"}
                            alt={candidate.name}
                            className="h-12 w-12 rounded object-cover bg-muted"
                          />
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {"ID: "}
                              {candidate.id}
                              {" • Votes: "}
                              {candidate.votes}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveCandidate(candidate.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20">
            <CardHeader className="bg-accent/5">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                {"Voter Management"}
              </CardTitle>
              <CardDescription>{"Register wallet addresses for voting eligibility via CSV upload"}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <CsvUploadZone onVotersUploaded={handleVotersUploaded} />
            </CardContent>
          </Card>

          {/* Election Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                {"Election Control"}
              </CardTitle>
              <CardDescription>{"Set the voting period for the election"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{"Start Date & Time"}</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">{"End Date & Time"}</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleSetPeriod} disabled={settingPeriod} className="w-full">
                {settingPeriod ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    {"Setting..."}
                  </>
                ) : (
                  <>
                    <CalendarClock className="mr-2 h-4 w-4" />
                    {"Set Voting Period"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
