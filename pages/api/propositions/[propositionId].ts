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

    const propositionId = req.query.propositionId;

    if (!propositionId || typeof propositionId !== "string") {
        return res.status(400).json({ error: "Invalid proposition ID" });
    }

    if (req.method === "DELETE") {
        try {
            await prisma.proposition.delete({
                where: { id: parseInt(propositionId) }
            });
            return res.status(200).json({ message: "Proposition deleted" });
        } catch (error) {
            console.error("Failed to delete proposition:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    if (req.method === "PATCH") {
        const bodySchema = z.object({
            isCompleted: z.boolean().optional(),
        });

        const parsedBody = bodySchema.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({ error: "Invalid payload" });
        }

        try {
            const updatedProp = await prisma.proposition.update({
                where: { id: parseInt(propositionId) },
                data: {
                    ...(parsedBody.data.isCompleted !== undefined && { isCompleted: parsedBody.data.isCompleted })
                }
            });

            return res.status(200).json(updatedProp);
        } catch (error) {
            console.error("Failed to update proposition:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
