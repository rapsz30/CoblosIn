import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Phase = "Setup" | "Registration Candidate" | "Registration Voter" | "Voting" | "Counting" | "Ended"

interface PhaseTrackerProps {
  currentPhase: Phase
}

const phases: Phase[] = ["Setup", "Registration Candidate", "Registration Voter", "Voting", "Counting", "Ended"]

export function PhaseTracker({ currentPhase }: PhaseTrackerProps) {
  const currentIndex = phases.indexOf(currentPhase)

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {phases.map((phase, index) => {
            const isActive = index === currentIndex
            const isCompleted = index < currentIndex
            const isLast = index === phases.length - 1

            return (
              <div key={phase} className="flex flex-1 items-center min-w-fit">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors shrink-0",
                      isCompleted && "border-secondary bg-secondary text-secondary-foreground",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      !isCompleted && !isActive && "border-muted-foreground/30 bg-muted text-muted-foreground",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium text-center text-balance max-w-[80px] sm:max-w-none",
                      isActive && "text-primary",
                      isCompleted && "text-secondary",
                      !isCompleted && !isActive && "text-muted-foreground",
                    )}
                  >
                    {phase}
                  </span>
                </div>
                {!isLast && (
                  <div className="mx-2 h-0.5 flex-1 bg-border min-w-[20px]">
                    <div
                      className={cn(
                        "h-full transition-all",
                        isCompleted && "bg-secondary",
                        isActive && "w-1/2 bg-primary",
                        !isCompleted && !isActive && "w-0",
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
