import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prisma";

// POST /api/player
// Required fields in body: id, firstName, lastName, position, teamIdentifier, logoUrl, linkUrl, sport
// Optional fields in body:
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    id,
    firstName,
    lastName,
    position,
    teamIdentifier,
    logoUrl,
    linkUrl,
    sport,
  } = req.body;

  try {
    const result = await prisma.player.upsert({
      where: {
        identifier: `${id}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      },
      update: {
        identifier: `${id}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        position,
        logoUrl,
        linkUrl,
        sport,
        team: { connect: { identifier: teamIdentifier } },
      },
      create: {
        identifier: `${id}-${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        position,
        logoUrl,
        linkUrl,
        sport,
        team: { connect: { identifier: teamIdentifier } },
      },
    });
    res.json(result);
  } catch {
    res.status(500).send({} as Player);
  }
}
