# Card Component Rules

## 📏 Aspect Ratio Rule

**CRITICAL: Card aspect ratio must never be modified!**

The Card component's aspect ratio is determined by the natural dimensions of the image it contains. This is a fundamental design principle that must be maintained across all views and interactions.

### ✅ Required Behavior
- Always preserve the natural aspect ratio of card images
- Let the Card component handle all aspect ratio calculations
- Use container-level sizing constraints instead of forcing card dimensions

### ❌ Prohibited Actions
- Never force a specific aspect ratio on cards
- Do not override the Card component's natural sizing
- Avoid direct manipulation of card dimensions that could distort the image

### 🎯 Implementation Guidelines
1. Container Sizing
   ```jsx
   // CORRECT: Let container handle size constraints
   <div className="w-full h-[40vh]">
     <Card card={cardData} className="w-full h-full" />
   </div>

   // INCORRECT: Forcing aspect ratio
   <Card card={cardData} className="aspect-square" />
   ```

2. Responsive Layouts
   ```jsx
   // CORRECT: Use flexible containers
   <div className="flex justify-center items-center">
     <div className="w-[min(90vw,500px)]">
       <Card card={cardData} />
     </div>
   </div>
   ```

### 📱 View-Specific Guidelines

1. Swipe Phase
   - Use container constraints for overall size
   - Allow card to maintain natural proportions

2. Vote Phase
   - Scale container height to ensure both cards fit
   - Maintain width constraints while preserving aspect ratio

3. Ranking View
   - Use grid or flex layouts with consistent container sizes
   - Let cards determine their own dimensions within containers

### 🔍 Quality Checks
- Verify images display without distortion
- Ensure consistent appearance across all views
- Check that cards scale proportionally on resize
- Confirm that container constraints don't force aspect ratio changes
