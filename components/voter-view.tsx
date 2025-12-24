"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Vote, Receipt, AlertCircle, FileText, Droplet } from "lucide-react"

type Phase = "Setup" | "Registration" | "Voting" | "Counting" | "Ended"

interface VoterViewProps {
  currentPhase: Phase
  walletAddress: string
  hasVoted: boolean
  setHasVoted: (voted: boolean) => void
}

const candidates = [
  {
    id: 1,
    name: "Ahmad Santoso",
    hash: "QmX4e...8f3a",
    vision: "Meningkatkan fasilitas kampus dan teknologi pembelajaran untuk mendukung pendidikan berkualitas",
    mission: "Menyediakan akses internet gratis, modernisasi ruang kelas, dan platform e-learning yang efektif",
    photo: "/professional-male-student-candidate.jpg",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    hash: "QmY5f...9g4b",
    vision: "Fokus pada kesejahteraan mahasiswa dan program beasiswa untuk semua kalangan",
    mission: "Memperluas akses beasiswa, layanan konseling gratis, dan program bantuan biaya hidup mahasiswa",
    photo: "/professional-female-student-candidate.jpg",
  },
  {
    id: 3,
    name: "Budi Prasetyo",
    hash: "QmZ6g...0h5c",
    vision: "Pengembangan soft skills dan kewirausahaan mahasiswa untuk masa depan yang lebih baik",
    mission: "Workshop gratis, mentoring bisnis, inkubator startup mahasiswa, dan networking industry",
    photo: "/professional-male-business-student.jpg",
  },
]

export function VoterView({ currentPhase, walletAddress, hasVoted, setHasVoted }: VoterViewProps) {
  const [voteReceipt, setVoteReceipt] = useState<string | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)

  const handleVote = (candidateId: number) => {
    const receipt = `0x${Math.random().toString(16).substr(2, 64)}`
    setSelectedCandidate(candidateId)
    setHasVoted(true)
    setVoteReceipt(receipt)
  }

  if (currentPhase !== "Voting") {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {currentPhase === "Setup" && "Voting has not started yet. Please wait for the voting period to begin."}
          {currentPhase === "Registration" && "Currently in registration phase. Voting will begin soon."}
          {currentPhase === "Counting" && "Voting has ended. Results are being counted."}
          {currentPhase === "Ended" && "Election has ended. Check the Public Transparency page for results."}
        </AlertDescription>
      </Alert>
    )
  }

  if (hasVoted && voteReceipt) {
    return (
      <div className="space-y-6">
        <Alert className="border-secondary bg-secondary/10">
          <Droplet className="h-4 w-4 text-secondary" />
          <AlertDescription className="text-secondary font-medium">
            {"✓ Anda telah memberikan suara! Tangan Anda telah ditandai dengan tinta digital."}
          </AlertDescription>
        </Alert>

        <Card className="border-secondary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-secondary" />
              <CardTitle>{"Vote Receipt (Bukti Pemilihan)"}</CardTitle>
            </div>
            <CardDescription>{"Bukti permanen pemilihan Anda di blockchain"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">{"Transaction Hash:"}</span>
              </div>
              <div className="rounded-lg bg-muted p-4 font-mono text-sm break-all">{voteReceipt}</div>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">{"Voter Address:"}</span>
              <div className="rounded-lg bg-muted p-4 font-mono text-sm">{walletAddress}</div>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">{"Anda Memilih:"}</span>
              <div className="rounded-lg bg-muted p-4">
                <p className="font-medium">{candidates.find((c) => c.id === selectedCandidate)?.name}</p>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {"Simpan bukti ini. Anda dapat memverifikasi suara Anda di halaman Public Transparency."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">{"Pilih Kandidat Anda"}</h2>
        <p className="text-muted-foreground">
          {
            "Pilih satu kandidat untuk memberikan suara Anda. Keputusan ini bersifat permanen dan akan dicatat di blockchain."
          }
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="flex flex-col">
            <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
              <img
                src={candidate.photo || "/placeholder.svg"}
                alt={candidate.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{candidate.name}</CardTitle>
              <Badge variant="outline" className="w-fit font-mono text-xs">
                {candidate.hash}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <div className="mb-4 flex-1 space-y-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{"Visi:"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{candidate.vision}</p>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-semibold">{"Misi:"}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{candidate.mission}</p>
                </div>
              </div>
              <Button onClick={() => handleVote(candidate.id)} className="w-full gap-2">
                <Vote className="h-4 w-4" />
                {"Pilih "}
                {candidate.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
