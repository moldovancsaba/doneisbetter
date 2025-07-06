import { POST } from '../route';
import { getCardModel } from '@/models/Card';
import connect from '@/lib/mongodb';

interface MockNextRequest {
  body: string;
  json(): Promise<any>;
}

// Mock dependencies
jest.mock('next/server', () => ({
  NextRequest: class {
    body: string;
    constructor(_url: string, init?: { body?: string }) {
      this.body = init?.body || '{}';
    }
    async json() {
      return JSON.parse(this.body);
    }
  },
  NextResponse: {
    json: (data: any, init?: { status?: number }) => ({
      status: init?.status || 200,
      json: async () => data
    })
  }
}));

jest.mock('@/lib/mongodb', () => jest.fn());

jest.mock('@/models/Card', () => ({
  getCardModel: jest.fn()
}));

describe('POST /api/cards/updateRank', () => {
  const mockCardModel = {
    findByIdAndUpdate: jest.fn()
  };

  beforeEach(() => {
    (getCardModel as jest.Mock).mockResolvedValue(mockCardModel);
    (connect as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update card rank successfully', async () => {
    const mockCard = {
      _id: '123',
      title: 'Test Card',
      rank: 1500
    };
    mockCardModel.findByIdAndUpdate.mockResolvedValue(mockCard);

const request = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000/api/cards/updateRank', {
      method: 'POST',
      body: JSON.stringify({ id: '123', rank: 1500 })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      status: 'success',
      card: mockCard
    });
    expect(mockCardModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      { $set: { rank: 1500 } },
      { new: true }
    );
  });

  it('should return 400 if id or rank is missing', async () => {
const request = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000/api/cards/updateRank', {
      method: 'POST',
      body: JSON.stringify({ id: '123' }) // Missing rank
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Both id and rank are required and rank must be a number'
    });
  });

  it('should return 404 if card is not found', async () => {
    mockCardModel.findByIdAndUpdate.mockResolvedValue(null);

const request = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000/api/cards/updateRank', {
      method: 'POST',
      body: JSON.stringify({ id: 'nonexistent', rank: 1500 })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      error: 'Card not found'
    });
  });

  it('should return 500 if database operation fails', async () => {
    mockCardModel.findByIdAndUpdate.mockRejectedValue(new Error('DB Error'));

const request = new (jest.requireMock('next/server').NextRequest)('http://localhost:3000/api/cards/updateRank', {
      method: 'POST',
      body: JSON.stringify({ id: '123', rank: 1500 })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'Failed to update card rank'
    });
  });
});
