import { Prisma } from "@prisma/client";

import { prisma } from "../config/database.js";

export type JeeCutoffAggregateRow = {
  collegeId: string;
  collegeName: string;
  collegeSlug: string;
  collegeState: string | null;
  bestClosing: number;
};

export const jeePredictorRepository = {
  async getLatestCutoffYear(): Promise<number | null> {
    const agg = await prisma.cutoff.aggregate({ _max: { year: true } });
    return agg._max.year;
  },

  /**
   * Per college: max(closingRank) among cutoffs matching category/year and branch preference patterns.
   * Higher closing = easier branch (for same category), so MAX is the best shot on that college.
   */
  async aggregateBestClosingByCollege(params: {
    year: number;
    category: string;
    branchPreferences: string[];
  }): Promise<JeeCutoffAggregateRow[]> {
    const { year, category, branchPreferences } = params;
    const normalizedCategory = category.trim().toLowerCase();

    if (branchPreferences.length === 0) {
      return [];
    }

    /** Single `EXISTS` over `unnest` keeps the planner from exploding OR branches. */
    const prefArray = Prisma.sql`ARRAY[${Prisma.join(
      branchPreferences.map((p) => Prisma.sql`${p}`),
    )}]::text[]`;

    const rows = await prisma.$queryRaw<JeeCutoffAggregateRow[]>`
      SELECT
        col.id AS "collegeId",
        col.name AS "collegeName",
        col.slug AS "collegeSlug",
        col.state AS "collegeState",
        MAX(c."closingRank")::int AS "bestClosing"
      FROM "Cutoff" c
      INNER JOIN "College" col ON col.id = c."collegeId"
      INNER JOIN "Branch" b ON b.id = c."branchId"
      WHERE c."year" = ${year}
        AND LOWER(TRIM(c.category)) = ${normalizedCategory}
        AND c."closingRank" IS NOT NULL
        AND EXISTS (
          SELECT 1
          FROM unnest(${prefArray}) AS pref(token)
          WHERE b.name ILIKE ('%' || token || '%')
             OR COALESCE(b.code, '') ILIKE ('%' || token || '%')
        )
      GROUP BY col.id, col.name, col.slug, col.state
      HAVING MAX(c."closingRank") IS NOT NULL
      ORDER BY "bestClosing" DESC
      LIMIT 500
    `;

    return rows;
  },
};
