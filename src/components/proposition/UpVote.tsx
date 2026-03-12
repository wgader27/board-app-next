'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { IoIosArrowUp } from 'react-icons/io';

type UpVoteProps = {
  voteCount: number;
  propositionId: number;
};

const onError = () => toast.error('You can only vote once');

export const UpVote = ({ voteCount, propositionId }: UpVoteProps) => {
  const router = useRouter();

  const handleClick = () => {
    fetch(`/api/propositions/${propositionId}/votes`, {
      method: 'POST',
    })
      .then((res) => {
        if (res.status === 201) {
          router.refresh();
          return;
        }
        onError();
      })
      .catch(() => {
        onError();
      });
  };

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center px-6 py-2 rounded-lg border transition-all shadow-sm ${
        voteCount > 0 
          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-emerald-500/10'
          : 'border-slate-600/50 bg-slate-800/50 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-slate-700'
      }`}
    >
      <IoIosArrowUp fontSize={24} className="mb-[-4px]" />
      <span className="text-lg font-bold">{voteCount}</span>
    </button>
  );
};
