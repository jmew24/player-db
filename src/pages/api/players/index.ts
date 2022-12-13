import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prisma";

// GET /api/players?sport=:sport
// GET /api/players?sport=:sport&query=:query
// GET /api/players?sport=:sport&team=:team
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.sport) return res.json([]);

  try {
    const sportQuery = (req.query.sport as string).trim();

    const sport = await prisma.sport.findFirst({
      where: {
        name: {
          equals: sportQuery,
          mode: "insensitive",
        },
        OR: [
          {
            name: {
              equals: sportQuery.split(" ")[0],
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (!sport) return res.json([]);

    let results = [];

    if (req.query.query) {
      const nameQuery = (req.query.query as string).trim();
      const fullName = nameQuery.replace(/\s+/g, " ");
      const firstName = fullName.split(" ")[0]?.trim() ?? fullName;
      const lastName = fullName.split(" ")[1]?.trim() ?? fullName;

      results = await prisma.player.findMany({
        where: {
          sport: {
            id: sport.id,
          },
          AND:
            fullName.split(" ").length > 1
              ? {
                  AND: [
                    {
                      firstName: {
                        contains: firstName,
                        mode: "insensitive",
                      },
                      lastName: {
                        contains: lastName,
                        mode: "insensitive",
                      },
                    },
                  ],
                }
              : {
                  fullName: {
                    contains: fullName,
                    mode: "insensitive",
                  },
                },
        },
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
          team: {
            select: {
              identifier: true,
              fullName: true,
              city: true,
              shortName: true,
              abbreviation: true,
              league: true,
              source: true,
            },
          },
          sport: {
            select: {
              id: true,
              name: true,
              updatedAt: true,
            },
          },
        },
      });
    } else if (req.query.team) {
      const teamQuery = (req.query.team as string).trim();

      results = await prisma.player.findMany({
        where: {
          sport: {
            id: sport.id,
          },
          OR: [
            {
              team: {
                fullName: {
                  contains: teamQuery,
                  mode: "insensitive",
                },
              },
            },
            {
              team: {
                shortName: {
                  contains: teamQuery,
                  mode: "insensitive",
                },
              },
            },
            {
              team: {
                city: {
                  contains: teamQuery,
                  mode: "insensitive",
                },
              },
            },
            {
              team: {
                abbreviation: {
                  contains: teamQuery,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
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
          team: {
            select: {
              identifier: true,
              fullName: true,
              city: true,
              shortName: true,
              abbreviation: true,
              league: true,
              source: true,
            },
          },
          sport: {
            select: {
              id: true,
              name: true,
              updatedAt: true,
            },
          },
        },
      });
    } else {
      results = await prisma.player.findMany({
        where: {
          sport: {
            id: sport?.id,
          },
        },
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
          team: {
            select: {
              identifier: true,
              fullName: true,
              city: true,
              shortName: true,
              abbreviation: true,
              league: true,
              source: true,
            },
          },
          sport: {
            select: {
              id: true,
              name: true,
              updatedAt: true,
            },
          },
        },
      });
    }

    return res.json(results);
  } catch (error) {
    console.log(error);
    return res.json([]);
  }
}
