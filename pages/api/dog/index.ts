import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  const { name, image, breed, birthdate } = req.body;
  if (session) {
    const dog = await prisma.dog.create({
      data: {
        name,
        image,
        breed,
        birthdate,
        user: { connect: { email: session?.user?.email as string | undefined }},
      }
    });
    res.json(dog);
  } else {
    res.status(401);
  }
}