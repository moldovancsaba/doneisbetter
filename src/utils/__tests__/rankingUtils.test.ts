import { updateRanks, persistRanks } from '../rankingUtils';
import type { Card } from '@/types/card';

describe('rankingUtils', () => {
  describe('updateRanks', () => {
    it('should correctly update ranks when winner has higher initial rank', () => {
      const winner: Card = {
        _id: '1',
        title: 'Winner',
        description: 'Winner card',
        imageUrl: 'winner.jpg',
        rank: 1500
      };
      const loser: Card = {
        _id: '2',
        title: 'Loser',
        description: 'Loser card',
        imageUrl: 'loser.jpg',
        rank: 1400
      };

      const [updatedWinner, updatedLoser] = updateRanks(winner, loser);

      expect(updatedWinner.rank).toBe(1532); // 1500 + 32
      expect(updatedLoser.rank).toBe(1368);  // 1400 - 32
    });

    it('should correctly update ranks when winner has lower initial rank', () => {
      const winner: Card = {
        _id: '1',
        title: 'Winner',
        description: 'Winner card',
        imageUrl: 'winner.jpg',
        rank: 1300
      };
      const loser: Card = {
        _id: '2',
        title: 'Loser',
        description: 'Loser card',
        imageUrl: 'loser.jpg',
        rank: 1400
      };

      const [updatedWinner, updatedLoser] = updateRanks(winner, loser);

      expect(updatedWinner.rank).toBe(1332); // 1300 + 32
      expect(updatedLoser.rank).toBe(1368);  // 1400 - 32
    });

    it('should use default rank (1400) for cards without initial rank', () => {
      const winner: Card = {
        _id: '1',
        title: 'Winner',
        description: 'Winner card',
        imageUrl: 'winner.jpg'
      };
      const loser: Card = {
        _id: '2',
        title: 'Loser',
        description: 'Loser card',
        imageUrl: 'loser.jpg'
      };

      const [updatedWinner, updatedLoser] = updateRanks(winner, loser);

      expect(updatedWinner.rank).toBe(1432); // 1400 + 32
      expect(updatedLoser.rank).toBe(1368);  // 1400 - 32
    });
  });

  describe('persistRanks', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should make API calls to update ranks for all cards', async () => {
      const cards: Card[] = [
        {
          _id: '1',
          title: 'Card 1',
          description: 'First card',
          imageUrl: 'card1.jpg',
          rank: 1500
        },
        {
          _id: '2',
          title: 'Card 2',
          description: 'Second card',
          imageUrl: 'card2.jpg',
          rank: 1400
        }
      ];

      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      await persistRanks(cards);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/cards/updateRank',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: '1', rank: 1500 })
        })
      );
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/cards/updateRank',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: '2', rank: 1400 })
        })
      );
    });

    it('should throw error if API calls fail', async () => {
      const cards: Card[] = [
        {
          _id: '1',
          title: 'Card 1',
          description: 'First card',
          imageUrl: 'card1.jpg',
          rank: 1500
        }
      ];

      (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(persistRanks(cards)).rejects.toThrow('API Error');
    });
  });
});
