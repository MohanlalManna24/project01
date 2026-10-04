import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Link } from "react-router-dom";

const loginImage =
  "https://img.magnific.com/premium-photo/login-page-with-password-access-online-profile-account_1313853-64810.jpg";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fromData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...fromData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(fromData);
  };
  return (
    <main className="box-border min-h-dvh bg-[#f7f7fb] px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-4">
      <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-4xl bg-white shadow-[0_24px_80px_rgba(36,25,74,0.12)] lg:min-h-[calc(100dvh-2rem)] lg:grid-cols-[0.96fr_1.04fr]">
        <div className="relative min-h-80 overflow-hidden bg-violet-950 sm:min-h-96 lg:min-h-full">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={loginImage}
            alt="Person using a digital profile interface"
          />
          <div className="absolute inset-0 bg-linear-to-t from-violet-950 via-violet-950/30 to-violet-900/10" />

          <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg font-black text-violet-700">
                N
              </div>
              <span className="text-xl font-bold tracking-tight">Note App</span>
            </div>

            <div className="max-w-md">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">
                Your ideas, organized
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.65rem]">
                Make space for what matters.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-violet-100 sm:text-base">
                Capture your thoughts, plan your next move, and keep everything
                important within reach.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-8">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-600">
                Welcome back
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-[2.15rem]">
                Login to your account
              </h2>
              <p className="mt-2 text-sm leading-5 text-slate-500">
                Start organizing your world in a simpler, more focused way.
              </p>
            </div>

            <form className="space-y-4">
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
                  value={fromData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor="password"
                  >
                    <TbLockPassword className="inline mr-2 text-center" />
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    className={`${inputClassName} pr-11`}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    minLength="4"
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={fromData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((isVisible) => !isVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-violet-600 cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <Link to="/forget-password">
                <span className="text-sm text-violet-600 hover:text-green-900 cursor-pointer">
                  Forgot your password?
                </span>
                </Link>
              </div>

              <button
                className="w-full rounded-xl cursor-pointer bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-500/25 active:scale-[0.99]"
                type="submit"
                onClick={handleSubmit}
              >
                Login
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?
              <Link
                className="font-semibold text-violet-600 hover:text-green-700"
                to="/register"
              >
                Register
              </Link>
            </p>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
