import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prisma";

// POST /api/hockey/teams
// Required fields in body: id, city, abbreviation, shortName, sport, league
// Optional fields in body:
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, city, abbreviation, shortName, sport, league } = req.body;

  try {
    const result = await prisma.team.upsert({
      where: {
        identifier: `${id}-${city.toLowerCase()}-${shortName.toLowerCase()}`,
      },
      update: {
        identifier: `${id}-${city.toLowerCase()}-${shortName.toLowerCase()}`,
        fullName: `${city} ${shortName}`,
        city,
        abbreviation,
        shortName,
        sport,
        league,
      },
      create: {
        identifier: `${id}-${city.toLowerCase()}-${shortName.toLowerCase()}`,
        fullName: `${city} ${shortName}`,
        city,
        abbreviation,
        shortName,
        sport,
        league,
      },
    });
    res.json(result);
  } catch {
    res.status(500).send({} as Team);
  }
}
