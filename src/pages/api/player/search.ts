import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prisma";

// GET /api/player/search?query=:query
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, sports } = req.query;
  if (sports) {
    const results = await prisma.player.findMany({
      where: {
        sport: {
          in: Array.isArray(sports) ? sports : [sports],
        },
        fullName: {
          contains: Array.isArray(query) ? query[0] : query,
        },
      },
    });
    res.json(results);
  }

  const results = await prisma.player.findMany({
    where: {
      fullName: {
        contains: Array.isArray(query) ? query[0] : query,
      },
    },
    include: {
      team: true,
    },
  });
  res.json(results);
}
