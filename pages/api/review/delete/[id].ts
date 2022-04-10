import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const reviewId = req.query.id;

  if (session) {
    const review = await prisma.review.delete({
      where: { id: reviewId as string },
    });
    res.json(review);
  } else {
    res.status(401);
  }
}