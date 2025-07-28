import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Session } from '@/models/Session';
import { VoteRequestSchema } from '@/lib/zod/schemas';
import { verifySession } from '@/lib/session-manager';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { sessionData, ...voteData } = body;

    const isValidSession = await verifySession(sessionData);
    if (!isValidSession) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }

    const { success, data } = VoteRequestSchema.safeParse(voteData);

    if (!success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { sessionId, cardA, cardB, winner } = data;

    const session = await Session.findOne({ sessionId });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    session.votes.push({ cardA, cardB, winner, timestamp: new Date() });

    const rightSwipedCards = session.swipes.filter((s: {direction: string}) => s.direction === 'right').map((s: {cardId: string}) => s.cardId);
    const newCard = rightSwipedCards[rightSwipedCards.length - 1];

    if (session.personalRanking.length === 0) {
        const rightSwipes = session.swipes.filter((s: {direction: string}) => s.direction === 'right');
        // First right swipe
        if(rightSwipes.length === 1) {
            session.personalRanking.push(newCard);
        } else {
            // This is the first vote
            if (winner === cardA) {
                session.personalRanking.push(cardA, cardB);
            } else {
                session.personalRanking.push(cardB, cardA);
            }
        }
    } else {
    const votesForNewCard = session.votes.filter((v: {cardA: string, cardB: string}) => v.cardA === newCard || v.cardB === newCard);
        let insertIndex = session.personalRanking.length;

        for(let i=0; i<session.personalRanking.length; i++) {
            const rankedCard = session.personalRanking[i];
        const vote = votesForNewCard.find((v: {cardA: string, cardB: string, winner: string}) => (v.cardA === newCard && v.cardB === rankedCard) || (v.cardA === rankedCard && v.cardB === newCard));
            if(vote && vote.winner === newCard) {
                insertIndex = i;
                break;
            }
        }
        session.personalRanking.splice(insertIndex, 0, newCard);
    }

    let nextComparison = null;
    const rankedCards = session.personalRanking;
    const unrankedCards = rightSwipedCards.filter((c: string) => !rankedCards.includes(c));

    if(unrankedCards.length > 0) {
        const cardToRank = unrankedCards[0];
        const highestRankedCard = rankedCards[0];
        nextComparison = {
            newCard: cardToRank,
            compareAgainst: highestRankedCard,
        }
    }


    await session.save();

    return NextResponse.json({
      success: true,
      currentRanking: session.personalRanking,
      nextComparison
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
