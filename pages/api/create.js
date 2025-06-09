import mongoose from 'mongoose';
import https from 'https';

const MONGODB_URI = process.env.MONGODB_URI;
const SSO_VALIDATE_URL = process.env.SSO_VALIDATE_URL;

if (!global._mongooseConnection) {
  global._mongooseConnection = mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const entrySchema = new mongoose.Schema({
  text: String,
  author: String,
  createdAt: { type: Date, default: Date.now }
});

const Entry = mongoose.models.Entry || mongoose.model('Entry', entrySchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, token } = req.body;

  if (!text || !token) {
    return res.status(400).json({ error: 'Missing text or token' });
  }

  try {
    const response = await fetch(`${SSO_VALIDATE_URL}?token=${token}`, {
      agent: new https.Agent({ rejectUnauthorized: false }),
    });

    const data = await response.json();
    if (!data.valid) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const entry = await Entry.create({
      text,
      author: data.identifier,
    });

    return res.status(200).json({ success: true, entry });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit entry', details: err.message });
  }
}
