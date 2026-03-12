import { FormEvent } from "react";
import { BoardForm } from "./BoardForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewBoardPage() { 
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-lg bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 w-full flex flex-col gap-6">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm w-fit font-medium">
            <ArrowLeft size={16} />
            Retour à la liste
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Nouvelle Tâche</h1>
            <p className="text-slate-400 mt-2 text-sm">Créez une nouvelle tâche à accomplir.</p>
          </div>
          <BoardForm/>
        </div>
      </div>
    </div>
  )
}
