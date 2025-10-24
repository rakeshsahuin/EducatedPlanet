import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, GraduationCap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  
  // Login form state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Refs for OTP input fields
  const otpInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
                        useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
                        useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  
  // Validate phone number (10-digit Indian mobile number)
  useEffect(() => {
    const phoneRegex = /^[6-9]\d{9}$/;
    setIsPhoneValid(phoneRegex.test(phoneNumber));
  }, [phoneNumber]);
  
  // Check if OTP is complete
  useEffect(() => {
    setIsOtpComplete(otpInputs.every(input => input !== ""));
  }, [otpInputs]);
  
  // Countdown timer for resend link
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (otpSent && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    
    return () => clearInterval(interval);
  }, [otpSent, countdown]);
  
  // Handle phone number input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };
  
  // Handle Send OTP
  const handleSendOtp = () => {
    setOtpSent(true);
    setCountdown(60);
    setCanResend(false);
    // In a real app, this would call an API to send OTP
  };
  
  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpInputs = [...otpInputs];
      newOtpInputs[index] = value;
      setOtpInputs(newOtpInputs);
      
      // Auto-focus to next input
      if (value && index < 5) {
        otpInputRefs[index + 1].current?.focus();
      }
    }
  };
  
  // Handle OTP key down for backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };
  
  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtpInputs = [...otpInputs];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtpInputs[i] = pastedData[i];
    }
    
    setOtpInputs(newOtpInputs);
    
    // Focus to the next empty input or the last one
    const nextEmptyIndex = newOtpInputs.findIndex(input => input === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    otpInputRefs[focusIndex].current?.focus();
  };
  
  // Handle Login
  const handleLogin = () => {
    // In a real app, this would validate the OTP with the server
    setAuthDialogOpen(false);
    // Reset form state
    setPhoneNumber("");
    setOtpSent(false);
    setOtpInputs(["", "", "", "", "", ""]);
    setCountdown(60);
    setCanResend(false);
  };
  
  // Handle Resend OTP
  const handleResendOtp = () => {
    setCountdown(60);
    setCanResend(false);
    setOtpInputs(["", "", "", "", "", ""]);
    // In a real app, this would call an API to resend OTP
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">EducatedPlanet</span>
              <span className="text-xs text-muted-foreground">Find Your Perfect Tutor</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </a>
            <Button onClick={() => setAuthDialogOpen(true)}>
              Login / Signup
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto flex flex-col gap-4 py-4 px-4">
              <a
                href="#home"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#contact"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Button onClick={() => {
                setAuthDialogOpen(true);
                setMobileMenuOpen(false);
              }}>
                Login / Signup
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to EducatedPlanet</DialogTitle>
            <DialogDescription>
              Login or signup to access your account and connect with tutors.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Phone Number Input */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Phone Number
              </label>
              <div className="flex">
                <div className="flex items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
                  +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your 10-digit mobile number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="rounded-l-none"
                  maxLength={10}
                />
              </div>
              {phoneNumber && !isPhoneValid && (
                <p className="text-sm text-destructive">
                  Please enter a valid 10-digit mobile number.
                </p>
              )}
            </div>
            
            {/* Send OTP Button */}
            {isPhoneValid && !otpSent && (
              <Button onClick={handleSendOtp} className="w-full">
                Send OTP
              </Button>
            )}
            
            {/* OTP Input Section */}
            {otpSent && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Enter OTP
                  </label>
                  <div className="flex justify-between gap-2">
                    {otpInputs.map((value, index) => (
                      <Input
                        key={index}
                        ref={otpInputRefs[index]}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        className="w-10 h-10 text-center"
                      />
                    ))}
                  </div>
                </div>
                
                {/* Login Button */}
                <Button
                  onClick={handleLogin}
                  className="w-full"
                  disabled={!isOtpComplete}
                >
                  Login
                </Button>
                
                {/* Resend OTP Link */}
                <div className="text-center">
                  {canResend ? (
                    <button
                      onClick={handleResendOtp}
                      className="text-sm text-primary hover:underline"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Resend OTP in {countdown}s
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
