"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { COBLOSIN_ADDRESS, COBLOSIN_ABI } from "@/lib/contract-config"

export default function PanitiaView() {
  const [namaKandidat, setNamaKandidat] = useState("")
  const [profilHash, setProfilHash] = useState("")
  const [addressPemilih, setAddressPemilih] = useState("")
  const [currentPhase, setCurrentPhase] = useState("0")
  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    loadAdminData()
  }, [])

  async function loadAdminData() {
    if (!window.ethereum) return
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(COBLOSIN_ADDRESS, COBLOSIN_ABI, provider)
    
    const phase = await contract.faseSaatIni()
    setCurrentPhase(phase.toString())

    const count = await contract.getJumlahKandidat()
    const items = []
    for (let i = 0; i < count; i++) {
      const item = await contract.daftarKandidat(i)
      items.push(item)
    }
    setCandidates(items)
  }

  async function handleAddCandidate() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(COBLOSIN_ADDRESS, COBLOSIN_ABI, signer)

    try {
      // Konversi string profil ke bytes32 hash
      const hash = ethers.id(profilHash) 
      const tx = await contract.tambahKandidat(namaKandidat, hash)
      await tx.wait()
      alert("Kandidat berhasil ditambahkan!")
      loadAdminData()
    } catch (error) {
      alert("Gagal: Pastikan Anda Panitia dan fase berada di SETUP")
    }
  }

  async function handleVerifyVoter() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(COBLOSIN_ADDRESS, COBLOSIN_ABI, signer)

    try {
      const tx = await contract.verifikasiPemilih(addressPemilih)
      await tx.wait()
      alert("Pemilih berhasil diverifikasi!")
    } catch (error) {
      alert("Gagal verifikasi")
    }
  }

  async function handleUpdatePhase(newPhase: string) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(COBLOSIN_ADDRESS, COBLOSIN_ABI, signer)

    try {
      const tx = await contract.gantiFase(newPhase)
      await tx.wait()
      setCurrentPhase(newPhase)
      alert("Fase pemilihan diperbarui!")
    } catch (error) {
      alert("Gagal update fase")
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Kontrol Fase Pemilihan</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Pilih Fase Aktif</Label>
            <Select onValueChange={handleUpdatePhase} value={currentPhase}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">SETUP (Tambah Kandidat)</SelectItem>
                <SelectItem value="1">REGISTRASI (Verifikasi Pemilih)</SelectItem>
                <SelectItem value="2">VOTING (Mulai Mencoblos)</SelectItem>
                <SelectItem value="3">SELESAI (Lihat Hasil)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Verifikasi Pemilih (Whitelist)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Wallet Address Mahasiswa</Label>
            <Input 
              placeholder="0x..." 
              value={addressPemilih} 
              onChange={(e) => setAddressPemilih(e.target.value)} 
            />
          </div>
          <Button className="w-full" onClick={handleVerifyVoter}>Verifikasi Mahasiswa</Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader><CardTitle>Tambah Kandidat Baru</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Kandidat</Label>
              <Input value={namaKandidat} onChange={(e) => setNamaKandidat(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Visi & Misi (Akan di-hash)</Label>
              <Input value={profilHash} onChange={(e) => setProfilHash(e.target.value)} />
            </div>
          </div>
          <Button className="w-full" onClick={handleAddCandidate}>Daftarkan Kandidat ke Blockchain</Button>
        </CardContent>
      </Card>
    </div>
  )
}