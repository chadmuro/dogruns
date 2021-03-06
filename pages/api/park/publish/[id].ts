import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const parkId = req.query.id;
  const park = await prisma.park.update({
    where: { id: parkId as string },
    data: { published: true },
  });
  res.json(park);
}