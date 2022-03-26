import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday, extra, parkId } = req.body;

  const session = await getSession({ req });
  if (session) {
    const result = await prisma.parkHours.create({
      data: {
        monday, tuesday, wednesday, thursday, friday, saturday, sunday, extra, parkId
      },
    });
    res.json(result);
  } else {
    res.status(401)
  }
}