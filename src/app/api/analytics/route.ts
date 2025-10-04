import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import SearchAnalytics from '@/models/SearchAnalytics';

// Add this line to fix the dynamic server usage error
export const dynamic = 'force-dynamic';

// GET - Get search analytics (for librarians)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);
    
    // Get popular searches
    const popularSearches = await SearchAnalytics.aggregate([
      {
        $match: {
          createdAt: { $gte: dateThreshold },
          query: { $ne: '' }
        }
      },
      {
        $group: {
          _id: '$query',
          count: { $sum: 1 },
          avgResults: { $avg: '$resultsCount' },
          lastSearched: { $max: '$createdAt' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 20
      }
    ]);
    
    // Get search trends over time
    const searchTrends = await SearchAnalytics.aggregate([
      {
        $match: {
          createdAt: { $gte: dateThreshold }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          searches: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    const totalSearches = await SearchAnalytics.countDocuments({
      createdAt: { $gte: dateThreshold }
    });
    
    return NextResponse.json({
      popularSearches,
      searchTrends,
      totalSearches,
      period: `${days} days'
    });
    
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
