export interface ICard {
  uuid: string;
  slug: string;
  type: 'text';
  content: {
    text: string;
  };
  title?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
