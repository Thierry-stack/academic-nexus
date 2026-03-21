import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import SearchAnalytics from '@/models/SearchAnalytics';
import { getLibrarianAuth } from '@/lib/getLibrarianAuth';
import {
  isMongoUriMissing,
  MONGO_URI_MISSING_MESSAGE,
  mongoConnectFailedBody,
  isMongoConfigErrorMessage,
  isMongoConnectivityFailure,
} from '@/lib/mongoEnv';

export const dynamic = 'force-dynamic';

function periodMatch(dateThreshold: Date) {
  return {
    createdAt: { $gte: dateThreshold },
    query: { $nin: [null, ''] },
  } as const;
}

export async function GET(request: NextRequest) {
  const auth = getLibrarianAuth(request);
  if (!auth.ok) return auth.response;

  try {
    if (isMongoUriMissing()) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const match = periodMatch(dateThreshold);

    const [facetRow] = await SearchAnalytics.aggregate([
      { $match: match },
      {
        $facet: {
          totalRow: [{ $count: 'totalSearches' }],
          uniqueRow: [
            { $group: { _id: { $toLower: '$query' } } },
            { $count: 'uniqueQueryCount' },
          ],
          foundRow: [
            { $match: { resultsCount: { $gt: 0 } } },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                avgResultsWhenFound: { $avg: '$resultsCount' },
              },
            },
          ],
          notFoundRow: [
            { $match: { resultsCount: { $eq: 0 } } },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const totalSearches = facetRow?.totalRow?.[0]?.totalSearches ?? 0;
    const uniqueQueryCount = facetRow?.uniqueRow?.[0]?.uniqueQueryCount ?? 0;
    const searchesWithResults = facetRow?.foundRow?.[0]?.count ?? 0;
    const avgResultsWhenFound = facetRow?.foundRow?.[0]?.avgResultsWhenFound ?? null;
    const searchesWithNoResults = facetRow?.notFoundRow?.[0]?.count ?? 0;

    const popularSearches = await SearchAnalytics.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $toLower: '$query' },
          displayQuery: { $first: '$query' },
          count: { $sum: 1 },
          avgResults: { $avg: '$resultsCount' },
          lastSearched: { $max: '$createdAt' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    const lowYieldSearches = await SearchAnalytics.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $toLower: '$query' },
          displayQuery: { $first: '$query' },
          searchCount: { $sum: 1 },
          avgResults: { $avg: '$resultsCount' },
          lastSearched: { $max: '$createdAt' },
        },
      },
      {
        $match: {
          avgResults: { $eq: 0 },
        },
      },
      { $sort: { searchCount: -1 } },
      { $limit: 25 },
    ]);

    const searchTrends = await SearchAnalytics.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          searches: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      totalSearches,
      uniqueQueryCount,
      searchesWithResults,
      searchesWithNoResults,
      avgResultsWhenFound,
      avgResultsWhenNotFound: 0,
      popularSearches: popularSearches.map((row) => ({
        _id: row.displayQuery,
        count: row.count,
        avgResults: Math.round((row.avgResults as number) * 10) / 10,
        lastSearched: row.lastSearched,
      })),
      lowYieldSearches: lowYieldSearches.map((row) => ({
        query: row.displayQuery,
        searchCount: row.searchCount,
        lastSearched: row.lastSearched,
      })),
      searchTrends,
      period: `${days} days`,
    });
  } catch (error) {
    console.error('Analytics API Error:', error);

    if (error instanceof Error && isMongoConfigErrorMessage(error.message)) {
      return NextResponse.json({ error: MONGO_URI_MISSING_MESSAGE }, { status: 503 });
    }
    if (isMongoConnectivityFailure(error)) {
      return NextResponse.json({ error: mongoConnectFailedBody(error) }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
