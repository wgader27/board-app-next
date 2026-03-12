'use client';

import { UpVote } from './UpVote';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type PropositionLineProps = {
  title: string;
  id: number;
  voteCount: number;
  isCompleted: boolean;
};

export const Proposition = ({ title, id, voteCount, isCompleted }: PropositionLineProps) => {
  const router = useRouter();

  const handleToggle = async () => {
    await fetch(`/api/propositions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: !isCompleted })
    });
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Voulez-vous supprimer cette sous-tâche ?")) return;
    await fetch(`/api/propositions/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="p-5 flex justify-between items-center bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-xl gap-4 w-full shadow-md transition-colors hover:bg-slate-700/60 group">
      <div className="flex items-center gap-4 flex-1">
        <label className="flex items-center cursor-pointer relative">
          <input 
            type="checkbox" 
            checked={isCompleted} 
            onChange={handleToggle}
            className="peer sr-only"
          />
          <div className="w-6 h-6 rounded-md border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-all">
            <svg 
              className={`w-4 h-4 text-white ${isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} transition-all duration-200`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </label>
        
        <h5 className={`text-xl font-medium transition-all ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
          {title}
        </h5>
      </div>
      
      <div className="flex items-center gap-4">
        <UpVote voteCount={voteCount} propositionId={id} />
        
        <button 
          onClick={handleDelete}
          className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          title="Supprimer"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};
