"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { Mail, Phone, Lock, ArrowRight, ChevronLeft, Shield, KeyRound } from "lucide-react";
import Link from "next/link";

type AuthTab = "login" | "register" | "phone" | "forgot";

export default function AuthPage() {
  const [tab, setTab] = useState<AuthTab>("login");
  const [phoneStep, setPhoneStep] = useState<"input" | "otp">("input");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleOtpChange = (i: number, val: string) => {
    if (val.length > 1) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 3) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950 to-slate-950" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-gradient">{BRAND.name}</h1>
            <p className="text-xs text-slate-400">Welcome back to Botswana&apos;s premium property platform</p>
          </div>

          {tab !== "forgot" && tab !== "phone" && (
            <div className="flex p-1 rounded-2xl bg-white/5 border border-white/5">
              {(["login", "register"] as AuthTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all btn-pop ${
                    tab === t ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {tab === "login" || tab === "register" ? (
              <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all btn-pop">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>

                <button className="w-full py-3 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] text-xs font-semibold flex items-center justify-center gap-2 transition-all btn-pop hover:bg-[#1877F2]/20">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Continue with Facebook
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                  <div className="relative flex justify-center text-[10px] uppercase"><span className="px-2 bg-slate-900 text-slate-500">or use email</span></div>
                </div>

                <div className="space-y-3">
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input type="email" placeholder="Email address" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition-all" />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition-all" />
                  </div>
                </div>

                {tab === "login" && (
                  <button onClick={() => setTab("forgot")} className="text-[11px] text-cyan-400 hover:underline w-full text-right">
                    Forgot password?
                  </button>
                )}

                <button className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all btn-pop neon-glow-hover flex items-center justify-center gap-2">
                  {tab === "login" ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" />
                </button>

                <button onClick={() => setTab("phone")} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center justify-center gap-2 transition-all btn-pop">
                  <Phone className="w-4 h-4" /> Login with Phone Number
                </button>
              </motion.div>
            ) : null}

            {tab === "phone" ? (
              <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <button onClick={() => setTab("login")} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                {phoneStep === "input" ? (
                  <>
                    <div className="text-center space-y-1">
                      <h3 className="font-bold text-white">Phone Login</h3>
                      <p className="text-[11px] text-slate-400">We&apos;ll send a one-time password to your phone</p>
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input type="tel" placeholder="+267 74 551 429" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50" />
                    </div>
                    <button onClick={() => setPhoneStep("otp")} className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs transition-all btn-pop neon-glow-hover">
                      Send OTP
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center space-y-1">
                      <Shield className="w-8 h-8 text-cyan-400 mx-auto" />
                      <h3 className="font-bold text-white">Enter OTP</h3>
                      <p className="text-[11px] text-slate-400">Enter the 4-digit code sent to your phone</p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      {otp.map((digit, i) => (
                        <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleOtpChange(i, e.target.value)}
                          className="w-12 h-12 text-center bg-white/5 border border-white/10 rounded-xl text-lg font-bold text-white outline-none focus:border-cyan-400 transition-all"
                          style={{ boxShadow: digit ? "0 0 15px rgba(34,211,238,0.2)" : "none" }}
                        />
                      ))}
                    </div>
                    <button className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs transition-all btn-pop neon-glow-hover">
                      Verify & Login
                    </button>
                    <button onClick={() => setPhoneStep("input")} className="w-full text-[11px] text-cyan-400 hover:underline">
                      Didn&apos;t receive code? Resend
                    </button>
                  </>
                )}
              </motion.div>
            ) : null}

            {tab === "forgot" ? (
              <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <button onClick={() => setTab("login")} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to Login
                </button>
                <div className="text-center space-y-1">
                  <KeyRound className="w-8 h-8 text-cyan-400 mx-auto" />
                  <h3 className="font-bold text-white">Reset Password</h3>
                  <p className="text-[11px] text-slate-400">Enter your email and we&apos;ll send a reset link</p>
                </div>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input type="email" placeholder="Email address" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition-all" />
                </div>
                <button className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs transition-all btn-pop neon-glow-hover">
                  Send Reset Link
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}