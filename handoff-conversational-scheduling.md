# Handoff: Google Calendar Appointment Schedule + Conversational Booking

**Date:** 2026-02-13
**Session ID:** ses_3a9efffa8ffehcfgS8ipw4Q9CS

---

## Project Overview

Implementing a **conversational scheduling system** for the portfolio website that uses Google Calendar Appointment Schedule with context-aware, chat-based booking flow. Primary use case: booking headshot photography sessions.

---

## Decision Summary

### Chosen Approach: Option 4 + Option 1 Hybrid

- **Google Calendar Appointment Schedule** for actual booking (external link)
- **Conversational context gathering** before showing scheduling card
- Smart routing to different appointment types based on user needs

### Why This Approach

- No complex API integration needed
- Google handles availability, timezone conversion, notifications
- Website provides personalized, conversational experience
- Multiple appointment types for different shoot styles
- Professional appearance with minimal maintenance

---

## Architecture

### Conversation Flow

```
User Query → Intent Detection → Context Questions → Smart Card → Google Booking
```

### States

1. **DETECTED** - Scheduling intent identified
2. **ASKING_TYPE** - What type of headshots? (professional/creative/casual/portfolio)
3. **ASKING_STYLE** - Location preference? (studio/outdoor/lifestyle)
4. **ASKING_TIMING** - When needed? (asap/this_week/flexible)
5. **READY_TO_SCHEDULE** - Show smart card
6. **SCHEDULING_SHOWN** - User has booking link

### Context Structure

```typescript
interface ShootContext {
  type: "professional" | "creative" | "casual" | "portfolio";
  style: "studio" | "outdoor" | "lifestyle";
  timing: "asap" | "this_week" | "this_month" | "flexible";
  duration: "mini" | "standard" | "extended";
  notes?: string;
}
```

---

## Google Appointment Schedules to Create

### 1. Professional Studio Headshot

- Duration: 60 minutes
- Buffer: 15 min before/after
- Limit: 2 per day
- Location: Studio address
- Best for: LinkedIn, business profiles

### 2. Professional Outdoor Headshot

- Duration: 45 minutes
- Buffer: 30 min before/after
- Limit: 3 per day
- Location: Outdoor spots
- Best for: Warm, approachable business photos

### 3. Creative/Portfolio Shoot

- Duration: 90 minutes
- Buffer: 30 min before/after
- Limit: 2 per day
- Best for: Models, artists, variety of shots

### 4. Mini Session

- Duration: 30 minutes
- Buffer: 15 min before/after
- Limit: 4 per day
- Best for: Quick updates, busy schedules

### 5. Coffee Chat (General Meetings)

- Duration: 30-45 minutes
- For: Networking, casual discussions

---

## Question Flow

### Question 1: Type

"what type of headshots do you need?"

- 💼 Professional/Business
- 🎨 Creative/Artistic
- 📸 Portfolio/Model
- 😊 Casual/Social

### Question 2: Style

"do you have a location preference?"

- 🏠 Studio (Indoor, controlled lighting)
- 🌅 Outdoor (Natural light, golden hour)
- 🏢 Lifestyle (At your office/workspace)

### Question 3: Timing (Optional)

"any timing constraints?"

- ⚡ ASAP
- 📅 This week
- 📆 This month
- ✌️ Flexible

---

## Smart Card Design

### Card Content

```
┌─────────────────────────────────────────────┐
│  📸                                         │
│  [Style] [Type] Headshot                    │
│  [Duration] • [Key Feature]                 │
│                                             │
│  [Personalized description]                 │
│                                             │
│  Suggested times:                           │
│  [Tue 4:30pm] [Wed 5:00pm]                 │
│                                             │
│  [View Full Calendar →]                     │
│                                             │
│  💡 Includes: [package details]             │
└─────────────────────────────────────────────┘
```

### Personalization Examples

- Professional + Studio: "Perfect for LinkedIn and company websites"
- Professional + Outdoor: "Warm, approachable look for business profiles"
- Creative + Any: "Let's create something unique together!"
- Casual: "Relaxed, natural photos for social media"

---

## Response Examples

### Full Conversation Flow

```
User: I'm interested in the headshot offer you posted!

AI: awesome! i'd love to work with you 📸

to make sure i bring the right gear and plan the perfect session,
i have a couple quick questions:

what type of headshots do you need?
[💼 Professional/Business] [🎨 Creative/Artistic]
[📸 Portfolio/Model]      [😊 Casual/Social]

User: [Clicks: Professional/Business]

AI: perfect for business use! professional shots really make a
difference on linkedin and company websites.

next question: do you have a location preference?
[🏠 Studio (Indoor, controlled lighting)]
[🌅 Outdoor (Natural light, golden hour)]
[🏢 Lifestyle (At your office/workspace)]

User: [Clicks: Outdoor]

AI: excellent choice! outdoor shots during golden hour have such
a warm, approachable feel. plus we'll get some variety with natural
backgrounds.

one more thing: any timing constraints i should know about?
[⚡ ASAP] [📅 This week] [📆 This month] [✌️ Flexible]

User: [Clicks: This week]

AI: perfect! i have openings this week. let me show you what's
available:

[SMART CARD APPEARS]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 Outdoor Professional Headshot
45 minutes • Golden hour preferred

Ideal for: LinkedIn, company websites, professional profiles

Suggested times this week:
[Tue 4:30pm] [Wed 5:00pm]
[Thu 6:00pm]

[See full calendar →]

💡 Includes: 5 edited digital photos, online gallery,
   commercial usage rights
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

click a time above to book, or let me know if you need different
options!
```

---

## Implementation Steps

### Phase 1: Setup (Week 1)

1. Create 4-5 Google Appointment Schedules in Google Calendar
2. Configure availability, buffers, location for each
3. Add custom questions in Google Calendar:
   - "What will these headshots be used for?"
   - "Any specific looks/styles in mind?"
4. Save all schedule URLs

### Phase 2: Backend (Week 1-2)

1. Extend intent.ts to detect "scheduling" sub-intents
2. Create conversation state machine
3. Build question flow logic
4. Create smart card generation logic
5. Store scheduling context in chat session

### Phase 3: Frontend (Week 2)

1. Build question UI components (buttons/options)
2. Create SmartSchedulingCard component
3. Handle state transitions
4. Style cards to match portfolio design
5. Test full conversation flows

### Phase 4: Polish (Week 2-3)

1. Add personality to responses (match existing chat tone)
2. Create follow-up email templates
3. Set up webhook for booking notifications (optional)
4. Test with real bookings
5. Send invites!

---

## Key Files to Modify

### Existing Files

- `src/server/agents/intent.ts` - Extend for scheduling intent + sub-intents
- `src/app/api/chat/route.ts` - Add scheduling flow handling
- `src/app/_components/ChatInterface.tsx` - Add UI for questions and cards

### New Files to Create

- `src/server/agents/scheduling/` - Scheduling logic directory
- `src/server/agents/scheduling/conversation-flow.ts` - Question definitions
- `src/server/agents/scheduling/context-gathering.ts` - State management
- `src/server/agents/scheduling/card-generator.ts` - Smart card creation
- `src/components/scheduling/SmartSchedulingCard.tsx` - Card UI component
- `src/components/scheduling/QuestionOptions.tsx` - Question button UI

---

## Technical Details

### State Management in Chat

Store scheduling context in chat session state:

```typescript
interface ChatSession {
  messages: Message[];
  schedulingContext?: {
    state: SchedulingState;
    context: Partial<ShootContext>;
    questionsAsked: string[];
    isComplete: boolean;
  };
}
```

### Schedule URL Mapping

```typescript
const scheduleLinks = {
  headshots: {
    professional_studio: "https://calendar.google.com/appointments/...",
    professional_outdoor: "https://calendar.google.com/appointments/...",
    creative_studio: "https://calendar.google.com/appointments/...",
    creative_outdoor: "https://calendar.google.com/appointments/...",
    mini_session: "https://calendar.google.com/appointments/...",
  },
  coffee_chat: "https://calendar.google.com/appointments/...",
  technical_call: "https://calendar.google.com/appointments/...",
};
```

### Response Type

```typescript
interface SchedulingResponse {
  type: "question" | "scheduling_card";
  message: string;
  options?: Array<{ value: string; label: string; emoji?: string }>;
  scheduleUrl?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardDescription?: string;
  quickActions?: Array<{ label: string; url: string }>;
}
```

---

## Advanced Features (Post-MVP)

### Webhook Follow-up

When someone books via Google Calendar:

1. Receive webhook notification
2. Send personalized confirmation email with tips
3. Add to personal CRM/dashboard
4. Prepare shoot context (research client if possible)

### Package Options in Card

Show pricing/packages:

```
[Mini - $150] 30min, 3 photos
[Standard - $250] 45min, 5 photos
[Premium - $400] 90min, 10+ photos
```

### Returning Client Fast-Track

Recognize returning clients:

```
"so glad you loved the last shoot! 🎉
for returning clients, i can fast-track this:
[Book same type as last time: Professional Studio]
[Something different this time?]"
```

---

## Design Notes

### Tone and Voice

- Keep lowercase style consistent with existing chat
- Enthusiastic, casual but professional
- Photography-specific excitement ("📸", "golden hour", "perfect lighting")
- Emoji use to match portfolio personality

### Visual Design

- Cards should match existing portfolio aesthetic
- Use existing color scheme
- Clear CTAs
- Mobile-friendly (many will book on mobile)

---

## Open Questions

1. Should we show available times dynamically or just link to Google Calendar?
   - Decision: Just link - Google handles availability better
   - Could add "Suggested times" text based on typical availability

2. How to handle multiple calendar support (if needed later)?
   - Start with Google Calendar only
   - Architecture allows adding Calendly later

3. Should we collect email before showing calendar?
   - No - let Google Calendar collect it
   - Less friction = more bookings

4. Pricing display in card?
   - Decision: Include package info in card footer
   - Full pricing details on Google Calendar page

---

## Success Metrics

- [ ] Conversation completes without errors
- [ ] Cards display correct context
- [ ] Links route to correct appointment type
- [ ] Bookings appear on calendar
- [ ] Users receive confirmation emails
- [ ] Conversion rate (chats → bookings)

---

## Resources

### Google Calendar Appointment Schedule

- Create: Google Calendar → Create → Appointment schedule
- Share: Get link after creating
- Customize: Add questions, set availability, buffers

### Current Codebase Context

- Next.js 15 + React 19 + TypeScript 5.8
- LangChain.js with OpenAI
- Existing intent.ts for intent detection
- Streaming chat in route.ts
- Uses lowercase, enthusiastic tone

### Related Files (from this session)

- `src/server/agents/intent.ts` - Existing intent detection
- `src/server/agents/test-intent.ts` - Intent test file
- `src/app/api/chat/route.ts` - Chat streaming endpoint
- `src/server/db.ts` - Database connection
- `src/server/pg.ts` - Postgres pool

---

## Next Actions

1. **Immediate:** Create Google Appointment Schedules (all 4-5 types)
2. **Week 1:** Extend intent.ts with scheduling detection
3. **Week 1:** Build conversation state machine
4. **Week 1-2:** Create question flow and UI components
5. **Week 2:** Build SmartSchedulingCard component
6. **Week 2:** Integrate into chat flow
7. **Week 3:** Test, polish, send invites

---

## Notes

- This approach prioritizes user experience over technical complexity
- Google Calendar handles the hard parts (availability, conflicts, notifications)
- Website provides personalization and context gathering
- Perfect for headshot booking use case
- Can extend to other meeting types later (coffee, technical calls, etc.)
- Keep it simple for MVP - add webhooks and advanced features later

---

_Document created for continuing work on conversational scheduling feature_
