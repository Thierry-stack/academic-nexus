import mongoose from 'mongoose';

const ResearchPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    authors: {
      type: [String],
      default: [],
    },
    abstract: {
      type: String,
      required: [true, 'Abstract is required'],
    },
    publication: {
      type: String,
      required: [true, 'Publication is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 1000,
      max: 2100,
    },
    doi: {
      type: String,
      trim: true,
      default: '',
    },
    documentUrl: {
      type: String,
      trim: true,
      default: '',
    },
    citations: {
      type: Number,
      default: 0,
      min: 0,
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'researchpapers',
  }
);

export default mongoose.models.ResearchPaper ||
  mongoose.model('ResearchPaper', ResearchPaperSchema);
