/**
 * Represents a card item in the application
 */
export interface Card {
  /**
   * Unique identifier for the card
   */
  id: string;
  
  /**
   * Text content of the card
   */
  content: string;

  /**
   * Detailed description of the card
   */
  description?: string;

  /**
   * Current status of the card in the workflow
   * @default "TODO"
   */
  status?: CardStatus;
  
  /**
   * Order position of the card within its column
   * Lower values appear at the top of the column
   * @default 0
   */
  order?: number;
  
  /**
   * Whether the task is important
   * Used for Eisenhower Matrix positioning
   * @default false
   */
  importance?: boolean;
  
  /**
   * Whether the task is urgent
   * Used for Eisenhower Matrix positioning
   * @default false
   */
  urgency?: boolean;

  /**
   * Priority level of the card
   */
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';

  /**
   * Timestamp when the card was created
   * Stored as ISO 8601 string for serialization
   */
  createdAt?: string; 

  /**
   * Due date for the card
   * Stored as ISO 8601 string for serialization
   */
  dueDate?: string;

  /**
   * Timestamp when the card was deleted
   * Stored as ISO 8601 string for serialization
   */
  deletedAt?: string;

  /**
   * Whether the card has been deleted (soft-delete)
   */
  isDeleted?: boolean;

  /** Optional name of the user who created the card (populated in 'All Cards' view) */
  userName?: string;

  /** Optional image URL of the user who created the card (populated in 'All Cards' view) */
  userImage?: string;
}
/**
 * Available card statuses for workflow
 * 
 * Traditional Kanban statuses:
 * - TODO: Tasks that need to be done
 * - IN_PROGRESS: Tasks currently being worked on
 * - DONE: Completed tasks
 * 
 * Eisenhower Matrix quadrants:
 * - Q1: Urgent & Important tasks
 * - Q2: Important but Not Urgent tasks
 * - Q3: Urgent but Not Important tasks
 * - Q4: Neither Urgent nor Important tasks
 */
export type CardStatus = "TODO" | "IN_PROGRESS" | "DONE" | "Q1" | "Q2" | "Q3" | "Q4";

/**
 * Column properties for the Kanban board
 */
export interface ColumnData {
  /**
   * Status represented by this column
   */
  status: CardStatus;
  
  /**
   * Display title for the column
   */
  title: string;
  
  /**
   * Color scheme for the column (used for borders, headers)
   */
  color: "blue" | "amber" | "green" | "red" | "purple" | "orange" | "gray";
  
  /**
   * Unique ID used as droppableId for the column
   */
  id: string;
}

/**
 * Drag source information
 */
export interface DragSource {
  /**
   * ID of the droppable area where the drag started
   */
  droppableId: string;
  
  /**
   * Index of the item in the source list
   */
  index: number;
}

/**
 * Drag destination information
 */
export interface DragDestination {
  /**
   * ID of the droppable area where the drag ended
   */
  droppableId: string;
  
  /**
   * Index where the dragged item was placed
   */
  index: number;
}

/**
 * Result of a drag operation
 */
export interface DragEndResult {
  /**
   * The draggable item that was moved
   */
  draggableId: string;
  
  /**
   * The source location
   */
  source: DragSource;
  
  /**
   * The destination location (null if dropped outside a droppable)
   */
  destination: DragDestination | null;
  
  /**
   * The type of the droppable
   */
  type: string;
}

/**
 * Structure for organizing cards by column
 */
export interface ColumnCards {
  [columnId: string]: Card[];
}
