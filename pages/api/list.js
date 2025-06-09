import dbConnect from '../../lib/db';
import Entry from '../../models/Entry';

export default async function handler(req, res) {
  try {
    await dbConnect();

    const entries = await Entry.find({}, null, { sort: { createdAt: 1 } }).lean();

    return res.status(200).json(entries);
  } catch (error) {
    console.error('[LIST ERROR]', error);
    return res.status(500).json({ error: 'Failed to fetch entries', details: error.message });
  }
}
