import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const parkHoursId = req.query.id;
  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday, extra } = req.body;

  const parkHours = await prisma.parkHours.update({
    where: { id: parkHoursId as string },
    data: {
      monday, tuesday, wednesday, thursday, friday, saturday, sunday, extra
    },
  });
  res.json(parkHours);
}