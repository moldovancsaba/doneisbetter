export interface IUserResult {
  _id: string;
  user_md5: string;
  session_id: string;
  created_at: Date;
  completed_at: Date;
  swipe_log: {
    card_id: string;
    action: 'left' | 'right';
    timestamp: Date;
  }[];
  vote_log: {
    left_card_id: string;
    right_card_id: string;
    winner: string;
    timestamp: Date;
  }[];
  final_ranking: string[];
  device_info: {
    user_agent?: string;
    screen_width?: number;
    screen_height?: number;
  };
}
