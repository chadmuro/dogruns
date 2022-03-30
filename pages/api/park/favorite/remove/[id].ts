import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const favoriteId = req.query.id;

  const favorite = await prisma.favorite.delete({
    where: {
      id: favoriteId as string
    },
  });
  res.json(favorite);
}