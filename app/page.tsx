import { KanbanBoard } from "~/src/components/board/KanbanBoard";
import { Button } from "~/src/components/form/Bouton";
import { prisma } from "~/src/db/prisma"

export default async function Home() {
  const boards = await prisma?.board.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
    include: {
      proposition: true
    }
  });
  return (
  <div className="flex flex-col gap-10">
    <div className="flex justify-between items-end pb-6 border-b border-slate-700/50">
      <div>
        <h1 className="text-5xl font-extrabold text-white drop-shadow-sm">
          Board List
        </h1>
        <p className="text-slate-400 mt-2 font-medium">Gérez vos tâches avec élégance et simplicité.</p>
      </div>
      <Button as="a" href="/boards/new" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all font-semibold flex items-center gap-2">
        <span className="text-xl leading-none">+</span>
        Nouvelle Tâche
      </Button>
    </div>
    <KanbanBoard initialBoards={boards} />
  </div>
  );
}
