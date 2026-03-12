'use client';

import { Button } from "~/src/components/form/Bouton";
import { Input} from "~/src/components/form/Input";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export const BoardForm = () => {
  const router = useRouter();
  
  const handleSubmit = (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title"));

    fetch('/api/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    }).then(res => res.json())
      .then(data => {
        router.push('/');
        router.refresh();
      })
      .catch(err => {
        console.error(err);
      });


  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Input label="Title" name="title" />
        <Button type="submit">Create board</Button>

    </form>
  ); 
};
