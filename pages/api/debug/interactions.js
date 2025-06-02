import dbConnect from '../../../lib/dbConnect';
import Interaction from '../../../models/Interaction';

export default async function handler(req, res) {
  const requestTime = new Date().toISOString();
  console.log(`[${requestTime}] Debug interactions request received`);
  
  if (req.method !== "GET") {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed",
      timestamp: requestTime 
    });
  }

  const { sessionId } = req.query;
  
  if (!sessionId) {
    return res.status(400).json({
      success: false,
      error: "sessionId query parameter is required",
      timestamp: requestTime
    });
  }
  
  try {
    await dbConnect();
    console.log(`[${requestTime}] Database connected successfully`);
    
    // Get all interactions for this session
    const interactions = await Interaction.find({ sessionId })
      .sort({ createdAt: -1 });
    
    console.log(`[${requestTime}] Found ${interactions.length} interactions for session ${sessionId}`);
    
    // Get right swipes specifically
    const rightSwipes = interactions.filter(i => i.type === 'swipe' && i.action === 'right');
    console.log(`[${requestTime}] Found ${rightSwipes.length} right swipes`);
    
    return res.status(200).json({
      success: true,
      timestamp: requestTime,
      sessionId,
      stats: {
        totalInteractions: interactions.length,
        rightSwipes: rightSwipes.length
      },
      interactions: interactions.map(i => ({
        type: i.type,
        action: i.action,
        cardId: i.cardId.toString(),
        createdAt: i.createdAt.toISOString()
      }))
    });
    
  } catch (error) {
    console.error(`[${requestTime}] Error in debug endpoint:`, error);
    return res.status(500).json({ 
      success: false, 
      error: "Failed to retrieve debug data",
      message: error.message,
      timestamp: requestTime
    });
  }
}

