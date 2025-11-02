"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

interface OTPFormProps {
  onSubmit: (data: { phone: string }) => void
  loading?: boolean
}

function OTPForm({ onSubmit, loading }: OTPFormProps) {
  const [phone, setPhone] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length === 10) {
      onSubmit({ phone })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Mobile Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="98XXXXXXXX"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          pattern="[0-9]{10}"
          required
          disabled={loading}
          aria-describedby="phone-description"
        />
        <p id="phone-description" className="text-xs text-muted-foreground">
          Enter your 10-digit mobile number to receive an OTP
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={phone.length !== 10 || loading}
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </form>
  )
}

interface OTPVerifyProps {
  phone: string
  onVerify: (otp: string) => void
  onBack: () => void
  loading?: boolean
}

function OTPVerify({ phone, onVerify, onBack, loading }: OTPVerifyProps) {
  const [otp, setOtp] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 6) {
      onVerify(otp)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Enter OTP</Label>
        <Input
          id="otp"
          type="text"
          placeholder="123456"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          pattern="[0-9]{6}"
          required
          disabled={loading}
          className="text-center text-lg tracking-widest"
        />
        <p className="text-xs text-muted-foreground text-center">
          Enter the 6-digit OTP sent to {phone}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={otp.length !== 6 || loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>

      <button
        type="button"
        className="text-sm text-primary hover:underline w-full"
        disabled={loading}
      >
        Resend OTP
      </button>
    </form>
  )
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePhoneSubmit = async (data: { phone: string }) => {
    setLoading(true)
    setPhone(data.phone)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setLoading(false)
    setStep("otp")
  }

  const handleOTPVerify = async (otp: string) => {
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setLoading(false)
    onClose()
    // Reset form
    setStep("phone")
    setPhone("")
  }

  const handleBack = () => {
    setStep("phone")
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      // Reset form after delay
      setTimeout(() => {
        setStep("phone")
        setPhone("")
      }, 300)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === "phone" ? "Login to EducatedPlanet" : "Verify OTP"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "phone"
              ? "Connect with qualified tutors in your area"
              : "Enter the verification code sent to your phone"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {step === "phone" ? (
            <OTPForm onSubmit={handlePhoneSubmit} loading={loading} />
          ) : (
            <OTPVerify
              phone={phone}
              onVerify={handleOTPVerify}
              onBack={handleBack}
              loading={loading}
            />
          )}
        </div>

        <Separator className="my-4" />

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            New to EducatedPlanet?
          </p>
          <Button variant="outline" className="w-full">
            Create Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}