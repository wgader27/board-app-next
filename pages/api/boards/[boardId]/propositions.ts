import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '~/src/db/prisma';

const BodyScheme = z.object({
  title: z.string().min(1).max(255),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const boardId = Number(req.query.boardId);

  if (isNaN(boardId)) {
    res.status(400).json({ message: 'Invalid boardId' });
    return;
  }

  const body = BodyScheme.safeParse(req.body);

  if (!body.success) {
    res.status(400).json({ message: 'Invalid body' });
    return;
  }

  const ip = String(
    req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1'
  );

  try {
    const proposition = await prisma.proposition.create({
      data: {
        title: body.data.title,
        boardId,
        ip
      },
    });

    res.status(201).json(proposition);
  } catch (error) {
    res.status(500).json({ message: 'Could not create proposition' });
  }
}
