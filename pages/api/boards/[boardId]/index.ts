import { prisma } from "~/src/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "PATCH" && req.method !== "DELETE") {
        res.status(405).end();
        return;
    }

    const { boardId } = req.query;

    if (!boardId || typeof boardId !== "string") {
        return res.status(400).json({ error: "Invalid board ID" });
    }

    if (req.method === "DELETE") {
        try {
            await prisma.board.delete({
                where: { id: parseInt(boardId) }
            });
            return res.status(200).json({ message: "Board deleted" });
        } catch (error) {
            console.error("Failed to delete board:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    if (!boardId || typeof boardId !== "string") {
        return res.status(400).json({ error: "Invalid board ID" });
    }

    const bodySchema = z.object({
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
        order: z.number().optional()
    });

    const parsedBody = bodySchema.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    try {
        const updatedBoard = await prisma.board.update({
            where: { id: parseInt(boardId) },
            data: {
                ...(parsedBody.data.status && { status: parsedBody.data.status }),
                ...(parsedBody.data.order !== undefined && { order: parsedBody.data.order })
            }
        });

        return res.status(200).json(updatedBoard);
    } catch (error) {
        console.error("Failed to update board:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
