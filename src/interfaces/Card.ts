export interface ICard {
  _id: string;
  md5: string;
  slug: string;
  type: 'image' | 'text';
  content: string;
  translations?: { language: string; content: string }[];
  parentId?: string;
  projectId?: string;
  metadata?: {
    aspectRatio?: number;
  };
}
