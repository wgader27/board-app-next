import { Board } from "@prisma/client";
import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import  {z} from 'zod';

type Data = {
    boards: Board;
}

import { prisma } from "~/src/db/prisma";

export default async function handler(
    req:NextApiRequest , 
    res: NextApiResponse 
) {

    if (req.method!== "POST") {
        res.status(405).end();
        return;

    }

    const bodySchema = z.object({
        title: z.string().min(1).max(255)
    });

    const parsedBody = bodySchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid board title" });
    }

    const newBoard = await prisma.board.create({
        data: {
            title: parsedBody.data.title
        }
    });

    return res.status(201).json(newBoard);
}
