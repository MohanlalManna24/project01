import React, { useState } from "react";

const EmailVarify = ({ email = "example@gmail.com" }) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isVarifyed, setIsVarifyed] = useState(false);

  const handleVerifyEmail = () => {
    if (isSending) return;
    setIsSending(true);

    // Simulate sending verification email
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-white px-4 py-8 font-sans">
      <div className="w-full max-w-lg text-center">
        {/* Verification Illustration / Image */}
        <section className="mb-6">
          <img
            className="object-cover h-60 m-auto"
            src="https://img.magnific.com/premium-photo/successful-email-sent-confirmation-3d-icon_557469-17342.jpg?"
            alt="Email verification"
          />
        </section>

        {isVarifyed ? (
          /* Success Screen when isVarifyed is true */
          <div>
            <h1 className="mb-3 text-2xl sm:text-3xl font-bold tracking-tight text-[#1E293B]">
              Email Verified Successfully!
            </h1>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-md mx-auto">
              Your email address <strong className="font-bold text-[#0F172A]">{email}</strong> has been successfully verified. You can now log in to your account.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center">
              <a
                href="/login"
                className="w-auto min-w-[190px] rounded-lg bg-[#4D73F8] hover:bg-[#3B62E8] active:bg-[#3055D6] px-6 py-3 text-base font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-center"
              >
                Continue to Login
              </a>
            </div>
          </div>
        ) : (
          /* Verification Screen when not yet verified */
          <div>
            {/* Heading */}
            <h1 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#1E293B]">
              Verify your email address
            </h1>

            {/* Description */}
            <div className="space-y-1 text-sm sm:text-base text-[#475569] leading-relaxed max-w-md mx-auto">
              <p>
                You've entered{" "}
                <strong className="font-bold text-[#0F172A]">{email}</strong> as the
                email address for your account.
              </p>
              <p>Please verify this email address by clicking button below.</p>
            </div>

            {/* Verify Action Button */}
            <div className="mt-8 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={handleVerifyEmail}
                disabled={isSending}
                className="w-auto min-w-[190px] rounded-lg bg-[#4D73F8] hover:bg-[#3B62E8] active:bg-[#3055D6] px-6 py-3 text-base font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Sending email...</span>
                  </div>
                ) : isSent ? (
                  "Verification link sent ✓"
                ) : (
                  "Send Email"
                )}
              </button>

              {/* Success feedback message */}
              {isSent && (
                <p className="mt-3 text-xs sm:text-sm font-medium text-emerald-600 animate-fade-in">
                  Check your inbox! A verification link has been sent to {email}.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVarify;

