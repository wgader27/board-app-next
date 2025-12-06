import { BoardCard } from "~/src/components/board/BoardCard";
import { Button } from "~/src/components/form/Bouton";
import { prisma } from "~/src/db/prisma"

export default async function Home() {
  const boards= await prisma?.board.findMany();
  return (
  <div className="flex flex-col gap-4">
    <h1 className="text-5xl font-bold">Board list</h1>
    <Button as="a" href="/boards/new" className="self-end">
      Create Board
    </Button>
    <ul className="flex flex-col gap-2">
      {boards.map(board => (
        <BoardCard key={board.id} board={board} />
      ))}
    </ul>
  </div>
  );
}
