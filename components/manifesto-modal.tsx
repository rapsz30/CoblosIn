"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Candidate } from "@/hooks/use-mock-contract"
import { User, Target, Briefcase } from "lucide-react"

interface ManifestoModalProps {
  candidate: Candidate | null
  isOpen: boolean
  onClose: () => void
}

export function ManifestoModal({ candidate, isOpen, onClose }: ManifestoModalProps) {
  if (!candidate) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{candidate.name}</DialogTitle>
          <DialogDescription>
            {"Candidate Manifesto • ID: "}
            {candidate.id}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {/* Photo */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
              <img
                src={candidate.profile.fotoUrl || "/placeholder.svg"}
                alt={candidate.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Biodata */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{"Biodata"}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{candidate.profile.biodata}</p>
            </div>

            <Separator />

            {/* Vision & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{"Vision & Mission"}</h3>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-foreground leading-relaxed whitespace-pre-line">{candidate.profile.visiMisi}</p>
              </div>
            </div>

            <Separator />

            {/* Work Programs */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{"Work Programs"}</h3>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground leading-relaxed whitespace-pre-line">{candidate.profile.programKerja}</p>
              </div>
            </div>

            {/* IPFS Hash Badge */}
            <div className="pt-2">
              <Badge variant="outline" className="font-mono text-xs">
                {"IPFS: "}
                {candidate.hashProfil}
              </Badge>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
