'use client';

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "~/src/components/form/Bouton";
import { Input } from "~/src/components/form/Input";

export const PropositionForm = ({ boardId }: { boardId: number }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title"));

    try {
      const response = await fetch(`/api/boards/${boardId}/propositions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });

      if (response.ok) {
        // Reset form
        (event.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        console.error("Failed to create proposition");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end w-full mb-6 bg-slate-800/20 p-6 rounded-2xl border border-slate-700/50">
      <div className="flex-1">
        <Input label="Nouvelle sous-tâche / Proposition" name="title" required placeholder="Que faut-il faire ?" />
      </div>
      <Button type="submit" disabled={loading} className="mb-6 whitespace-nowrap">
        {loading ? "Création..." : "Ajouter"}
      </Button>
    </form>
  );
};
