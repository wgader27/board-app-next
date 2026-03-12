'use client';

import { Board } from "@prisma/client";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { BoardCard } from "~/src/components/board/BoardCard";
import { useRouter } from "next/navigation";

export const KanbanBoard = ({ initialBoards }: { initialBoards: Board[] }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const [todos, setTodos] = useState<Board[]>([]);
  const [inProgress, setInProgress] = useState<Board[]>([]);
  const [dones, setDones] = useState<Board[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // Sort tasks by order (asc) so custom drag and drop maintains positions
    const sorted = [...initialBoards].sort((a, b) => a.order - b.order);
    
    setTodos(sorted.filter(b => b.status === "TODO"));
    setInProgress(sorted.filter(b => b.status === "IN_PROGRESS"));
    setDones(sorted.filter(b => b.status === "DONE"));
  }, [initialBoards]);

  if (!isMounted) return null; // Prevent hydration errors with dnd

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const getList = (id: string) => {
      if (id === 'todos') return todos;
      if (id === 'inProgress') return inProgress;
      return dones;
    };

    const startList = getList(source.droppableId);
    const endList = getList(destination.droppableId);

    const boardId = parseInt(draggableId);
    let newStatus = 'TODO';
    if (destination.droppableId === 'inProgress') newStatus = 'IN_PROGRESS';
    if (destination.droppableId === 'dones') newStatus = 'DONE';

    // Same column drag
    if (source.droppableId === destination.droppableId) {
      const newList = Array.from(startList);
      const [reorderedItem] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === 'todos') setTodos(newList);
      else if (source.droppableId === 'inProgress') setInProgress(newList);
      else setDones(newList);

      // Optimistic API Call for the moved item's order
      await fetch(`/api/boards/${boardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: destination.index })
      });
      router.refresh()
      return;
    }

    // Different column drag
    const startItems = Array.from(startList);
    const [movedItem] = startItems.splice(source.index, 1);
    
    movedItem.status = newStatus; // FIX UI state locally to remove old checkmark
    
    const endItems = Array.from(endList);
    endItems.splice(destination.index, 0, movedItem);

    if (source.droppableId === 'todos') setTodos(startItems);
    else if (source.droppableId === 'inProgress') setInProgress(startItems);
    else setDones(startItems);

    if (destination.droppableId === 'todos') setTodos(endItems);
    else if (destination.droppableId === 'inProgress') setInProgress(endItems);
    else setDones(endItems);
    
    await fetch(`/api/boards/${boardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, order: destination.index })
    });
    router.refresh();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-8 w-full">
        {/* TODO COLUMN */}
        <Droppable droppableId="todos">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="flex-1 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                <h2 className="text-xl font-semibold uppercase tracking-widest text-slate-300">À Faire</h2>
              </div>
              {todos.map((board, index) => (
                <Draggable key={board.id.toString()} draggableId={board.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500 rounded-xl' : ''}`}
                    >
                      <BoardCard board={board} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* IN_PROGRESS COLUMN */}
        <Droppable droppableId="inProgress">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="flex-1 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                <h2 className="text-xl font-semibold uppercase tracking-widest text-slate-300">En Cours</h2>
              </div>
              {inProgress.map((board, index) => (
                <Draggable key={board.id.toString()} draggableId={board.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? 'shadow-2xl ring-2 ring-orange-500 rounded-xl' : ''}`}
                    >
                      <BoardCard board={board} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* DONE COLUMN */}
        <Droppable droppableId="dones">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="flex-1 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 flex flex-col gap-4 shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h2 className="text-xl font-semibold uppercase tracking-widest text-emerald-400">Fini</h2>
              </div>
              {dones.map((board, index) => (
                <Draggable key={board.id.toString()} draggableId={board.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`opacity-60 hover:opacity-100 transition-opacity ${snapshot.isDragging ? 'opacity-100 shadow-2xl ring-2 ring-emerald-500 rounded-xl' : ''}`}
                    >
                      <BoardCard board={board} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};
