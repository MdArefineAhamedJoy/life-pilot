# Life Pilot - Project Overview

## Vision

Life Pilot is a personal life-management app for daily use. The goal is to keep expense tracking, routine planning, work-life balance, reminders, personal notes, and AI-assisted text extraction in one simple place.

This project is for personal use first. It should stay free, privacy-friendly, and easy to run without paid services. The first version should work locally in the browser, then later support optional free AI or OCR APIs if needed.

## Main Goals

- Track daily bajar and personal expenses.
- Plan spending based on a monthly or daily budget.
- Split budget into separate categories like kacha bajar, modi bajar, personal cost, baby cost, travel, bills, medical, and emergency.
- Convert bajar slip, receipt image, or pasted text into structured expense rows.
- Track daily routine, work blocks, personal work, habits, and missed tasks.
- Use timer, stopwatch, reminders, and auto status updates.
- Build one personal dashboard for daily life decisions.
- Keep data exportable and under user control.

## Core Principles

- Free first: no paid API dependency for the MVP.
- Local first: personal data should stay in browser/local storage at the beginning.
- Simple input: adding data must be fast from mobile or desktop.
- Automation later: start with manual tracking, then add OCR and AI assistance.
- Clear calculations: every total, remaining amount, and status should be visible.
- Personal language support: Bangla/English mixed labels and inputs should be supported.

## Key Modules

### 1. Budget And Daily Cost Tracker

Purpose: Track where money is going every day and compare it with planned budget.

Main features:

- Add expense manually by amount, item, category, date, and note.
- Create budget buckets such as kacha bajar, modi bajar, personal cost, baby cost, family cost, transport, medicine, bills, savings, and others.
- Set daily, weekly, and monthly budget limits.
- Show category-wise spent, remaining, and over-budget amount.
- Auto-calculate total cost when an entry is added, edited, or deleted.
- Filter by day, week, month, category, and payment method.
- Add recurring costs like rent, internet, subscriptions, loan, or school fee.
- Show daily summary: total spent today, remaining budget, biggest category, and warning if overspending.

Useful views:

- Daily cost table
- Category budget table
- Monthly summary
- Spending trend
- Over-budget alerts

### 2. Receipt, Slip, Image, And Text To Table

Purpose: Convert bajar slip, receipt photo, or copied text into structured expense data.

Main features:

- Upload or capture an image of a bajar slip.
- Extract text from image using free OCR where possible.
- Paste messy text and convert it into rows.
- Detect item name, quantity, price, total, and category.
- Let the user review and fix extracted rows before saving.
- Save confirmed rows into the budget tracker.
- Keep original image or extracted text attached to the expense record if needed.

Free-first implementation ideas:

- Browser-based OCR with Tesseract.js for local processing.
- Manual text parser for common bajar-slip formats.
- Optional provider-based AI parser later, only when a free API key is configured.

### 3. Daily Routine And Work-Life Balance

Purpose: Help plan and track a balanced daily life.

Main features:

- Create daily routines like work, exercise, prayer, learning, family time, market, sleep, and personal tasks.
- Add task start time, end time, priority, category, and reminder time.
- Mark task status as pending, active, completed, skipped, delayed, or missed.
- Auto-change task status when deadline is crossed.
- Show what should be done now, next, and later.
- Track personal work and professional work separately.
- Show daily completion percentage.
- Generate a daily routine plan based on available time and priority.
- Support repeating routines: daily, weekly, custom days, or one-time.

### 4. Timer, Stopwatch, And Focus Tracking

Purpose: Track actual time spent on work and life activities.

Main features:

- Start, pause, resume, and stop timer for any task.
- Stopwatch mode for unplanned work.
- Focus session mode for deep work.
- Save actual time spent against each task.
- Compare planned time vs actual time.
- Auto-log unfinished timers if the user forgets.
- Show daily time distribution by category.

### 5. Alerts And Notifications

Purpose: Remind the user before important tasks are missed.

Main features:

- Browser notification for task start time, deadline, and overdue status.
- Alert when spending crosses category budget.
- Alert for unpaid bills or recurring costs.
- Morning routine reminder and night summary reminder.
- Missed task list with reschedule option.
- Quiet hours so notifications do not disturb sleep.

### 6. Personal Life Database

Purpose: Store useful personal life information in organized sections.

Possible sections:

- Notes and ideas
- Goals and yearly plans
- Health records and medicine reminders
- Bills and subscriptions
- Important documents checklist
- Shopping list
- Home inventory
- Family and baby-related costs
- Contacts or emergency info
- Learning tracker
- Habit tracker
- Journal or daily reflection

### 7. Dashboard

Purpose: Give one clear view of the current day.

Dashboard should show:

- Today's budget summary
- Today's expense total
- Remaining budget
- Active routine task
- Upcoming tasks
- Delayed or missed tasks
- Timer/focus status
- Quick add buttons for expense, task, note, and timer
- Daily life score or simple progress indicator

## Suggested App Navigation

- Dashboard
- Budget
- Expenses
- Add Expense
- Receipt Scanner
- Categories
- Routine
- Tasks
- Timer
- Notes
- Goals
- Shopping
- Meal Planner
- Health
- Family
- Reminder
- Reports
- AI Assistant
- Backup
- Calendar
- Profile
- Settings

## UI Design System

The product should feel like a calm Daily Money Management + Daily Routine dashboard. The UI must be comfortable for long daily use, avoid overly bright surfaces, and keep money, tasks, and alerts easy to scan.

### Color Palette

| Element | Color | Hex |
| --- | --- | --- |
| Primary | Emerald | `#10B981` |
| Primary hover | Dark Emerald | `#059669` |
| Secondary | Blue | `#3B82F6` |
| Background | Light Gray | `#F8FAFC` |
| Card | White | `#FFFFFF` |
| Text | Dark Slate | `#1E293B` |
| Border | Gray | `#E2E8F0` |
| Success | Green | `#22C55E` |
| Warning | Orange | `#F59E0B` |
| Danger | Red | `#EF4444` |

Feature color rules:

- Income and saved states use success green.
- Expenses and missed/over-budget states use danger red.
- Savings goals and secondary actions use blue.
- Routine/task progress can use blue, with warning orange for delayed states.
- Cards stay white on the light gray background.
- Borders use soft gray; heavy black UI should be avoided.

### Typography And Shape

- Heading font: Poppins.
- Body font: Inter.
- Number and money font: JetBrains Mono.
- Card border radius: `16px`.
- Button border radius: `12px`.
- Button height: `44px`.
- Card padding: `20px`.
- Card shadow: soft dashboard shadow, around `0 8px 30px rgba(0,0,0,0.08)`.
- Layout style: minimal dashboard with light glassmorphism only where it improves depth.

## Page UI Map

### Dashboard

- Top header with greeting, date, search, and profile area.
- Quick actions: Add Expense, Add Task, Scan Receipt, Start Timer.
- Summary cards: Today's Budget, Today's Expense, Remaining Budget, Savings, Today's Score.
- Analytics cards: Expense Overview, Weekly Spending, Budget Progress.
- Today's Routine list.
- Recent Expenses list.
- Upcoming Reminder list.

### Budget

- Top summary: Monthly Budget, Spent, Remaining, Savings.
- Category cards for Food, Transport, Medical, Shopping, Emergency, Baby, Bills, Savings.
- Category-wise spending chart.
- Category budget table.
- Progress bars: green for healthy, red for over budget.

### Expenses

- Search input.
- Date picker.
- Category filter.
- Payment filter.
- Expense table with item, category, amount, payment, date, edit, delete, and view actions.

### Add Expense

- Item name.
- Category.
- Amount.
- Quantity.
- Payment method.
- Date.
- Note.
- Attachment upload.
- Emerald Save Expense button.

### Receipt Scanner

- Upload image.
- Camera capture placeholder.
- Paste text.
- Preview panel.
- Extracted table.
- Save extracted rows.

### Categories

- Category cards: Food, Baby, Medicine, Transport, Bills, Savings, Emergency.
- Create Category action.
- Edit and delete actions.
- Each card should use a small accent color, not a full-color card.

### Routine

- Today segmented sections: Morning, Afternoon, Evening, Night.
- Task card fields: title, priority, status, time.
- Start Timer and Complete actions.
- Priority indicators: high red, medium orange, low blue.

### Tasks

- Kanban columns: Pending, In Progress, Completed, Missed, Skipped, Delayed.
- Compact task cards with title, time, priority, and status.

### Focus Timer

- Pomodoro.
- Stopwatch.
- Countdown.
- Large timer display.
- Start, Pause, Reset controls.
- Today's Focus and Weekly Focus statistics.

### Reports

- Expense Report.
- Routine Report.
- Time Report.
- Savings Report.
- Monthly Report.
- Charts: line, pie, and bar.

### Notes

- Create Note.
- Search.
- Pinned notes.
- Tags.
- Archive.

### Goals

- Emergency Fund, Buy Laptop, Vacation, Bike, House.
- Progress bars with target and saved amount.

### Shopping

- Shopping list with completed and pending states.
- Add item action.
- Convert purchased items into expenses later.

### Meal Planner

- Breakfast, lunch, dinner, snacks.
- Weekly or monthly meal plan.
- Optional link to shopping list.

### Health

- Medicine.
- Weight.
- Water intake.
- Exercise.
- Sleep.

### Family

- Baby costs.
- Parents costs.
- Family monthly cost.
- Recurring family needs.

### Reminder

- Bills.
- Meeting.
- Medicine.
- Routine.
- Birthday.
- Missed and upcoming reminders.

### AI Assistant

- Ask AI input.
- Expense analysis.
- Routine suggestion.
- Monthly summary.
- OCR and receipt parser suggestions.
- AI remains optional and disabled by default until configured.

### Backup

- Export CSV.
- Export JSON.
- Restore.
- Download.
- Cloud sync marked as future.

### Calendar

- Month, week, and day views.
- Show expenses, tasks, and reminders.

### Profile

- Avatar.
- Name.
- Theme.
- Currency.
- Language.
- Notification.

### Settings

- Theme.
- Language.
- Currency.
- Export/import.
- Backup.
- Notification.
- Privacy.

## Data Model Draft

### Expense

- id
- date
- itemName
- category
- amount
- quantity
- unit
- paymentMethod
- note
- sourceType: manual, image, text, recurring
- createdAt
- updatedAt

### Budget Category

- id
- name
- type
- monthlyLimit
- weeklyLimit
- dailyLimit
- color
- isActive

### Routine Task

- id
- title
- category
- priority
- plannedStart
- plannedEnd
- actualStart
- actualEnd
- status
- repeatRule
- reminderAt
- note

### Timer Session

- id
- taskId
- title
- category
- startedAt
- endedAt
- durationSeconds
- mode: timer, stopwatch, focus
- note

### Note

- id
- title
- body
- tags
- createdAt
- updatedAt

## AI And Automation Plan

AI should be optional and replaceable. The app should work without AI first.

Free/local options to explore:

- Local rule-based text parsing for receipts.
- Browser OCR for images.
- Optional free-tier AI API through user-provided key.
- Optional local model integration later if practical.

AI-assisted features:

- Convert receipt text into expense rows.
- Suggest expense categories.
- Summarize monthly spending.
- Generate daily routine from task list.
- Suggest better work-life balance based on missed tasks and time logs.
- Convert voice or rough notes into structured tasks.

## MVP Scope

The first usable version should include:

- Dashboard
- Budget categories
- Manual expense entry
- Expense table with auto totals
- Daily/monthly budget summary
- Routine task list
- Task status update
- Basic timer or stopwatch
- Local data storage

OCR, AI parsing, advanced reports, and notifications can come after the base tracking flow is stable.

## Roadmap

### Phase 1: Foundation

- Build main layout and navigation.
- Create dashboard structure.
- Set up local storage or IndexedDB.
- Create reusable UI components for forms, tables, filters, and summary cards.

### Phase 2: Budget Core

- Add category management.
- Add manual expense form.
- Add expense table.
- Add daily, weekly, and monthly totals.
- Add category-wise remaining budget.

### Phase 3: Routine Core

- Add routine/task creation.
- Add status handling.
- Add daily routine view.
- Add overdue and delayed status logic.
- Add simple progress summary.

### Phase 4: Timer And Focus

- Add stopwatch and timer.
- Connect timer sessions with tasks.
- Show planned vs actual time.
- Add daily time summary.

### Phase 5: Notifications

- Add browser notification permission flow.
- Add reminder scheduler.
- Add budget limit alerts.
- Add missed task alerts.

### Phase 6: OCR And Text Parsing

- Add image upload for receipts.
- Extract text using free/local OCR.
- Build receipt-text-to-table parser.
- Add review screen before saving extracted expenses.

### Phase 7: AI Layer

- Add optional AI settings page for free API key.
- Add provider abstraction so AI can be changed later.
- Add AI category suggestion, routine suggestion, and summary generation.

### Phase 8: Reports And Backup

- Add monthly reports.
- Add CSV/JSON export.
- Add data import/restore.
- Add backup reminder.

## Technical Approach

- Framework: Next.js with React.
- Styling: Tailwind CSS or the app's existing styling system.
- Storage first version: localStorage or IndexedDB.
- Better local database later: Dexie.js over IndexedDB.
- OCR option: Tesseract.js or another free browser-compatible OCR tool.
- Notifications: Browser Notification API.
- Charts: simple React chart library or custom lightweight charts.
- AI: optional provider adapter, disabled by default.

## Success Criteria

The project is successful when the app can help with real daily use:

- Expenses can be added in less than a minute.
- Budget category totals update automatically.
- The user can see today's spending and remaining budget at a glance.
- Daily routine tasks are visible and status changes are clear.
- Timer sessions can show where time is going.
- Missed tasks and over-budget categories are easy to notice.
- Data remains accessible, exportable, and not locked into a paid service.

## Future Ideas

- Mobile-first PWA install support.
- Offline support.
- Voice input for expense or task creation.
- Habit streaks.
- Meal planning connected to bajar list.
- Shopping list that converts into expenses after purchase.
- Personal finance goals and savings tracker.
- Health and medicine schedule.
- Family member-wise cost tracking.
- Calendar view.
- Weekly life review.
- Monthly AI summary.
- Password or device-level privacy lock.
