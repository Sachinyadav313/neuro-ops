import React from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, Search, Brain, ArrowRight, Zap, Calculator } from 'lucide-react';

const StepCard = ({ icon: Icon, title, desc, step, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`relative flex-1 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center group hover:border-${color}-500/50 transition-colors min-h-[280px]`}
  >
    <div className={`absolute -top-4 -left-4 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-${color}-400 shadow-xl z-10`}>
      {step}
    </div>
    
    <div className={`w-16 h-16 rounded-full bg-${color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon size={32} className={`text-${color}-500`} />
    </div>
    
    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
    <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
  </motion.div>
);

const Arrow = () => (
  <div className="hidden md:flex flex-col items-center justify-center px-4">
    <motion.div 
      animate={{ x: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <ArrowRight className="text-slate-700" size={32} />
    </motion.div>
  </div>
);

export default function RagExplainer() {
  return (
    <div className="w-full bg-[#050505] py-16 px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-4">
            <Zap size={12} /> HOW IT WORKS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Retrieval Augmented Generation <span className="text-slate-600">(RAG)</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            The AI follows a strict 3-step process to "read" your manual (Runbooks) before writing any code.
          </p>
        </div>

        {/* ✅ FIXED: Used Flexbox to force single row alignment */}
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 mb-16">
          <StepCard 
            step="1" icon={FileText} title="Ingest & Vectorize" color="blue"
            desc="The system reads 'runbook.txt' and uses an Embedding Model to convert English text into 1,536-dimensional vector numbers."
          />

          <Arrow />

          <StepCard 
            step="2" icon={Search} title="Semantic Search" color="purple"
            desc="When an error occurs, Qdrant searches for the 'nearest neighbor' vector in the database to find the relevant fix."
          />

          <Arrow />

          <StepCard 
            step="3" icon={Brain} title="Generative Repair" color="green"
            desc="The AI combines the Error Log + The Retrieved Runbook into a prompt for Llama-3, which generates the exact Python code."
          />
        </div>

        {/* Visualization of Vector Space */}
        <div className="bg-slate-900/30 rounded-3xl border border-slate-800 p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Database className="text-blue-500" /> The Vector Database
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Think of the database as a 3D map of concepts. "Redis" and "Memory" are stored close together. The AI calculates the distance between the error and the solution.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-black p-4 rounded-xl border border-slate-800 font-mono text-xs text-green-400">
                        <div className="text-slate-500 mb-2">// Query Vector</div>
                        [0.12, -0.98, 0.44, ...]
                    </div>
                    <div className="bg-black p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-400">
                        <div className="text-slate-500 mb-2">// Match Found (98%)</div>
                        runbook_id: "redis_oom"
                    </div>
                </div>
            </div>
            
            <div className="w-full md:w-1/3 aspect-square bg-black rounded-full border border-slate-800 relative overflow-hidden flex items-center justify-center group max-w-[250px]">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
                 <motion.div 
                    className="absolute inset-0 border-t-2 border-blue-500/50 origin-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 />
                 <Calculator className="text-slate-700 group-hover:text-blue-500 transition-colors" size={48} />
                 <div className="absolute bottom-8 text-xs font-mono text-blue-500 animate-pulse">
                    COSINE_SIMILARITY
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
}