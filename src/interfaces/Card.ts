export interface ICard {
  uuid: string;
  type: 'text' | 'media';
  content: {
    text?: string;
    mediaUrl?: string;
  };
  title?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
