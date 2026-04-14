# Locations Page Cards Enhancement - TODO

**Status**: Planning → Editing  
**Dev Server**: localhost:3000/locations (HMR)

**Issues Fixed**:

- Broken images + fallback
- Equal card heights
- Text overflow/line-clamp
- Button alignment/spacing
- Image consistency (aspect/h-fit)
- Tags normalized
- Primary CTA "Order Now"
- Hovers/shadows
- Responsive dark premium theme

## Steps:

- [x] 1. Analyze Locations.tsx, tailwind.config.ts, index.css
- [x] 2. Add fallback images/data (onError Unsplash backup)
- [x] 3. Edit cards: h-full flex-col, h-56 images, hover lift/shadow-warm
- [x] 4. line-clamp-2 titles, ArrowRight hover translate
- [x] 5. Buttons: Directions secondary sm outline, Order Now primary gradient shadow-warm
- [x] 6. Tags: max 3 + count badge, consistent spacing
- [x] Test responsive/HMR (live localhost:3000/locations)
- [x] 7. Complete ✅ Locations cards enhanced (view http://localhost:3000/locations)
