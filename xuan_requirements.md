# Birthday Surprise Website - Requirements Document

## Project Overview
An interactive, romantic birthday surprise website for a girlfriend featuring a scrapbook aesthetic theme with four main sections: landing page, photo flipbook, gift selector, and voucher generator.

## Design System

### Color Palette (Earthy Scrapbook Theme)
- **Terracotta**: `#c17767` - Primary accent, buttons, highlights
- **Sage Green**: `#8a9a7b` - Secondary accent, decorative elements
- **Mustard**: `#d4a574` - Tertiary accent, washi tape, borders
- **Warm Brown**: `#5d4037` - Text color
- **Kraft Background**: `#d9c5b2` - Main background
- **Light Kraft**: `#f5ebe0` - Card backgrounds
- **Cream**: `#e6ddd0` - Secondary backgrounds

### Typography
- **Primary Font**: Scrapbook inspired
- Used for all headings, body text, and interactive elements
- Weights: 400 (regular), 700 (bold)

### Visual Style
- **Scrapbook Aesthetic**: Torn paper edges, layered elements, handcrafted feel
- **No Solid Edges**: All cards and containers use `clipPath` polygons for irregular, organic edges
- **Decorative Elements**:
  - Washi tape strips with irregular edges
  - Paper clips (circular border elements)
  - Decorative stamps and stickers
  - Photo corners
  - Scattered background paper pieces
- **Shadows**: Drop shadows for depth (`drop-shadow(0 10px 30px rgba(93, 64, 55, 0.3))`)
- **Rotation**: Elements tilted at various angles (-15deg to 20deg) for natural feel
- **Texture**: Layered backgrounds with semi-transparent decorative elements

## Section 1: Landing Page

### Components
- `LandingPage.tsx`

### Features
- Personal love letter display
- Heart icon header
- Decorative paper pieces in corners
- Paper clip decorations at top
- Torn paper edge effect on main container
- Call-to-action button to proceed to photo flipbook

### Content Requirements
- Love letter text (customizable)
- Romantic messaging
- Clear navigation to next section

### Design Elements
- Background: Kraft paper (`#d9c5b2`)
- Container: Light kraft with torn edges
- Decorative scattered paper pieces with rotation
- Paper clips positioned at top
- Heart icon in terracotta color
- Button with irregular edge styling

## Section 2: Photo Flipbook

### Components
- `PhotoFlipbook.tsx`

### Features
- Display 30+ photos with captions
- Photo navigation (Previous/Next buttons)
- Progress tracking:
  - Current photo number display
  - Total viewed count
  - Progress bar visualization
- Photo viewing requirement: All photos must be viewed before unlocking gift selection
- Photo corners (decorative borders on images)
- Unlock notification when all photos viewed

### Functionality
- Track which photos have been viewed (using Set)
- Navigate between photos sequentially
- Disable navigation at boundaries (first/last photo)
- Calculate and display progress percentage
- Trigger unlock state when all photos viewed
- Call `onComplete` callback to navigate to gift selector

### Photo Data Structure
```typescript
{
  id: number,
  url: string,
  caption: string
}
```

### Design Elements
- Progress bar in separate container with torn edges
- Photo display in white frame with torn edges and corner decorations
- Washi tape decorations on photo container
- Navigation buttons with scrapbook styling
- Unlock card with decorative stamp
- Background texture elements

## Section 3: Gift Selector

### Components
- `GiftSelector.tsx`

### Features
- 5-stage gift selection process
- Progress indicator showing current stage
- Stage-by-stage gift selection with validation

### Gift Stages

#### Stage 1: Vinyl Player 
- **Gift**: Vinyl Player
- **Status**: Pre-selected (user cannot change)
- **Display**: Card with vinyl player emoji and description
- **Selection**: `vinylPlayer: "Vinyl Player"`

#### Stage 2: Record Choice
- **Options**: 3 different record albums
- **Display**: Grid of 3 cards with record emoji
- **Selection**: User must select one record
- **Validation**: Cannot proceed without selection

#### Stage 3: Perfume Choice
- **Options**: 3 perfume options
  - Must include "Regine de Fleur - Glassbloom"
  - 2 additional perfume options
- **Display**: Grid of 3 cards with flower emoji
- **Selection**: User must select one perfume
- **Validation**: Cannot proceed without selection

#### Stage 4: Pants Choice
- **Options**: 3 different pants styles
- **Display**: Grid of 3 cards with pants emoji
- **Selection**: User must select one option
- **Validation**: Cannot proceed without selection

#### Stage 5: Shopping Voucher & Personal Message
- **Gift**: $150 Shopping Voucher (pre-included)
- **Message Field**: Optional textarea for personal message
- **Display**: Card with gift emoji and message input
- **Validation**: Can proceed with or without message

### Selection Data Structure
```typescript
{
  vinylPlayer: string,
  record: string,
  perfume: string,
  pants: string,
  voucher: "$150 Shopping Voucher",
  personalMessage: string
}
```

### Progress Indicator
- 5 numbered stages
- Completed stages: Terracotta background with checkmark
- Current stage: Terracotta background with number
- Future stages: Light background with number
- Each stage labeled "Stage 1" through "Stage 5"

### Navigation
- "Next →" button for stages 1-4
- "Generate Voucher →" button for stage 5
- Button disabled until valid selection made
- Automatic stage progression on selection

### Design Elements
- Progress bar in container with torn edges
- Each gift card with unique torn edge pattern
- Decorative washi tape on selected items
- Background decorative paper pieces
- Selection badges with scrapbook styling
- Stage indicators with irregular shapes

## Section 4: Voucher Generator

### Components
- `VoucherGenerator.tsx`

### Features
- Display final voucher with all selected gifts
- Download voucher as image (PNG)
- Decorative scrapbook-style voucher design

### Voucher Content
- **Header**: Decorative corner icons (hearts, gifts, sparkles)
- **Title**: "Your Birthday Voucher is Ready! 🎉"
- **Gift List**: All 5 selected gifts with emojis:
  - 🎵 Vinyl Player
  - 💿 Selected Record
  - 🌸 Selected Perfume
  - 👖 Selected Pants
  - 🎁 $150 Shopping Voucher
- **Personal Message**: If provided, displayed in separate section
- **Footer**:
  - Valid date (current date)
  - "Made with love ❤️"
  - "Happy Birthday! 🎉"
- **Decorative Stamp**: Love stamp in corner

### Download Functionality
- Uses `html2canvas` library
- Captures voucher container as image
- Downloads as "birthday-voucher.png"
- Maintains all styling and decorative elements
- Uses hex color `#e6b980` instead of unsupported oklch colors

### Design Elements
- Washi tape decorations (top and bottom)
- Corner decorative icons
- Torn edge borders on content boxes
- Dashed borders for gift list and message sections
- Rotated decorative stamp
- Background texture elements
- Drop shadows for depth

## Technical Requirements

### Framework & Libraries
- **React**: Component-based architecture
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI Components**:
  - Button
  - Card
  - Progress
  - Label
  - Textarea
- **html2canvas**: Voucher image generation
- **Lucide React**: Icon library (Heart, Gift, Sparkles, Download, Check, ChevronLeft, ChevronRight)
- **Google Fonts**: Caveat font family

### State Management
- `useState` for local component state
- `useRef` for DOM element references (voucher download)
- Props-based communication between components

### Navigation Flow
1. Landing Page → Photo Flipbook (button click)
2. Photo Flipbook → Gift Selector (unlock after all photos viewed)
3. Gift Selector → Voucher Generator (complete stage 5)

### Data Flow
```typescript
App.tsx (main container)
├── currentSection: 'landing' | 'photos' | 'gifts' | 'voucher'
├── selections: GiftSelections
└── Child components receive:
    ├── onNavigate callbacks
    ├── onComplete callbacks
    └── selections data (for VoucherGenerator)
```

### Responsive Design
- Mobile-first approach
- Breakpoints: `md:` for tablet/desktop
- Grid layouts adjust: 1 column mobile, 3 columns desktop
- Padding adjustments: `p-4` mobile, `p-8 md:p-12` desktop
- Text size adjustments for readability

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS features: `clipPath`, `filter`, `drop-shadow`
- ES6+ JavaScript features

## Image Requirements

### Photo Flipbook
- 30+ photos required
- Each photo needs:
  - Unique URL
  - Caption text
  - Sequential ID
- Recommended aspect ratio: 4:3
- Use `ImageWithFallback` component for error handling

### Icons & Emojis
- Lucide React icons for UI elements
- Unicode emojis for gift representations:
  - 🎵 Music/Vinyl
  - 💿 Record
  - 🌸 Perfume
  - 👖 Pants
  - 🎁 Gift
  - ❤️ Heart
  - ✨ Sparkles
  - 🎉 Celebration

## Accessibility Requirements
- Semantic HTML elements
- Proper heading hierarchy
- Alt text for images (via ImageWithFallback)
- Keyboard navigation support
- Disabled state feedback on buttons
- Progress indicators with text labels
- High contrast text colors (warm brown on kraft backgrounds)

## Performance Considerations
- Lazy loading for images
- Efficient state updates
- Optimized re-renders
- Canvas rendering for voucher generation
- Minimal dependencies

## Future Enhancement Possibilities
- Animation transitions between sections
- Photo zoom/lightbox functionality
- Multiple voucher themes
- Email voucher capability
- Social sharing features
- Music playback for vinyl player preview
- Photo upload functionality
- Customizable color schemes
- Print-optimized voucher layout

```

## Content Guidelines
- Tone: Casual, personal, heartfelt
- Language: Casual, affectionate
- All text uses Caveat font for handwritten feel
- Emojis enhance emotional connection
- Personal touches throughout (love letter, message field)

## Quality Assurance Checklist
- [ ] All 30+ photos display correctly
- [ ] Photo progress tracking accurate
- [ ] Cannot skip to gifts without viewing all photos
- [ ] All 5 gift stages complete successfully
- [ ] Personal message optional but saves correctly
- [ ] Voucher displays all selections accurately
- [ ] Download generates proper PNG file
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] All decorative elements display correctly
- [ ] No console errors
- [ ] Scrapbook aesthetic consistent throughout
- [ ] Navigation flow works as expected
