import bcrypt from 'bcryptjs';

export async function verifySession(sessionData: any) {
    const { hash, ...data } = sessionData;
    if (!hash) return false;
    return await bcrypt.compare(JSON.stringify(data), hash);
}
