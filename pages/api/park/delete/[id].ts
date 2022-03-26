import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const parkId = req.query.id;
  const park = await prisma.park.delete({
    where: { id: parkId as string },
  });
  res.json(park);
}