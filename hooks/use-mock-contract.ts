"use client"

import { useState, useEffect } from "react"

export type ElectionStatus = "not-started" | "active" | "ended"

export interface CandidateProfile {
  fotoUrl: string
  biodata: string
  visiMisi: string
  programKerja: string
}

export interface Candidate {
  id: number
  name: string
  hashProfil: string // IPFS hash
  profile: CandidateProfile // Resolved from IPFS
  votes: number
}

export const ADMIN_ADDRESS = "0xAdmin123456789abcdef"

export function useMockContract() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      hashProfil: "QmX1234...",
      profile: {
        fotoUrl: "/professional-student-leader-portrait.jpg",
        biodata:
          "Senior in Political Science with 3 years of student government experience. Passionate about creating an inclusive campus environment.",
        visiMisi:
          "Vision: A campus where every student voice matters. Mission: Establish transparent communication channels between students and administration, implement eco-friendly campus initiatives, and increase funding for student organizations by 30%.",
        programKerja:
          "1. Launch monthly town halls with administration\n2. Implement campus-wide recycling program\n3. Create emergency fund for students in financial distress\n4. Establish mental health awareness week\n5. Improve campus Wi-Fi infrastructure",
      },
      votes: 0,
    },
    {
      id: 2,
      name: "Michael Chen",
      hashProfil: "QmY5678...",
      profile: {
        fotoUrl: "/asian-student-leader-portrait.jpg",
        biodata:
          "Computer Science major and president of Tech Innovation Club. Focused on modernizing campus systems and student engagement.",
        visiMisi:
          "Vision: A technologically advanced campus that prepares students for the future. Mission: Digitize student services, expand STEM opportunities, and create partnerships with tech companies for internships.",
        programKerja:
          "1. Develop mobile app for campus services\n2. Host quarterly hackathons and tech workshops\n3. Establish coding bootcamp for non-CS majors\n4. Secure partnerships with 5+ tech companies\n5. Upgrade computer labs with latest hardware",
      },
      votes: 0,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      hashProfil: "QmZ9abc...",
      profile: {
        fotoUrl: "/latina-student-leader-portrait.jpg",
        biodata:
          "Business Administration student and founder of the Campus Diversity Initiative. Committed to equity, inclusion, and student wellness.",
        visiMisi:
          "Vision: A diverse, equitable, and supportive campus community. Mission: Champion diversity initiatives, improve mental health resources, and ensure all students have equal access to opportunities.",
        programKerja:
          "1. Double funding for diversity and inclusion programs\n2. Establish 24/7 mental health hotline\n3. Create scholarship fund for underrepresented students\n4. Host cultural awareness events monthly\n5. Implement bias training for faculty and staff",
      },
      votes: 0,
    },
  ])

  const [electionStatus, setElectionStatus] = useState<ElectionStatus>("active")
  const [hasVoted, setHasVoted] = useState(false)
  const [totalVoters, setTotalVoters] = useState(150)
  const [totalVotes, setTotalVotes] = useState(87)
  const [startTime, setStartTime] = useState<Date>(new Date(Date.now() - 1000 * 60 * 60 * 24))
  const [endTime, setEndTime] = useState<Date>(new Date(Date.now() + 1000 * 60 * 60 * 24 * 2))

  const [registeredVoters, setRegisteredVoters] = useState<string[]>([
    "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      if (startTime && endTime) {
        if (now < startTime.getTime()) {
          setElectionStatus("not-started")
        } else if (now >= startTime.getTime() && now <= endTime.getTime()) {
          setElectionStatus("active")
        } else {
          setElectionStatus("ended")
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, endTime])

  const voteForCandidate = (candidateId: number) => {
    setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)))
    setHasVoted(true)
    setTotalVotes((prev) => prev + 1)
  }

  const addCandidate = (name: string, hashProfil: string, profile: CandidateProfile) => {
    const newId = Math.max(...candidates.map((c) => c.id), 0) + 1
    setCandidates((prev) => [...prev, { id: newId, name, hashProfil, profile, votes: 0 }])
  }

  const removeCandidate = (id: number) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id))
  }

  const registerVoters = (addresses: string[]) => {
    setRegisteredVoters((prev) => [...prev, ...addresses])
    setTotalVoters((prev) => prev + addresses.length)
  }

  const setVotingPeriod = (start: Date, end: Date) => {
    setStartTime(start)
    setEndTime(end)
  }

  const isRegisteredVoter = (address: string) => {
    return registeredVoters.includes(address)
  }

  return {
    candidates,
    electionStatus,
    hasVoted,
    totalVoters,
    totalVotes,
    startTime,
    endTime,
    registeredVoters,
    voteForCandidate,
    addCandidate,
    removeCandidate,
    registerVoters,
    setVotingPeriod,
    isRegisteredVoter,
  }
}
