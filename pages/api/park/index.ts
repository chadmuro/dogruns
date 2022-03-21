import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, address, google, price } = req.body;

  const session = await getSession({ req });
  console.log(session)
  const result = await prisma.park.create({
    data: {
      name,
      address,
      googleMapLink: google,
      mainImage: "",
      price,
      user: { connect: { email: session?.user?.email as string | undefined }},
    },
  });
  res.json(result);
}