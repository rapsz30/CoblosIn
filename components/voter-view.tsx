"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, User, Fingerprint, Clock } from "lucide-react"
import { COBLOSIN_ADDRESS, COBLOSIN_ABI } from "@/lib/contract-config"

interface Candidate {
  id: number
  nama: string
  hashProfil: string
  jumlahSuara: number
}

// Interface untuk Props (Solusi Error Poin 2)
interface VoterViewProps {
  currentPhase: string;
  walletAddress: string;
  hasVoted: boolean;
  setHasVoted: (voted: boolean) => void;
}

export default function VoterView({ 
  currentPhase, 
  walletAddress, 
  hasVoted, 
  setHasVoted 
}: VoterViewProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isEligible, setIsEligible] = useState(false)
  const [receipt, setReceipt] = useState("")
  const [loading, setLoading] = useState(true)
  const [votingStatus, setVotingStatus] = useState(0)

  useEffect(() => {
    loadVoterData()
  }, [walletAddress]) // Reload jika wallet berubah

  async function loadVoterData() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(COBLOSIN_ADDRESS, COBLOSIN_ABI, provider)
        const userAddress = await signer.getAddress()

        const voterInfo = await contract.dataPemilih(userAddress)
        const phaseOnChain = await contract.faseSaatIni()
        
        setIsEligible(voterInfo.isTerverifikasi)
        setHasVoted(voterInfo.sudahMemilih)
        setReceipt(voterInfo.voteReceipt)
        setVotingStatus(Number(phaseOnChain))

        const count = await contract.getJumlahKandidat()
        const items: Candidate[] = []
        for (let i = 0; i < Number(count); i++) {
          const item = await contract.daftarKandidat(i)
          items.push({
            id: Number(item.id),
            nama: item.nama,
            hashProfil: item.hashProfil,
            jumlahSuara: Number(item.jumlahSuara)
          })
        }
        setCandidates(items)
      } catch (error) {
        console.error("Gagal memuat data:", error)
      } finally {
        setLoading(false)
      }
    } else {
        setLoading(false)
    }
  }

  async function handleVote(id: number) {
    if (!window.ethereum) return
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(COBLOSIN_ADDRESS, COBLOSIN_ABI, signer)

      const tx = await contract.pilihKandidat(id)
      await tx.wait()
      alert("Suara berhasil direkam!")
      setHasVoted(true) // Update status di parent (page.tsx)
      loadVoterData()
    } catch (error: any) {
      alert("Gagal mencoblos: " + (error.reason || error.message))
    }
  }

  if (loading) return <div className="p-8 text-center">Menghubungkan ke Blockchain...</div>
  if (typeof window !== "undefined" && !window.ethereum) return <div className="p-8 text-center">Silakan install MetaMask.</div>

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Alert variant={isEligible ? "default" : "destructive"}>
          <User className="h-4 w-4" />
          <AlertTitle>Status Verifikasi</AlertTitle>
          <AlertDescription>
            {isEligible ? "Akun Anda terverifikasi sebagai pemilih sah." : "Anda belum diverifikasi oleh Panitia."}
          </AlertDescription>
        </Alert>
        
        {hasVoted && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Sudah Memilih</AlertTitle>
            <AlertDescription className="text-green-700">
              Hak suara Anda telah digunakan. Receipt: {receipt.substring(0, 20)}...
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Cek apakah fase contract adalah VOTING (index 2) */}
      {votingStatus !== 2 ? (
        <div className="p-12 text-center border-2 border-dashed rounded-xl">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Voting Belum Dibuka</h3>
          <p className="text-muted-foreground">Silakan tunggu hingga Panitia mengaktifkan fase VOTING.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {candidates.map((c) => (
            <Card key={c.id} className={hasVoted ? "opacity-75" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline">Kandidat #{c.id + 1}</Badge>
                  <Fingerprint className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="mt-2">{c.nama}</CardTitle>
                <CardDescription>Profil Hash: {c.hashProfil.substring(0, 15)}...</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={hasVoted || !isEligible}
                  onClick={() => handleVote(c.id)}
                >
                  {hasVoted ? "Sudah Memilih" : "Pilih Sekarang"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}