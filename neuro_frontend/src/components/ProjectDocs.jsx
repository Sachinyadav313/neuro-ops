import React from 'react';
import { Terminal, Cpu, Network, Shield } from 'lucide-react';

export default function ProjectDocs() {
  return (
    <div className="w-full bg-[#0a0a0a] border-t border-slate-800 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">System Architecture & Capabilities</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Neuro-Ops is an autonomous Site Reliability Engineering (SRE) agent designed to detect, analyze, and resolve infrastructure incidents without human intervention.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: The Concept */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-500">
              <Network size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Event-Driven Pipeline</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The system uses <strong>Apache Kafka</strong> to ingest high-throughput error logs from microservices. This creates a decoupled, real-time nervous system where every error is treated as a distinct event signal.
            </p>
          </div>

          {/* Col 2: The Brain */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-500">
              <Cpu size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Cognitive Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Powered by <strong>Llama-3 (via Groq LPUs)</strong>, the agent acts as an intelligent operator. It doesn't just match keywords; it understands context, queries a <strong>Qdrant Vector DB</strong> for past solutions (RAG), and generates executable Python/Bash fixes.
            </p>
          </div>

          {/* Col 3: The Action */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-green-500/50 transition-colors">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 text-green-500">
              <Shield size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Self-Healing Infrastructure</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Once a fix is generated, the agent pushes the solution back to the infrastructure layer. The dashboard visualizes this "Loop Closure" as the system transitions from a critical state back to operational health automatically.
            </p>
          </div>

        </div>

        {/* Tech Stack Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap justify-center gap-4">
             {["React + Vite", "FastAPI", "Apache Kafka", "Docker", "Qdrant Vector DB", "Groq AI Accelerator", "Llama-3 LLM"].map(tech => (
                 <span key={tech} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 font-mono border border-slate-700">
                    {tech}
                 </span>
             ))}
        </div>

      </div>
    </div>
  );
}