import dbConnect from '../../lib/dbConnect';
import Interaction from '../../models/Interaction';
import Card from '../../models/Card';

export default async function handler(req, res) {
  const requestTime = new Date().toISOString();
  console.log(`[${requestTime}] Interaction request received`, { method: req.method });
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log(`[${requestTime}] Invalid method: ${req.method}`);
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed",
      timestamp: requestTime 
    });
  }

  try {
    await dbConnect();
    console.log(`[${requestTime}] Database connected successfully`);
    
    const { sessionId, userId, cardId, type, action, againstCardId } = req.body;
    
    // Validate required fields
    if (!cardId) {
      console.log(`[${requestTime}] Missing cardId in request body`);
      return res.status(400).json({
        success: false,
        error: "Card ID is required",
        timestamp: requestTime
      });
    }
    
    if (!type || !['swipe', 'vote'].includes(type)) {
      console.log(`[${requestTime}] Invalid or missing interaction type: ${type}`);
      return res.status(400).json({
        success: false,
        error: "Valid interaction type (swipe or vote) is required",
        timestamp: requestTime
      });
    }
    
    if (!action) {
      console.log(`[${requestTime}] Missing action in request body`);
      return res.status(400).json({
        success: false,
        error: "Action is required",
        timestamp: requestTime
      });
    }
    
    // Validate action based on type
    if (type === 'swipe' && !['left', 'right'].includes(action)) {
      console.log(`[${requestTime}] Invalid swipe action: ${action}`);
      return res.status(400).json({
        success: false,
        error: "Swipe action must be either 'left' or 'right'",
        timestamp: requestTime
      });
    }
    
    if (type === 'vote' && !['win', 'lose'].includes(action)) {
      console.log(`[${requestTime}] Invalid vote action: ${action}`);
      return res.status(400).json({
        success: false,
        error: "Vote action must be either 'win' or 'lose'",
        timestamp: requestTime
      });
    }
    
    // Ensure we have either sessionId or userId
    if (!sessionId && !userId) {
      console.log(`[${requestTime}] Missing sessionId or userId`);
      return res.status(400).json({
        success: false,
        error: "Either sessionId or userId is required",
        timestamp: requestTime
      });
    }
    
    // Verify that the cardId is valid
    try {
      const card = await Card.findById(cardId);
      if (!card) {
        console.log(`[${requestTime}] Card not found with ID: ${cardId}`);
        return res.status(404).json({
          success: false,
          error: "Card not found",
          timestamp: requestTime
        });
      }
    } catch (cardError) {
      console.error(`[${requestTime}] Error verifying card:`, cardError);
      // Continue with the interaction even if there's an error with card validation
      // This is to handle edge cases where the card ID might be valid but there's a DB issue
    }
    
    // Verify that the againstCardId is valid (if provided for vote interactions)
    if (againstCardId && type === 'vote') {
      try {
        const againstCard = await Card.findById(againstCardId);
        if (!againstCard) {
          console.log(`[${requestTime}] Against card not found with ID: ${againstCardId}`);
          return res.status(404).json({
            success: false,
            error: "Against card not found",
            timestamp: requestTime
          });
        }
      } catch (cardError) {
        console.error(`[${requestTime}] Error verifying against card:`, cardError);
        // Continue with the interaction as above
      }
    }
    
    // Create the interaction record
    const interactionData = {
      ...(sessionId && { sessionId }),
      ...(userId && { userId }),
      cardId,
      type,
      action,
      ...(againstCardId && type === 'vote' && { againstCardId }),
      createdAt: requestTime
    };
    
    console.log(`[${requestTime}] Creating interaction:`, interactionData);
    
    // Add additional logging for right swipes (important for rankings)
    if (type === 'swipe' && action === 'right') {
      console.log(`[${requestTime}] Recording RIGHT swipe for card: ${cardId}`);
    }
    
    const interaction = new Interaction(interactionData);
    await interaction.save();
    
    console.log(`[${requestTime}] Interaction saved successfully with ID: ${interaction._id}`);
    
    return res.status(201).json({
      success: true,
      data: {
        _id: interaction._id,
        cardId: interaction.cardId,
        type: interaction.type,
        action: interaction.action,
        createdAt: interaction.createdAt
      },
      timestamp: requestTime
    });
    
  } catch (error) {
    console.error(`[${requestTime}] Error recording interaction:`, error);
    
    // Provide more detailed error messages for different types of errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: Object.values(error.errors).map(err => err.message),
        timestamp: requestTime
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: "Invalid ID format",
        details: error.message,
        timestamp: requestTime
      });
    }
    
    return res.status(500).json({
      success: false,
      error: "Failed to record interaction",
      message: error.message,
      timestamp: requestTime
    });
  }
}

