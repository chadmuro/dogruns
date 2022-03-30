import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const parkId = req.query.id;

  const favorite = await prisma.favorite.create({
    data: {
      user: { connect: { email: session?.user?.email as string | undefined }},
      park: { connect: { id: parkId as string } },
    }
  });
  res.json(favorite);
}