export interface ICard {
  _id: string;
  md5: string;
  slug: string;
  type: 'text' | 'media';
  content: string;
  created_at: Date;
  created_by: string;
}
