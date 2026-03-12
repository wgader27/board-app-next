import { Board, Proposition } from '@prisma/client';
import Link from 'next/link';
import { Check, Trash2, ListTree } from 'lucide-react';
import { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

type BoardCardProps = {
  board: Board & { proposition?: Proposition[] };
};

export const BoardCard = ({ board }: BoardCardProps) => {
  const router = useRouter();
  
  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Stop Link navigation
    e.stopPropagation(); // Stop drag and drop click
    
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
    
    await fetch(`/api/boards/${board.id}`, { method: 'DELETE' });
    router.refresh();
  };

  const totalProps = board.proposition?.length || 0;
  const completedProps = board.proposition?.filter(p => p.isCompleted).length || 0;

  return (
    <Link
      href={`/boards/${board.id}`}
      className="block w-full p-5 rounded-xl shadow-md bg-slate-800/80 backdrop-blur-md border border-slate-700 hover:bg-slate-700/90 select-none cursor-grab active:cursor-grabbing transition-colors duration-200 group relative"
    >
      <div className="flex justify-between items-start">
         <div className="flex flex-col gap-2">
           <h5 className="text-lg font-medium text-slate-100 group-hover:text-blue-200 transition-colors pr-6">{board.title}</h5>
           
           <div className="flex items-center gap-3">
             <span className="text-xs text-slate-400 font-mono">
               {new Date(board.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
             </span>
             {totalProps > 0 && (
               <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                 completedProps === totalProps 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
               }`}>
                 <ListTree size={12} />
                 {completedProps}/{totalProps}
               </span>
             )}
           </div>
         </div>
         
         <div className="flex flex-col gap-2 items-end">
           {board.status === 'DONE' && (
             <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-full border border-emerald-500/30 shrink-0">
               <Check size={16} strokeWidth={3} />
             </div>
           )}
         </div>
      </div>
      
      <button 
        onClick={handleDelete}
        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={16} />
      </button>
    </Link>
  );
};
