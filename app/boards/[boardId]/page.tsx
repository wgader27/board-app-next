import { prisma } from "~/src/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { Proposition } from "~/src/components/proposition/PropositionLine";
import { PropositionForm } from "./PropositionForm";

export default async function BoardPage({
    params
  }: {
    params: { boardId: string };
  }) {
    const boardId = parseInt(params.boardId);

    if (isNaN(boardId)) {
        return notFound();
    }

    const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: {
            proposition: {
                include: {
                    vote: true
                }
            }
        }
    });

    if (!board) {
        return notFound();
    }

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm w-fit font-medium">
                <ArrowLeft size={16} />
                Retour au Kanban
            </Link>

            <div className="bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                {/* Decorative glows */}
                {board.status === 'DONE' ? (
                  <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
                ) : (
                  <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                )}
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white mb-4">{board.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <Clock size={16} />
                                Créé le {new Date(board.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric'})}
                            </div>
                            
                            {board.status === 'DONE' ? (
                                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    <CheckCircle2 size={16} />
                                    Terminé
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                    <ListTodo size={16} />
                                    À Faire
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
                <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-700/50 pb-4">Propositions / Sous-Tâches</h2>
                
                <PropositionForm boardId={board.id} />

                {board.proposition.length === 0 ? (
                    <div className="text-center p-8 bg-slate-800/20 border border-slate-700/30 rounded-2xl text-slate-500">
                        Aucune proposition pour le moment.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {board.proposition.map(prop => (
                            <Proposition 
                                key={prop.id} 
                                title={prop.title} 
                                id={prop.id} 
                                voteCount={prop.vote.length}
                                isCompleted={prop.isCompleted}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
