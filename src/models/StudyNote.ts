import mongoose from 'mongoose';

const StudyNoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    fileUrl: {
      type: String,
      trim: true,
      default: '',
    },
    fileSizeLabel: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'studynotes',
  }
);

export default mongoose.models.StudyNote || mongoose.model('StudyNote', StudyNoteSchema);
