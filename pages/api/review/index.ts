import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  const { rating, comment, parkId } = req.body;
  if (session) {
    const review = await prisma.review.create({
      data: {
        park: { connect: { id: parkId } },
        comment,
        rating,
        user: { connect: { email: session?.user?.email as string | undefined }},
      }
    });
    res.json(review);
  } else {
    res.status(401);
  }
}