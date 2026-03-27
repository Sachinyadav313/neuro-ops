import { useEffect, useState } from 'react';
import axios from 'axios';
import { Terminal, Shield, Zap, Activity } from 'lucide-react';
import LivePipeline from './components/LivePipeline';
import ProjectDocs from './components/ProjectDocs';
import RagExplainer from './components/RagExplainer';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [lastAlert, setLastAlert] = useState(null);
  const [isSystemOnline, setIsSystemOnline] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true); 
  const [totalResolved, setTotalResolved] = useState(20); 

  const fetchAlerts = async () => {
    try {
      // ✅ FIX: Force the browser to pull directly from the FastAPI container
      const res = await axios.get('http://localhost:8000/alerts');
      
      setIsSystemOnline(true);
      setIsConnecting(false);
      setIncidents(res.data);

      if (res.data.length > 0) {
        const latest = res.data[0];
        if (!lastAlert || JSON.stringify(latest) !== JSON.stringify(lastAlert)) {
          setLastAlert(latest);
          setTotalResolved(prev => prev + 1); 
        }
      }
    } catch (error) {
      setIsSystemOnline(false);
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 2000); 
    return () => clearInterval(interval);
  }, [lastAlert]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500/30">
      
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-800 bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <Shield className="text-green-500" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">NEURO-OPS</h1>
            <p className="text-gray-500 text-[10px] md:text-xs font-mono mt-1 uppercase tracking-[0.2em]">
              Autonomous SRE Agent // v4.0.0
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 border border-slate-800 px-4 py-2 rounded-full bg-slate-900/50">
            <span className={`w-2 h-2 rounded-full ${isConnecting ? 'bg-yellow-500 animate-pulse' : isSystemOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="text-xs font-bold text-slate-300">
              {isConnecting ? 'CONNECTING...' : isSystemOnline ? 'SYSTEM CONNECTED' : 'OFFLINE'}
            </span>
        </div>
      </header>

      {/* 1. VISUAL PIPELINE */}
      <div className="w-full border-b border-gray-800">
        <LivePipeline activeAlert={lastAlert} />
      </div>

      {/* 2. MAIN GRID */}
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* LEFT COLUMN: STATS */}
           <div className="space-y-6">
              <div className="bg-[#0f172a]/50 p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-green-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={100} /></div>
                <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Total Incidents Resolved</h2>
                <div className="text-7xl font-mono font-bold text-white tracking-tighter">{totalResolved}</div>
                <div className="mt-4 text-xs text-green-400">+1 Live (Auto-Resolved)</div>
              </div>
              
              <div className="bg-[#0f172a]/50 p-8 rounded-3xl border border-slate-800">
                 <h2 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">AI Specs</h2>
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gray-800 pb-2"><span className="text-gray-400">Model</span><span className="text-white font-mono">Llama-3-70b</span></div>
                    <div className="flex justify-between border-b border-gray-800 pb-2"><span className="text-gray-400">Hardware</span><span className="text-green-400 font-bold">Groq LPU™</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Context</span><span className="text-white font-mono">8k Tokens</span></div>
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: LOGS */}
           <div className="lg:col-span-2 bg-[#0a0a0a] rounded-3xl border border-slate-800 flex flex-col h-[500px] overflow-hidden">
               <div className="p-5 border-b border-slate-800 bg-[#0f172a] flex items-center gap-3">
                   <Terminal size={18} className="text-slate-400" />
                   <h2 className="text-slate-300 text-xs font-bold uppercase tracking-widest">Live Decision Matrix</h2>
               </div>
               <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm bg-black/50 custom-scrollbar">
                   {incidents.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4">
                        <Activity size={32} className="opacity-50" />
                        <p className="text-xs uppercase tracking-widest">Waiting for anomalies...</p>
                     </div>
                   )}
                   {incidents.map((inc, i) => (
                       <div key={i} className="pl-6 border-l-2 border-slate-800 hover:border-green-500 transition-all">
                           <div className="flex items-center gap-3 mb-2">
                               <span className="text-xs text-slate-500">{new Date().toLocaleTimeString()}</span>
                               <span className="px-2 py-0.5 bg-red-900/20 text-red-400 text-[10px] font-bold rounded uppercase">{inc.service || "ERR"}</span>
                           </div>
                           <div className="text-slate-300 mb-2">{inc.error}</div>
                           <div className="text-green-500 text-xs flex items-center gap-2">➜ {inc.solution}</div>
                       </div>
                   ))}
               </div>
           </div>
        </div>
      </div>

      <RagExplainer />
      <ProjectDocs />
    </div>
  );
}

export default App;