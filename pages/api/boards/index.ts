import { Board } from "@prisma/client";
import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import  {z} from 'zod';

type Data = {
    boards: Board;
}

export default async function handler(
    req:NextApiRequest , 
    res: NextApiResponse 
) {

    if (req.method!== "POST") {
        res.status(405).end();
        return;

    }

}
