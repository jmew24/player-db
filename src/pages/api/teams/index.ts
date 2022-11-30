import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prisma";

// GET /api/teams?sport=:sport&query=:query
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.sport) {
    const sport = await prisma.sport.findFirst({
      where: {
        name: {
          equals: req.query.sport as string,
          mode: "insensitive",
        },
      },
    });

    if (sport && sport.id) {
      if (req.query.query) {
        const nameQuery = (req.query.query as string).trim();
        const results = await prisma.team.findMany({
          where: {
            sport: {
              id: sport?.id,
            },
            OR: [
              {
                fullName: {
                  contains: nameQuery,
                  mode: "insensitive",
                },
              },
              {
                city: {
                  contains: nameQuery,
                  mode: "insensitive",
                },
              },
              {
                shortName: {
                  contains: nameQuery,
                  mode: "insensitive",
                },
              },
              {
                abbreviation: {
                  contains: nameQuery,
                  mode: "insensitive",
                },
              },
            ],
          },
          select: {
            identifier: true,
            updatedAt: true,
            fullName: true,
            city: true,
            shortName: true,
            abbreviation: true,
            league: true,
            source: true,
            sport: {
              select: {
                id: true,
                name: true,
                updatedAt: true,
              },
            },
            players: {
              select: {
                identifier: true,
                updatedAt: true,
                fullName: true,
                firstName: true,
                lastName: true,
                position: true,
                number: true,
                headshotUrl: true,
                linkUrl: true,
                source: true,
              },
            },
          },
        });
        return res.json(results);
      } else {
        const results = await prisma.team.findMany({
          where: {
            sport: {
              id: sport?.id,
            },
          },
          select: {
            identifier: true,
            updatedAt: true,
            fullName: true,
            city: true,
            shortName: true,
            abbreviation: true,
            league: true,
            source: true,
            sport: {
              select: {
                id: true,
                name: true,
                updatedAt: true,
              },
            },
          },
        });
        return res.json(results);
      }
    }
  }

  return res.json([]);
}
