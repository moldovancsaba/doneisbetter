import { ICard } from "./Card";

export interface ISession {
    sessionId: string;
    status: 'active' | 'idle' | 'completed' | 'expired';
    deck: ICard[];
    createdAt: Date;
    lastActivity: Date;
    completedAt?: Date;
    expiresAt: Date;
    swipes: {
        cardId: string;
        direction: 'left' | 'right';
        timestamp: Date;
    }[];
    votes: {
        cardA: string;
        cardB: string;
        winner: string;
        timestamp: Date;
    }[];
    personalRanking: string[];
}
