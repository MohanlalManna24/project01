import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { TbLockPassword, TbLockCheck } from "react-icons/tb";
import { MdCheckCircle, MdArrowBack } from "react-icons/md";
import { HiShieldCheck } from "react-icons/hi2";

const resetImage =
  "https://img.magnific.com/premium-photo/secure-online-access-with-password-login-page-manage-personal-profile-account_1313853-60655.jpg";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (formData.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call to reset password
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <main className="box-border min-h-dvh bg-[#f7f7fb] px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-4">
      <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-4xl bg-white shadow-[0_24px_80px_rgba(36,25,74,0.12)] lg:min-h-[calc(100dvh-2rem)] lg:grid-cols-[0.96fr_1.04fr]">
        {/* Left Side: Illustration & Branding */}
        <div className="relative min-h-80 overflow-hidden bg-violet-950 sm:min-h-96 lg:min-h-full">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={resetImage}
            alt="Security & Reset Password"
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
                Enhanced Protection
              </span>
            </div>

            <div className="max-w-md">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">
                Create New Password
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.65rem]">
                Secure your new credentials.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-violet-100 sm:text-base">
                Choose a strong password containing letters, numbers, and special characters to keep your notes protected.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form / Success Screen */}
        <div className="flex items-center px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-8">
          <div className="mx-auto w-full max-w-sm">
            {isSuccess ? (
              /* Success Screen */
              <div className="text-center py-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-5 shadow-inner">
                  <MdCheckCircle className="h-9 w-9" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Password Reset Successful!
                </h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Your password has been changed successfully. You can now use your new password to sign in.
                </p>

                <div className="mt-8">
                  <a
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.99]"
                  >
                    Back to Sign In
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Reset Password Form */
              <>
                <div className="mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 mb-3">
                    <TbLockPassword className="h-6 w-6" />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-violet-600">
                    Security Update
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
                    Reset Password
                  </h2>
                  <p className="mt-1.5 text-sm leading-5 text-slate-500">
                    Please create and confirm your new account password.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* New Password Field */}
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                      htmlFor="newPassword"
                    >
                      <TbLockPassword className="inline mr-2 text-center" />
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        className={`${inputClassName} pr-11`}
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        required
                        minLength="6"
                        autoComplete="new-password"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-violet-600 cursor-pointer"
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Re-enter Password Field */}
                  <div>
                    <label
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                      htmlFor="confirmPassword"
                    >
                      <TbLockCheck className="inline mr-2 text-center" />
                      Re-enter Password
                    </label>
                    <div className="relative">
                      <input
                        className={`${inputClassName} pr-11`}
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        minLength="6"
                        autoComplete="new-password"
                        placeholder="Re-enter new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-violet-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    className="w-full rounded-xl cursor-pointer bg-violet-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-500/25 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    type="submit"
                    disabled={isSubmitting || !formData.newPassword || !formData.confirmPassword}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Change Password</span>
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <a
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-violet-600 transition"
                  >
                    <MdArrowBack className="text-sm" />
                    Back to Login
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;