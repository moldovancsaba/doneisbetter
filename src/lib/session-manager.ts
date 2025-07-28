import bcrypt from 'bcryptjs';
import { ICard } from '@/interfaces/Card';

interface SessionData {
    sessionId: string;
    expiresAt: string;
    deck: ICard[];
    hash: string;
}

export async function verifySession(sessionData: SessionData) {
    const { hash, ...data } = sessionData;
    if (!hash) return false;
    return await bcrypt.compare(JSON.stringify(data), hash);
}
