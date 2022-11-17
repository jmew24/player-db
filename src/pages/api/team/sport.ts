import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prisma";

// GET /api/team/sport?name=:name
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  const results = await prisma.team.findMany({
    where: {
      sport: {
        equals: name ? name.toString().toUpperCase() : "",
      },
    },
  });
  res.json(results);
}
