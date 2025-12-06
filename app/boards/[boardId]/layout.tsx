import React, {PropsWithChildren } from 'react'

export default function LayoutBoard({
    params,
    children
  }: PropsWithChildren<{
    params: { boardId: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }>) {
  
    return (
    <div>
        <h2>Boards ({params.boardId})</h2>
        {children}
    </div>
    );
}

