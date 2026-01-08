"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

interface CsvUploadZoneProps {
  onVotersUploaded: (addresses: string[]) => Promise<void>
}

export function CsvUploadZone({ onVotersUploaded }: CsvUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [validAddresses, setValidAddresses] = useState<string[]>([])
  const [invalidCount, setInvalidCount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAddress = (address: string): boolean => {
    const trimmed = address.trim()
    return trimmed.startsWith("0x") && trimmed.length >= 10
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setUploadedFile(file)

    // Simulate file processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const text = await file.text()
    const lines = text
      .split(/[\n,]/)
      .map((line) => line.trim())
      .filter((line) => line)

    const valid: string[] = []
    let invalid = 0

    lines.forEach((line) => {
      if (validateAddress(line)) {
        valid.push(line)
      } else {
        invalid++
      }
    })

    setValidAddresses(valid)
    setInvalidCount(invalid)
    setIsProcessing(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      processFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleRegister = async () => {
    if (validAddresses.length === 0) return

    setIsRegistering(true)
    await onVotersUploaded(validAddresses)

    // Reset state
    setUploadedFile(null)
    setValidAddresses([])
    setInvalidCount(0)
    setIsRegistering(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleReset = () => {
    setUploadedFile(null)
    setValidAddresses([])
    setInvalidCount(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (uploadedFile && !isProcessing) {
    return (
      <div className="space-y-4">
        <Card className="p-6 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-accent/10 p-3">
              <FileSpreadsheet className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="font-medium text-foreground mb-1">{uploadedFile.name}</h4>
                <p className="text-sm text-muted-foreground">{"CSV file processed successfully"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-medium text-success">{validAddresses.length}</span>
                  <span className="text-muted-foreground">{"Valid Addresses Found"}</span>
                </div>

                {invalidCount > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="font-medium text-warning">{invalidCount}</span>
                    <span className="text-muted-foreground">{"Invalid Addresses Ignored"}</span>
                  </div>
                )}
              </div>

              {validAddresses.length > 0 && (
                <div className="rounded-md bg-muted/50 p-3 max-h-40 overflow-y-auto">
                  <p className="text-xs font-medium text-muted-foreground mb-2">{"Preview (first 5):"}</p>
                  <div className="space-y-1">
                    {validAddresses.slice(0, 5).map((address, idx) => (
                      <p key={idx} className="text-xs font-mono text-foreground">
                        {address}
                      </p>
                    ))}
                    {validAddresses.length > 5 && (
                      <p className="text-xs text-muted-foreground italic">
                        {"... and "}
                        {validAddresses.length - 5}
                        {" more"}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleRegister} disabled={isRegistering || validAddresses.length === 0} className="flex-1">
            {isRegistering ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                {"Registering on Blockchain..."}
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {"Register Voters on Blockchain"}
              </>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline" disabled={isRegistering}>
            {"Reset"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative rounded-lg border-2 border-dashed transition-all ${
          isDragging
            ? "border-accent bg-accent/10 scale-[1.02]"
            : "border-muted-foreground/30 bg-muted/20 hover:bg-muted/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          {isProcessing ? (
            <>
              <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">{"Processing CSV file..."}</p>
              <p className="text-xs text-muted-foreground">{"Validating wallet addresses"}</p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-accent/10 p-4 mb-4">
                <FileSpreadsheet className="h-8 w-8 text-accent" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">{"Drag & Drop Voter CSV File"}</p>
              <p className="text-xs text-muted-foreground mb-4">{"or click to browse"}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Upload className="h-3 w-3" />
                <span>{"Accepts .csv files with wallet addresses"}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-muted/30 p-4">
        <p className="text-xs font-medium text-foreground mb-2">{"CSV Format:"}</p>
        <div className="rounded bg-muted p-3 font-mono text-xs text-muted-foreground">
          {"0x1234567890abcdef1234567890abcdef12345678"}
          <br />
          {"0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"}
          <br />
          {"0x9876543210fedcba9876543210fedcba98765432"}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{"One address per line or comma-separated"}</p>
      </div>
    </div>
  )
}
