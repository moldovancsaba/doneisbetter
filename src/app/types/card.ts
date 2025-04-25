/**
 * Type definitions for card statuses and card data structures
 */

// Card status constants
export const CardStatusValues = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const;

// Card status type
export type CardStatus = keyof typeof CardStatusValues;

// NextAuth type extensions 
declare module "next-auth" {
  interface User {
    id: string;
    role?: 'user' | 'admin';
  }
  
  interface Session {
    user?: {
      id: string;
      name?: string;
      email?: string; 
      image?: string;
      role?: 'user' | 'admin';
    };
  }
}

// Card interface
export interface Card {
  id: string;
  content: string;
  status: CardStatus;
  order: number;
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  userName?: string;
  userImage?: string;
}

// Data transfer objects
export interface CreateCardDTO {
  content: string;
  status?: CardStatus;
  order?: number;
}

export interface UpdateCardDTO {
  content?: string;
  status?: CardStatus;
  order?: number; 
  isDeleted?: boolean;
}

/**
 * Card status constants and types
 */

// Runtime values for card statuses
export const CardStatusValues = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const;

// Type for card status values
export type CardStatus = keyof typeof CardStatusValues;

/**
 * Extend NextAuth types with our custom fields
 */
declare module "next-auth" {
  interface User {
    id: string;
    role?: 'user' | 'admin';
  }
  
  interface Session {
    user?: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      role?: 'user' | 'admin';
    };
  }
}

// Card interface
export interface Card {
  id: string;
  content: string;
  status: CardStatus;
  order: number;
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  userName?: string;
  userImage?: string;
}

// Data transfer objects
export interface CreateCardDTO {
  content: string;
  status?: CardStatus;
  order?: number;
}

export interface UpdateCardDTO {
  content?: string;
  status?: CardStatus;
  order?: number;
  isDeleted?: boolean;
}

/**
 * Supported card status values and type definitions
 */

/** 
 * Card status constant values - used for runtime validation
 */
export const CardStatusValues = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;

/**
 * Type representing possible card status values
 */
export type CardStatus = keyof typeof CardStatusValues;

/**
 * Extends NextAuth types with our custom fields
 */
declare module "next-auth" {
  interface User {
    role?: 'user' | 'admin';
    id: string;
  }
  
  interface Session {
    user?: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      role?: 'user' | 'admin';
    }
  }
}

/**
 * Complete card type with all fields
 */
export interface Card {
  id: string;
  content: string;
  status: CardStatus;
  order: number;
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  userName?: string;
  userImage?: string;
}

/**
 * Data structure for creating new cards
 */
export interface CreateCardDTO {
  content: string;
  status?: CardStatus;
  order?: number;
}

/**
 * Data structure for updating cards
 */
export interface UpdateCardDTO {
  content?: string;
  status?: CardStatus;
  order?: number;
  isDeleted?: boolean;
}

// Card Status Constants
export const CardStatusValues = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS', 
  DONE: 'DONE',
} as const;

// Card Status Type
export type CardStatus = keyof typeof CardStatusValues;

// NextAuth Type Augmentations
declare module "next-auth" {
  interface User {
    role?: 'user' | 'admin';
  }
  
  interface Session {
    user?: {
      id: string;
      name?: string;
      email?: string;
      image?: string; 
      role?: 'user' | 'admin';
    }
  }
}

// Card Data Structures
export interface Card {
  id: string;
  content: string;
  status: CardStatus;
  order: number;
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  userName?: string;
  userImage?: string;
}

export interface CreateCardDTO {
  content: string;
  status?: CardStatus;
  order?: number;
}

export interface UpdateCardDTO {
  content?: string;
  status?: CardStatus;
  order?: number;
  isDeleted?: boolean;
}

export const CardStatusValues = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;

export type CardStatus = keyof typeof CardStatusValues;

declare module "next-auth" {
  interface User {
    role?: 'user' | 'admin';
  }
  
  interface Session {
    user?: {
      id: string;
      name?: string;
      email?: string; 
      image?: string;
      role?: 'user' | 'admin';
    }
  }
}

export interface Card {
  id: string;
  content: string;
  status: CardStatus;
  order: number;
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  userName?: string;
  userImage?: string;
}

export interface CreateCardDTO {
  content: string;
  status?: CardStatus;
  order?: number;
}

export interface UpdateCardDTO {
  content?: string;
  status?: CardStatus;
  order?: number;
  isDeleted?: boolean;
}
  interface User {
    role?: 'user' | 'admin';
  }
  
  interface Session {
    user?: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      role?: 'user' | 'admin';
    }
  }
}

export interface Card {
  id: string;
  content: string;
  status: CardStatus;
  order: number;
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  userName?: string;
  userImage?: string;
}

export interface CreateCardDTO {
  content: string;
  status?: CardStatus;
  order?: number;
}

export interface UpdateCardDTO {
  content?: string;
  status?: CardStatus;
  order?: number;
  isDeleted?: boolean;
}

export { CardStatusValues };

