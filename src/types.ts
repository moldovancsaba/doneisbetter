// Basic types for the application

// Card interface for database items
export interface Card {
  id: string;
  content: string;
  createdAt: Date;
}

// Card input for form submissions
export interface CardInput {
  content: string;
}
