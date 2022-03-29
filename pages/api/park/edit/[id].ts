import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const parkId = req.query.id;
  const { name, nameJapanese, address, addressJapanese, google, image, price, type } = req.body;

  const park = await prisma.park.update({
    where: { id: parkId as string },
    data: {
        name,
        nameJapanese,
        address,
        addressJapanese,
        googleMapLink: google,
        mainImage: image,
        price,
        type,
      },
  });
  res.json(park);
}