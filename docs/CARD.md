# Card Component Image Fitting Specification

## 🔒 Critical Restriction
The Card component's image fitting behavior is strictly protected and MUST NOT be modified unless explicitly requested. This behavior is fundamental to the application's design and user experience.

## 📐 Current Implementation
The Card component (`src/components/common/Card.tsx`) maintains perfect image fitting through:

1. **Automatic Aspect Ratio Calculation**
```typescript
const [aspectRatio, setAspectRatio] = useState(1);

// Calculates exact aspect ratio from the loaded image
setAspectRatio(img.width / img.height || 1);
```

2. **Precise Sizing Control**
```typescript
style={{
  aspectRatio,
  width: '100%',
  height: 'auto',
}}
```

3. **Image Rendering**
```typescript
className={`w-full h-full object-contain select-none pointer-events-none`}
```

## 🚫 Prohibited Modifications
Unless explicitly requested, the following modifications are strictly forbidden:
- Changing the aspect ratio calculation logic
- Modifying the style properties controlling image fitting
- Altering the image's object-fit behavior
- Adding wrappers that override the natural image dimensions

## ✅ Proper Usage
When using the Card component:
1. Let it control its own dimensions
2. Use container-level constraints for sizing
3. Avoid forcing specific dimensions that could break the aspect ratio

### Example:
```tsx
// CORRECT: Let Card handle the fitting
<div className="w-[min(45vw,500px)]">
  <Card card={cardData} />
</div>

// INCORRECT: Don't force dimensions
<Card card={cardData} style={{ width: '300px', height: '400px' }} />
```

## 📋 Quality Assurance
Before any deployment:
1. Verify images display without distortion
2. Confirm aspect ratio is preserved across all view modes
3. Test responsive behavior maintains proper fitting
4. Ensure no CSS overrides affect the image fitting

## 🔄 Modification Protocol
If changes to the image fitting behavior are required:
1. Must have explicit approval
2. Require comprehensive testing across all view modes
3. Need documentation update reflecting the changes
4. Must maintain backwards compatibility where possible

Remember: The current implementation is considered stable and critical to the application's functionality. Any modifications risk introducing visual inconsistencies and should be treated with extreme caution.
