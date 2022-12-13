import type { NextApiRequest, NextApiResponse } from "next";
import { Sport } from "@prisma/client";

import prisma from "@lib/prisma";
import redis from "@lib/redis";

// GET /api/teams?sport=:sport
// GET /api/teams?sport=:sport&query=:query
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.sport) return res.json([]);

  const sportQuery = (req.query.sport as string).trim();
  const sportCacheStr =
    (await redis.get(`sportCache:${sportQuery.toLowerCase()}`)) ?? "{}";
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
      redis.set(
        `sportCache:${sportQuery.toLowerCase()}`,
        JSON.stringify({ ...sportCache, ...sport }),
        "EX",
        60
      );
  }

  if (!sport) return res.json([]);

  const resultCacheStr =
    (await redis.get(`teamCache:${sportQuery.toLowerCase()}`)) ?? "{}";
  const teamCache = JSON.parse(resultCacheStr);
  let results = [];

  if (req.query.query) {
    const nameQuery = (req.query.query as string).trim();

    if (resultCacheStr !== "{}") {
      if (teamCache) {
        const teamQueryLower = nameQuery.toLowerCase();
        for (const index in teamCache) {
          const team = teamCache[index];
          if (
            team?.sport?.id === sport.id &&
            (team?.fullName.toLowerCase().includes(teamQueryLower) ||
              team?.shortName.toLowerCase().includes(teamQueryLower) ||
              team?.city.toLowerCase().includes(teamQueryLower) ||
              team?.abbreviation.toLowerCase().includes(teamQueryLower))
          ) {
            results.push(team);
          }
        }
      }
    }

    if (results.length === 0) {
      results = await prisma.team.findMany({
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
      if (results.length > 0)
        redis.set(
          `teamCache:${sportQuery.toLowerCase()}`,
          JSON.stringify({ ...teamCache, ...results }),
          "EX",
          60
        );
    }
  } else {
    if (resultCacheStr !== "{}") {
      if (teamCache) {
        for (const index in teamCache) {
          const team = teamCache[index];
          if (team?.sport.id === sport.id) results.push(team);
        }
      }
    }

    if (results.length === 0) {
      results = await prisma.team.findMany({
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
      if (results.length > 0)
        redis.set(
          `teamCache:${sportQuery.toLowerCase()}`,
          JSON.stringify({ ...teamCache, ...results }),
          "EX",
          60
        );
    }
  }

  return res.json(results);
}
