"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, X } from 'lucide-react';
import { ICard } from '@/interfaces/Card';
import { ISession } from '@/interfaces/Session';
import { SwipeableCard } from '@/components/SwipeableCard';
import { VoteComparison } from '@/components/VoteComparison';
import { ResultsView } from '@/components/ResultsView';
import { ProgressBar } from '@/components/ProgressBar';

export default function SwipePage() {
  const [session, setSession] = useState<ISession | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading, swipe, vote, results
  const [personalRanking, setPersonalRanking] = useState<ICard[]>([]);
  const [globalRanking, setGlobalRanking] = useState([]);
  const [currentVoteContext, setCurrentVoteContext] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const dragOffset = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      setSession(parsedSession);
      setPhase('swipe');
    } else {
      router.push('/');
    }
  }, [router]);

  const moveToNextCard = () => {
    if (session && currentCardIndex < session.deck.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      finishSession();
    }
  };

  const finishSession = async () => {
    if (session) {
      await fetch('/api/v1/session/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.sessionId }),
      });
      const response = await fetch('/api/v1/global-ranking');
      const data = await response.json();
      setGlobalRanking(data.ranking);
      setPhase('results');
    }
  };

  const handleSwipe = useCallback(async (cardId: string, direction: 'left' | 'right') => {
    if (isAnimating || phase !== 'swipe' || !session) return;

    setIsAnimating(true);

    const response = await fetch('/api/v1/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionData: session,
            swipeData: {
                sessionId: session.sessionId,
                cardId,
                direction,
            }
        }),
    });
    const data = await response.json();

    setTimeout(() => {
      if (data.requiresVoting) {
        setCurrentVoteContext(data.votingContext);
        setPhase('vote');
      } else {
        moveToNextCard();
      }
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, phase, session, currentCardIndex]);

  const handleVote = useCallback(async (cardA: string, cardB: string, winner: string) => {
    if (phase !== 'vote' || !currentVoteContext || !session) return;

    const response = await fetch('/api/v1/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionData: session,
            voteData: {
                sessionId: session.sessionId,
                cardA,
                cardB,
                winner,
            }
        }),
    });
    const data = await response.json();

    setPersonalRanking(data.currentRanking);

    if (data.nextComparison) {
      setCurrentVoteContext(data.nextComparison);
    } else {
      setPhase('swipe');
      moveToNextCard();
    }
  }, [phase, currentVoteContext, session, personalRanking]);

  const handleRestart = () => {
    localStorage.removeItem('session');
    router.push('/');
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (phase === 'swipe' && !isAnimating && session && currentCardIndex < session.deck.length) {
      if (e.key === 'ArrowLeft') {
        handleSwipe(session.deck[currentCardIndex].uuid, 'left');
      } else if (e.key === 'ArrowRight') {
        handleSwipe(session.deck[currentCardIndex].uuid, 'right');
      }
    }
  }, [phase, isAnimating, currentCardIndex, session, handleSwipe]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (phase === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your deck...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-80px)]">
        {phase !== 'results' && (
          <ProgressBar
            current={currentCardIndex + 1}
            total={session.deck.length}
            phase={phase}
          />
        )}

        {phase === 'swipe' && currentCardIndex < session.deck.length && (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="w-full max-w-xs mx-auto" style={{ aspectRatio: '3/4' }}>
                <SwipeableCard
                  card={session.deck[currentCardIndex]}
                  onSwipe={handleSwipe}
                  isAnimating={isAnimating}
                  dragOffset={dragOffset}
                />
              </div>
            </div>

            <div className="flex-shrink-0 flex justify-center gap-6 pb-8 pt-4">
              <button
                onClick={() => handleSwipe(session.deck[currentCardIndex].uuid, 'left')}
                className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none"
                disabled={isAnimating}
              >
                <X className="w-7 h-7" />
              </button>
              <button
                onClick={() => handleSwipe(session.deck[currentCardIndex].uuid, 'right')}
                className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none"
                disabled={isAnimating}
              >
                <Heart className="w-7 h-7" />
              </button>
            </div>
          </div>
        )}

        {phase === 'vote' && currentVoteContext && (
          <div className="h-full max-h-[calc(100vh-200px)]">
            <VoteComparison
              cardA={session.deck.find(c => c.uuid === currentVoteContext.newCard)}
              cardB={session.deck.find(c => c.uuid === currentVoteContext.compareAgainst)}
              onVote={handleVote}
            />
          </div>
        )}

        {phase === 'results' && (
          <div className="h-full max-h-[calc(100vh-200px)]">
            <ResultsView
              personalRanking={personalRanking}
              globalRanking={globalRanking}
              onRestart={handleRestart}
            />
          </div>
        )}
      </main>

      {phase === 'swipe' && (
        <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs z-50 border border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Desktop:</strong> Drag cards or use ← → keys<br/>
            <strong>Mobile:</strong> Swipe left (dislike) or right (like)
          </p>
        </div>
      )}
    </div>
  );
}
