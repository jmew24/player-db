import type { NextApiRequest, NextApiResponse } from "next";
import { Sport } from "@prisma/client";

import prisma from "@lib/prisma";
import redisClient from "@lib/redis";

// GET /api/players?sport=:sport
// GET /api/players?sport=:sport&query=:query
// GET /api/players?sport=:sport&team=:team
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.sport) return res.json([]);

  const sportQuery = (req.query.sport as string).trim();
  const sportCacheStr =
    (await redisClient.get(`sportCache:${sportQuery.toLowerCase()}`)) ?? "{}";
  const sportCache = JSON.parse(sportCacheStr);
  let sport: Sport | null = null;

  if (sportCacheStr !== "{}") {
    if (
      sportCache &&
      sportCache?.name.toLowerCase() === sportQuery.toLowerCase()
    ) {
      sport = { ...sportCache } as Sport;
    }
  }

  if (!sport) {
    sport = await prisma.sport.findFirst({
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
    if (sport)
      redisClient.set(
        `sportCache:${sportQuery.toLowerCase()}`,
        JSON.stringify({ ...sportCache, ...sport })
      );
  }

  if (!sport) return res.json([]);

  const resultCacheStr =
    (await redisClient.get(`playerCache:${sportQuery.toLowerCase()}`)) ?? "{}";
  const playerCache = JSON.parse(resultCacheStr);
  let results = [];

  if (req.query.query) {
    const nameQuery = (req.query.query as string).trim();
    const fullName = nameQuery.replace(/\s+/g, " ");
    const firstName = fullName.split(" ")[0]?.trim() ?? fullName;
    const lastName = fullName.split(" ")[1]?.trim() ?? fullName;

    if (resultCacheStr !== "{}") {
      if (playerCache) {
        const fullNameLower = fullName.toLowerCase();
        const firstNameLower = firstName.toLowerCase();
        const lastNameLower = lastName.toLowerCase();
        for (const index in playerCache) {
          const player = playerCache[index];
          if (
            player?.sport?.id === sport.id &&
            (player?.fullName?.toLowerCase().includes(fullNameLower) ||
              (player?.firstName?.toLowerCase().includes(firstNameLower) &&
                player?.lastName?.toLowerCase().includes(lastNameLower)))
          ) {
            results.push(player);
          }
        }
      }
    }

    if (results.length === 0) {
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
      if (results.length > 0)
        redisClient.set(
          `playerCache:${sportQuery.toLowerCase()}`,
          JSON.stringify({ ...playerCache, ...results })
        );
    }
  } else if (req.query.team) {
    const teamQuery = (req.query.team as string).trim();

    if (resultCacheStr !== "{}") {
      if (playerCache && playerCache) {
        const teamQueryLower = teamQuery.toLowerCase();
        for (const index in playerCache) {
          const player = playerCache[index];
          if (
            player?.sport?.id === sport.id &&
            (player?.team?.fullName.toLowerCase().includes(teamQueryLower) ||
              player?.team?.shortName.toLowerCase().includes(teamQueryLower) ||
              player?.team?.city.toLowerCase().includes(teamQueryLower) ||
              player?.team?.abbreviation.toLowerCase().includes(teamQueryLower))
          ) {
            results.push(player);
          }
        }
      }
    }

    if (results.length === 0) {
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
      if (results.length > 0)
        redisClient.set(
          `playerCache:${sportQuery.toLowerCase()}`,
          JSON.stringify({ ...playerCache, ...results })
        );
    }
  } else {
    if (resultCacheStr !== "{}") {
      if (playerCache && playerCache) {
        for (const player of playerCache) {
          if (player?.sportId === sport.id) results.push(player);
        }
      }
    }

    if (results.length === 0) {
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
      if (results.length > 0)
        redisClient.set(
          `playerCache:${sportQuery.toLowerCase()}`,
          JSON.stringify({ ...playerCache, ...results })
        );
    }
  }

  return res.json(results);
}
