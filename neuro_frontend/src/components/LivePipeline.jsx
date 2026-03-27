import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Database, Brain, Activity } from 'lucide-react';

// --- 1. The Packet Component ---
const DataPayload = ({ text, color, delay, duration = 2, reverse = false }) => {
  return (
    <motion.div
      // ✅ FIXED: Added specific width/height constraints and z-index to ensure visibility
      className={`absolute top-1/2 z-40 px-3 py-1 rounded-full ${color} shadow-[0_0_15px_currentColor] border border-white/20 flex items-center justify-center whitespace-nowrap`}
      initial={{ left: reverse ? "80%" : "20%", opacity: 0, y: "-50%" }}
      animate={{ 
        left: reverse ? "20%" : "80%", 
        opacity: [0, 1, 1, 0] 
      }}
      transition={{ 
        duration: duration, 
        delay: delay,
        ease: "easeInOut"
      }}
    >
      <span className="text-[10px] font-mono font-bold text-white tracking-wider drop-shadow-md">{text}</span>
    </motion.div>
  );
};

const Node = ({ icon: Icon, title, status, isActive }) => (
  <div className="relative flex flex-col items-center z-20">
    <motion.div 
      animate={{ 
        scale: isActive ? 1.1 : 1,
        borderColor: status === 'error' ? '#ef4444' : status === 'success' ? '#22c55e' : isActive ? '#3b82f6' : '#1e293b'
      }}
      className={`w-24 h-24 rounded-2xl bg-[#0a0a0a] border-2 flex items-center justify-center transition-all duration-300 ${
        status === 'error' ? 'shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 
        status === 'success' ? 'shadow-[0_0_30px_rgba(34,197,94,0.4)]' : ''
      }`}
    >
      <Icon size={32} className={status === 'error' ? 'text-red-500' : status === 'success' ? 'text-green-500' : isActive ? 'text-blue-500' : 'text-slate-600'} />
    </motion.div>
    <div className="mt-4 text-center">
      <div className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-1">{title}</div>
    </div>
  </div>
);

const Wire = () => (
  <div className="flex-1 h-[2px] bg-slate-800 relative mx-4 self-center rounded-full overflow-hidden">
    <div className="absolute inset-0 bg-slate-800" />
  </div>
);

export default function LivePipeline({ activeAlert }) {
  const [phase, setPhase] = useState('monitoring'); 

  useEffect(() => {
    if (activeAlert) {
      // ✅ RESET phase immediately to restart animation cleanly
      setPhase('monitoring');
      
      // Start sequence after brief pause
      setTimeout(() => setPhase('detection'), 100);
      setTimeout(() => setPhase('analysis'), 2600);
      setTimeout(() => setPhase('healing'), 5600);
      setTimeout(() => setPhase('monitoring'), 8600);
    }
  }, [activeAlert]); // This relies on activeAlert CHANGING (managed in App.jsx)

  return (
    <div className="w-full h-[400px] bg-[#050505] border-b border-slate-800 relative flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="max-w-7xl mx-auto w-full px-8 flex justify-between relative z-10">
        
        {/* NODE 1: SERVICES */}
        <div className="relative flex-1 flex justify-center">
            <Node icon={Server} title="PRODUCTION" status={phase === 'detection' ? 'error' : phase === 'healing' ? 'success' : 'normal'} />
            {phase === 'detection' && <DataPayload text="⚠ ERROR LOG" color="bg-red-600" delay={0} />}
        </div>

        <Wire />

        {/* NODE 2: KAFKA */}
        <div className="relative flex-1 flex justify-center">
            <Node icon={Activity} title="EVENT BUS" isActive={phase === 'detection' || phase === 'analysis'} />
            {phase === 'analysis' && <DataPayload text="⚡ STREAM EVENT" color="bg-blue-600" delay={0} />}
        </div>

        <Wire />

        {/* NODE 3: AI BRAIN */}
        <div className="relative flex-1 flex justify-center">
            <Node icon={Brain} title="NEURAL AGENT" isActive={phase === 'analysis'} />
            {phase === 'healing' && (
               // ✅ FIXED: Reverse packet positioned absolutely to span backwards
               <div className="absolute top-0 left-[-200%] w-[300%] h-full pointer-events-none">
                  <DataPayload text="🛠 FIX: RESTART" color="bg-green-600" delay={0} reverse={true} duration={2.5} />
               </div>
            )}
        </div>

        <Wire />

        {/* NODE 4: MEMORY */}
        <div className="relative flex-1 flex justify-center">
            <Node icon={Database} title="RAG MEMORY" isActive={phase === 'analysis'} />
        </div>

      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center">
          <AnimatePresence mode='wait'>
            {phase === 'monitoring' && <motion.div key="m" initial={{opacity:0}} animate={{opacity:1}} className="text-slate-500 font-mono text-xs tracking-widest">SYSTEM OPTIMAL // LISTENING</motion.div>}
            {phase === 'detection' && <motion.div key="d" initial={{opacity:0}} animate={{opacity:1}} className="text-red-500 font-bold font-mono text-sm tracking-widest">⚠ PHASE 1: ANOMALY DETECTED</motion.div>}
            {phase === 'analysis' && <motion.div key="a" initial={{opacity:0}} animate={{opacity:1}} className="text-blue-400 font-bold font-mono text-sm tracking-widest">⚡ PHASE 2: AI ANALYZING ROOT CAUSE</motion.div>}
            {phase === 'healing' && <motion.div key="h" initial={{opacity:0}} animate={{opacity:1}} className="text-green-400 font-bold font-mono text-sm tracking-widest">🛠 PHASE 3: AUTONOMOUS PATCH DEPLOYED</motion.div>}
          </AnimatePresence>
      </div>
    </div>
  );
}