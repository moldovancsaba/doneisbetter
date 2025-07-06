export interface Card {
  id: string;
  title?: string;
  imageUrl?: string;
  rating?: number;
  createdAt?: string;  // ISO 8601 UTC with ms
}
