import mongoose from 'mongoose';

const SearchAnalyticsSchema = new mongoose.Schema({
  query: {
    type: String,
    required: [true, 'Search query is required'],
    trim: true,
  },
  resultsCount: {
    type: Number,
    required: [true, 'Results count is required'],
    min: 0,
  },
  userAgent: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.models.SearchAnalytics || mongoose.model('SearchAnalytics', SearchAnalyticsSchema);