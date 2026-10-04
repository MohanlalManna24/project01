import React, { useState, useEffect, useRef } from "react";
import { MdEmail, MdArrowBack, MdRefresh, MdCheckCircle, MdLockReset } from "react-icons/md";
import { HiShieldCheck } from "react-icons/hi2";
import { TbPasswordUser } from "react-icons/tb";
import { Link } from "react-router-dom";

const forgetImage =
  "https://img.magnific.com/premium-photo/secure-online-access-with-password-login-page-manage-personal-profile-account_1313853-60697.jpg";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [resendAlert, setResendAlert] = useState(false);
  const inputRefs = useRef([]);

  // Resend OTP Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle Send OTP (Step 1 -> Step 2)
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSendingOtp(true);
    // Simulate sending OTP to email
    setTimeout(() => {
      setIsSendingOtp(false);
      setStep(2);
      setCountdown(60);
      setResendAlert(true);
      setTimeout(() => setResendAlert(false), 4000);
    }, 1000);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue && value !== "") return;

    const newOtp = [...otp];
    if (cleanValue.length > 1) {
      const pastedDigits = cleanValue.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedDigits[i] || "";
      }
      setOtp(newOtp);
      const nextFocus = Math.min(cleanValue.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newOtp[index] = cleanValue.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasteData[i] || "";
    }
    setOtp(newOtp);
    const focusTarget = Math.min(pasteData.length, 5);
    inputRefs.current[focusTarget]?.focus();
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    if (countdown > 0 || isSendingOtp) return;
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setCountdown(60);
      setResendAlert(true);
      setTimeout(() => setResendAlert(false), 4000);
    }, 800);
  };

  // Handle Submit OTP (Step 2 Verification)
  const handleSubmitOtp = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) return;

    setIsSubmittingOtp(true);
    // Simulate verifying OTP
    setTimeout(() => {
      setIsSubmittingOtp(false);
      setIsVerified(true);
    }, 1200);
  };

  const isOtpComplete = otp.every((digit) => digit.trim() !== "");

  return (
    <main className="box-border min-h-dvh bg-[#f7f7fb] px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-4">
      <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-4xl bg-white shadow-[0_24px_80px_rgba(36,25,74,0.12)] lg:min-h-[calc(100dvh-2rem)] lg:grid-cols-[0.96fr_1.04fr]">
        {/* Left Side: Illustration & Branding */}
        <div className="relative min-h-80 overflow-hidden bg-violet-950 sm:min-h-96 lg:min-h-full">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={forgetImage}
            alt="Security & Account Recovery"
          />
          <div className="absolute inset-0 bg-linear-to-t from-violet-950 via-violet-950/40 to-violet-900/20" />

          <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-8 lg:p-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg font-black text-violet-700 shadow-md">
                  N
                </div>
                <span className="text-xl font-bold tracking-tight">Note App</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-800/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-violet-200 border border-violet-700/50">
                <HiShieldCheck className="text-sm text-violet-300" />
                Password Recovery
              </span>
            </div>

            <div className="max-w-md">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">
                Account Security
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.65rem]">
                Recover your account seamlessly.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-violet-100 sm:text-base">
                Don’t worry! Enter your registered email and we’ll send a secure one-time passcode (OTP) to reset your password.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Step 1 (Email) or Step 2 (OTP) */}
        <div className="flex items-center px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-8">
          <div className="mx-auto w-full max-w-sm">
            {isVerified ? (
              /* Success Verified Screen */
              <div className="text-center py-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-5 shadow-inner">
                  <MdCheckCircle className="h-9 w-9" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  OTP Verified!
                </h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Your identity has been verified successfully. You can now proceed to set a new password.
                </p>

                <div className="mt-6">
                  <Link
                    to="/reset-password"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.99]"
                  >
                    Reset Password
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ) : step === 1 ? (
              /* STEP 1: Enter Email */
              <>
                <div className="mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 mb-3">
                    <MdLockReset className="h-6 w-6" />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-violet-600">
                    Step 1 of 2
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
                    Forgot Password?
                  </h2>
                  <p className="mt-2 text-sm leading-5 text-slate-500">
                    Enter the email associated with your account and we will send an OTP code.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                      htmlFor="email"
                    >
                      <MdEmail className="inline mr-2 text-center" />
                      Email address
                    </label>
                    <input
                      className={inputClassName}
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button
                    className="w-full rounded-xl cursor-pointer bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-500/25 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    type="submit"
                    disabled={isSendingOtp || !email}
                  >
                    {isSendingOtp ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Remember your password?{" "}
                  <Link 
                    className="font-semibold text-violet-600 hover:text-violet-700"
                    to="/login"
                  >
                    Back to Login
                  </Link>
                </p>
              </>
            ) : (
              /* STEP 2: Enter OTP */
              <>
                <div className="mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 mb-3">
                    <TbPasswordUser className="h-6 w-6" />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-violet-600">
                    Step 2 of 2
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
                    Enter OTP Code
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    We've sent a 6-digit OTP code to:
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-violet-50 border border-violet-100 px-3 py-1 text-xs font-semibold text-violet-900">
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-violet-600 hover:text-violet-800 underline font-bold cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Resend success alert */}
                {resendAlert && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700">
                    <MdCheckCircle className="text-emerald-500 text-base" />
                    <span>OTP has been sent to your email!</span>
                  </div>
                )}

                <form onSubmit={handleSubmitOtp} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      6-Digit Security Code
                    </label>
                    <div
                      className="flex items-center justify-between gap-1.5 sm:gap-2"
                      onPaste={handlePaste}
                    >
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (inputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className="h-12 w-10 sm:h-12 sm:w-11 text-center text-lg font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-500/15 focus:outline-none transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    className={`w-full rounded-xl py-3 px-4 text-sm font-bold text-white transition-all shadow-lg active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 ${
                      isOtpComplete && !isSubmittingOtp
                        ? "bg-violet-600 hover:bg-violet-700 shadow-violet-600/20 focus:ring-4 focus:ring-violet-500/25"
                        : "bg-slate-300 text-slate-500 shadow-none cursor-not-allowed"
                    }`}
                    type="submit"
                    disabled={!isOtpComplete || isSubmittingOtp}
                  >
                    {isSubmittingOtp ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Verifying OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit OTP</span>
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Resend Section */}
                <div className="mt-5 text-center text-xs text-slate-500">
                  Didn't receive code?{" "}
                  {countdown > 0 ? (
                    <span className="font-semibold text-slate-400">
                      Resend in <span className="text-violet-600 font-bold">{countdown}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSendingOtp}
                      className="font-bold text-violet-600 hover:text-violet-700 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <MdRefresh className={`text-sm ${isSendingOtp ? "animate-spin" : ""}`} />
                      {isSendingOtp ? "Sending..." : "Resend OTP"}
                    </button>
                  )}
                </div>

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-violet-600 cursor-pointer"
                  >
                    <MdArrowBack className="text-sm" />
                    Back to Email
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForgetPassword;