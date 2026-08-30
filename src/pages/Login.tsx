import React, { useState } from 'react';
import { useMarisStore } from '../lib/store';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, EyeOff, Waves, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const login = useMarisStore((state) => state.login);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState('operator@maris.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      await login(email, password);
      setIsLoading(false);
      navigate('/');
    } catch {
      setIsLoading(false);
      setErrorMsg('Invalid credentials. Please verify your email and password.');
    }
  };

  // Staggered entrance variant for form controls
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: shouldReduceMotion ? 0 : 1.4,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } 
    },
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#050505] overflow-hidden flex items-center justify-between font-sans select-none z-50">
      
      {/* ============================================================ */}
      {/* LAYER 1: BASE NIGHT SKY, ATMOSPHERIC GRADIENTS & FILM GRAIN */}
      {/* ============================================================ */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#070707] to-[#0A0A0A] pointer-events-none z-0" />

      {/* Subtle Noise / Film Grain Layer */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Horizon Haze Overlay */}
      <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none z-10" />

      {/* ============================================================ */}
      {/* LAYER 2: CINEMATIC LIGHTHOUSE TOWER & LAMP-ANCHORED BEAM */}
      {/* ============================================================ */}
      <div className="absolute left-[8%] md:left-[14%] lg:left-[20%] bottom-0 top-0 w-[400px] pointer-events-none z-10 flex flex-col justify-end items-center pb-0">
        
        {/* TALL LIGHTHOUSE STRUCTURE */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative w-44 md:w-56 h-[72vh] flex flex-col items-center"
        >
          {/* LANTERN HOUSE DOME & LAMP BULB CENTER */}
          <div className="relative w-16 md:w-20 h-16 md:h-20 flex flex-col items-center justify-center z-20">
            
            {/* Metal Dome Roof */}
            <div className="w-14 md:w-18 h-5 md:h-6 bg-[#181818] rounded-t-full border-t border-x border-white/20 relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FFF2B0] shadow-[0_0_10px_#FFF2B0]" />
            </div>

            {/* Glass Fresnel Lamp House */}
            <div className="w-14 md:w-18 h-10 md:h-12 bg-black/70 border border-white/20 relative flex items-center justify-center backdrop-blur-xs">
              
              {/* LAMP BULB CORE (True Origin Point of the Light Beam) */}
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#FFF2B0] shadow-[0_0_40px_#FFF2B0,0_0_80px_#FFD75A,0_0_120px_#F6C84A] border border-white z-30 animate-pulse relative">
                
                {/* Ambient Radial Halo Glow */}
                <div 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none z-10"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 242, 176, 0.45) 0%, rgba(246, 200, 74, 0.15) 30%, rgba(246, 200, 74, 0.03) 60%, transparent 80%)',
                    filter: 'blur(10px)'
                  }}
                />

                {/* ============================================================ */}
                {/* SVG VOLUMETRIC LIGHT BEAM (PIVOTED AT (0,300) = LAMP BULB CENTER) */}
                {/* ============================================================ */}
                <div className="absolute left-1/2 top-1/2 pointer-events-none z-20">
                  <motion.div
                    animate={shouldReduceMotion ? { rotate: 5, opacity: 0.9 } : {
                      rotate: [-18, 22, -18],
                      opacity: [0.85, 1, 0.9, 1]
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.2, 1] as const
                    }}
                    style={{
                      transformOrigin: '0px 300px'
                    }}
                    className="absolute left-0 -top-[300px] w-[1800px] h-[600px] pointer-events-none"
                  >
                    <svg className="w-full h-full overflow-visible pointer-events-none">
                      <defs>
                        {/* Core Intense White-Gold Gradient */}
                        <linearGradient id="beamCoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FFF5C0" stopOpacity="0.98" />
                          <stop offset="20%" stopColor="#FFD75A" stopOpacity="0.6" />
                          <stop offset="65%" stopColor="#F6C84A" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#F6C84A" stopOpacity="0" />
                        </linearGradient>

                        {/* Inner Warm Volumetric Cone Gradient */}
                        <linearGradient id="beamInnerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#F6C84A" stopOpacity="0.85" />
                          <stop offset="30%" stopColor="#F6C84A" stopOpacity="0.35" />
                          <stop offset="75%" stopColor="#E9AD35" stopOpacity="0.05" />
                          <stop offset="100%" stopColor="#E9AD35" stopOpacity="0" />
                        </linearGradient>

                        {/* Broad Atmospheric Bloom Cone Gradient */}
                        <linearGradient id="beamOuterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#F6C84A" stopOpacity="0.45" />
                          <stop offset="40%" stopColor="#F6C84A" stopOpacity="0.12" />
                          <stop offset="80%" stopColor="#F6C84A" stopOpacity="0.02" />
                          <stop offset="100%" stopColor="#F6C84A" stopOpacity="0" />
                        </linearGradient>

                        {/* Gaussian Blur Filters for Soft Natural Edges */}
                        <filter id="blurCore" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" />
                        </filter>
                        <filter id="blurInner" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="14" />
                        </filter>
                        <filter id="blurOuter" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="32" />
                        </filter>
                      </defs>

                      {/* LAYER 3: Broad Outer Volumetric Bloom Cone */}
                      <polygon 
                        points="0,300 1800,100 1800,500" 
                        fill="url(#beamOuterGrad)" 
                        filter="url(#blurOuter)" 
                      />

                      {/* LAYER 2: Inner Warm Concentrated Light Cone */}
                      <polygon 
                        points="0,300 1600,180 1600,420" 
                        fill="url(#beamInnerGrad)" 
                        filter="url(#blurInner)" 
                      />

                      {/* LAYER 1: Core Intense White-Gold Light Beam */}
                      <polygon 
                        points="0,300 1400,240 1400,360" 
                        fill="url(#beamCoreGrad)" 
                        filter="url(#blurCore)" 
                      />
                    </svg>
                  </motion.div>
                </div>

              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#F6C84A]/30 to-transparent pointer-events-none" />
            </div>

            {/* Gallery Deck Balcony */}
            <div className="w-20 md:w-24 h-2.5 bg-[#121212] border-t border-white/20 rounded-sm shadow-md z-20" />
          </div>

          {/* TOWER MASONRY BODY (Architectural Bands & Window Highlights) */}
          <div className="w-20 md:w-24 flex-1 bg-gradient-to-b from-[#181818] via-[#111111] to-[#0A0A0A] border-x border-white/10 relative flex flex-col items-center justify-between shadow-2xl overflow-hidden z-10">
            <div className="w-full h-12 bg-white/5 border-b border-white/10" />
            <div className="w-full h-14 bg-black/50 border-b border-white/10" />
            <div className="w-full h-16 bg-white/5 border-b border-white/10" />
            <div className="w-full h-20 bg-black/60 border-b border-white/10" />

            {/* Warm Window Glows */}
            <div className="absolute top-[22%] w-2 h-4 rounded-t bg-[#F6C84A]/40 border border-[#F6C84A]/60 shadow-[0_0_12px_#F6C84A]" />
            <div className="absolute top-[60%] w-2 h-4 rounded-t bg-[#F6C84A]/30 border border-[#F6C84A]/50 shadow-[0_0_8px_#F6C84A]" />
          </div>

          {/* ROCKY CLIFF BASE */}
          <div className="w-40 md:w-56 h-20 bg-gradient-to-t from-[#050505] via-[#0D0D0D] to-[#161616] rounded-t-3xl border-t border-white/10 shadow-2xl z-10" />
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* LAYER 3: RIGHT SIDE SMOKED GLASS LOGIN CARD (PROPORTIONATE) */}
      {/* ============================================================ */}
      <div className="relative z-30 w-full h-full flex items-center justify-center lg:justify-end px-4 sm:px-8 lg:pr-[7vw]">
        
        {/* ENTRANCE ANIMATED GLASS PANEL */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 40, filter: shouldReduceMotion ? 'blur(0px)' : 'blur(7px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, delay: 1.0, ease: [0.16, 1, 0.3, 1] as const }}
          className="w-full max-w-[390px] rounded-[22px] p-8 sm:p-9 relative overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.65)] border border-white/[0.09]"
          style={{
            background: 'rgba(18, 18, 18, 0.78)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)'
          }}
        >
          {/* Glass Reflection Highlight Layer */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.065) 0%, transparent 35%)'
            }}
          />

          {/* Ambient Warm Light Reaction when Beam Sweeps */}
          <div className="absolute -top-20 -left-20 w-44 h-44 bg-[#F6C84A]/10 rounded-full blur-3xl pointer-events-none" />

          {/* STAGGERED FORM CONTENT CONTAINER */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* BRAND HEADER & EYEBROW */}
            <motion.div variants={staggerItem} className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F6C84A]/10 border border-[#F6C84A]/30 flex items-center justify-center">
                  <Waves className="w-4 h-4 text-[#F6C84A]" />
                </div>
                <span className="font-bold text-sm tracking-widest text-white uppercase font-sans">MARIS</span>
              </div>

              <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[#F6C84A]">
                MEMBER ACCESS
              </p>
            </motion.div>

            {/* EDITORIAL HEADING & SUBTITLE */}
            <motion.div variants={staggerItem} className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.02]">
                Welcome <br />
                <span className="text-white/90">back.</span>
              </h1>
              <p className="text-xs text-[#A5A5A5] pt-1">
                Sign in to continue your journey.
              </p>
            </motion.div>

            {/* ERROR ALERT */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-[#EF6B6B]/10 border border-[#EF6B6B]/30 text-[#EF6B6B] text-xs font-medium"
              >
                {errorMsg}
              </motion.div>
            )}

            {/* FORM CONTROLS */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              
              {/* EMAIL FIELD */}
              <motion.div variants={staggerItem} className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#A5A5A5] tracking-wider uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@maris.ai"
                  className="w-full h-[48px] px-4 rounded-[11px] bg-white/[0.03] border border-white/[0.09] text-sm text-[#F5F5F5] placeholder:text-[#606060] focus:outline-none focus:border-[#F6C84A]/60 focus:ring-1 focus:ring-[#F6C84A]/30 transition-all font-medium"
                />
              </motion.div>

              {/* PASSWORD FIELD */}
              <motion.div variants={staggerItem} className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#A5A5A5] tracking-wider uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-[48px] pl-4 pr-11 rounded-[11px] bg-white/[0.03] border border-white/[0.09] text-sm text-[#F5F5F5] placeholder:text-[#606060] focus:outline-none focus:border-[#F6C84A]/60 focus:ring-1 focus:ring-[#F6C84A]/30 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#727272] hover:text-white transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* OPTIONS ROW */}
              <motion.div variants={staggerItem} className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#A5A5A5] hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-white/5 border-white/20 text-[#F6C84A] focus:ring-[#F6C84A]/40 accent-[#F6C84A] cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <a 
                  href="#forgot" 
                  onClick={(e) => { e.preventDefault(); alert('Password reset link dispatched to operator email.'); }}
                  className="text-[#F6C84A] hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </motion.div>

              {/* PRIMARY CTA BUTTON (#F6C84A) */}
              <motion.div variants={staggerItem} className="pt-2">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ y: -1, boxShadow: '0 8px 25px rgba(246, 200, 74, 0.22)' }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full h-[48px] rounded-[11px] bg-[#F6C84A] hover:bg-[#FFD45C] text-[#080808] font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(246,200,74,0.18)] disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#080808]" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* REGISTRATION FOOTER */}
            <motion.div variants={staggerItem} className="pt-5 border-t border-white/5 text-center text-xs text-[#727272]">
              <span>New here? </span>
              <button 
                onClick={() => alert('Registration portal. Contact system administrator for AUV role keys.')}
                className="text-[#F6C84A] hover:underline font-semibold transition-colors inline-block ml-1 cursor-pointer"
              >
                Create an account
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}
