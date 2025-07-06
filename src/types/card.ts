export interface Card {
  _id: string;
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  rank?: number;
  battlesWon?: number;
  battlesLost?: number;
  createdAt?: string;  // ISO 8601 UTC with ms
}
