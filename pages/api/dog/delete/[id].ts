import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const dogId = req.query.id;

  if (session) {
    const dog = await prisma.dog.delete({
      where: { id: dogId as string },
    });
    res.json(dog);
  } else {
    res.status(401);
  }
}