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
}
