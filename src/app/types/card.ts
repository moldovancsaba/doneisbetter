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
}

/**
 * Available card statuses for Kanban workflow
 */
export type CardStatus = "TODO" | "IN_PROGRESS" | "DONE";

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
  color: "blue" | "amber" | "green";
  
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
