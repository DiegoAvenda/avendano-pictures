// src/seed.ts – Populate the database with sample videos for the feed
// Usage:
//   pnpm seed           -> inserts sample videos only if the collection is empty
//   pnpm seed -- --force -> clears the collection and re-inserts the samples
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Video } from './models/Video.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

const sampleVideos = [
  {
    title: 'Big Buck Bunny',
    description:
      'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    duration: 596,
    views: 1284,
  },
  {
    title: 'Elephants Dream',
    description:
      'Two strange characters explore a wondrous mechanical world in this surreal animated short film.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    duration: 653,
    views: 942,
  },
  {
    title: 'Sintel',
    description:
      'A lonely young woman travels the land searching for the dragon she once befriended.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnailUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    duration: 888,
    views: 3210,
  },
  {
    title: 'Tears of Steel',
    description:
      'A group of warriors and scientists gather in Amsterdam to prevent a robot apocalypse.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    duration: 734,
    views: 1789,
  },
  {
    title: 'For Bigger Blazes',
    description: 'Short promotional clip showcasing vibrant visuals and motion.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    duration: 15,
    views: 415,
  },
  {
    title: 'For Bigger Escapes',
    description: 'Short promotional clip featuring fast-paced adventure scenes.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    duration: 15,
    views: 368,
  },
];

const run = async () => {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI not defined in .env');
    process.exit(1);
  }

  const force = process.argv.includes('--force');

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await Video.countDocuments();
  if (existing > 0 && !force) {
    console.log(
      `ℹ️  Found ${existing} existing video(s). Nothing to do. Re-run with "--force" to reset.`
    );
    await mongoose.disconnect();
    return;
  }

  if (existing > 0) {
    await Video.deleteMany({});
    console.log(`🗑️  Removed ${existing} existing video(s)`);
  }

  const inserted = await Video.insertMany(sampleVideos);
  console.log(`🌱 Seeded ${inserted.length} videos`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});