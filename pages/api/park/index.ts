import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, nameJapanese, address, addressJapanese, google, image, price, type } = req.body;

  const session = await getSession({ req });
  if (session) {
    const result = await prisma.park.create({
      data: {
        name,
        nameJapanese,
        address,
        addressJapanese,
        googleMapLink: google,
        mainImage: image,
        price,
        type,
        user: { connect: { email: session?.user?.email as string | undefined }},
      },
    });
    res.json(result);
  } else {
    res.status(401)
  }
}