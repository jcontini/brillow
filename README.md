# Project Context

Brillow is a tool designed to help people organize and track properties during their house hunting journey. It provides an intuitive interface for managing property listings, comparing options, and keeping notes on potential homes - all in one place.


This is a collaborative project between:

* CPO (Human): Product direction, requirements, and technical review
* CTO (AI): Leading development and implementation via Cursor Composer


If you are   reading this and you're not a human, you are the CTO 🙌🏼


As CTO, I will:

* Proactively suggest technical solutions and improvements
* Ask clarifying questions before implementation
* Break down complex tasks into manageable steps
* Provide clear explanations for technical decisions
* Write clean, maintainable code following modern best practices
* Flag potential issues or trade-offs for discussion
* Manage requirements documentation:
  * Update requirements.md after CPO approval of new requirements
  * Wait for CPO testing before moving to next task
  * Mark requirements as complete [✓] after successful testing
  * Keep requirements in sync with actual implementation
* Follow implementation workflow:
  1. Discuss & clarify requirements
  2. Update requirements.md after CPO approval
  3. Implement feature
  4. Request CPO testing
  5. Address feedback if needed
  6. Mark requirement as complete after CPO approval
  7. Move to next task

# Core Functionality

- [ ] Display data in an interactive table
- [ ] Store data in localStorage
- [ ] Auto-save changes immediately
- [ ] Import/Export functionality (JSON)

## Table Features

- [ ] Sortable columns (default sort by rating, highest first)
- [ ] Filterable columns
- [ ] Resizable columns
- [ ] Reorderable columns (persisted in settings)
- [ ] Default column widths based on content
- [ ] Desktop-focused design
- [ ] Click-to-visit links (with URL format validation)

## CRUD Operations

### Create
- [ ] Add new records via inline table row

### Read
- [ ] Display all records in table format
- [ ] Load data from localStorage on app start

### Update
- [ ] Inline cell editing (click to edit)
- [ ] Star rating system (1-5 stars)
  - [ ] Click interaction
  - [ ] Hover preview for ratings
- [ ] Silent auto-save (no visual feedback needed)

### Delete
- [ ] Single record deletion at row level
- [ ] No bulk deletion needed
- [ ] No undo functionality needed

## Import/Export

### Export
- [ ] Export entire application state to JSON
- [ ] Filename format: `YYYY-MM-DD_brillow_export.json`
- [ ] Include version, timestamp, settings, and data
- [ ] Auto-generate filename with current date

### Import
- [ ] Import JSON files with application state
- [ ] Merge imported data with existing records
- [ ] Basic validation of file format and version
- [ ] Basic URL format validation
- [ ] Show toast notifications for import status/errors

## Error Handling
- [ ] Display toast notifications for errors
- [ ] Include technical error details in toast
- [ ] Basic localStorage error handling
- [ ] Import/Export validation errors

## Data Model

```typescript
interface HouseListing {
    id: string;
    rating: number;          // 1-5 stars
    link: string;           // URL
    neighborhood: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    price: number;          // Numeric value
    squareFeet: number;
    unit: string;          // e.g., "House", "Apt", "Unit 123"
    availability: string;   // ISO date format
    notes: string;
    dateAdded: string;     // ISO date format
}

interface AppState {
    version: string;
    exportedAt: string;     // ISO date format
    settings: {
        columnOrder: string[];
        currency: string;    // ISO 4217 currency code (e.g., "USD")
        // Future settings can be added here
    };
    data: {
        listings: HouseListing[];
    };
}
```

## Tech Stack & Development Environment

### Core Technologies
* Next.js 14 (App Router)
* React 18
* TypeScript
* Tailwind CSS for styling

### Dependencies
* `@tanstack/react-table` v8 for table functionality
* `zustand` for state management
* `sonner` for toast notifications
* `date-fns` for date formatting
* Built-in `Intl.NumberFormat` for currency

### Development Configuration
* ESLint enabled with recommended Next.js configuration
* Webpack for bundling
* `@brillow/*` import alias for cleaner imports
* `src/` directory structure for better organization

### Project Structure
```
src/
  app/
    layout.tsx
    page.tsx
    components/
    store/
    types/
    utils/
```

## Implementation Notes

### Scope Clarifications
- No performance optimizations needed (small dataset assumption)
- No data backup beyond localStorage + manual JSON export/import
- No dataset size limits or handling required
- Ratings are whole numbers only (1-5), no partial ratings
- Import/Export limited to JSON format only
- No version migration support needed for imported files
- No keyboard navigation requirements
- No field validation beyond URL format
- No min/max constraints on numeric fields
- No required fields
- Desktop-first, no mobile optimization needed
- No visual feedback for auto-save operations
- Basic error handling (no retry mechanism for localStorage)
- Store original URLs only, format display programmatically
- Invalid field values shown as empty string
- No date picker UI

### Modern Next.js Features to Leverage

* Use App Router (stable in 14) with Server Components
* Implement data fetching directly in components using Server Components
* Utilize Partial Prerendering for static and dynamic content
* Take advantage of Server Actions for form handling and mutations
* Use the optimized next/image component
* Leverage built-in font optimization with next/font

### Data Fetching Strategy

* Use Server Components for data fetching where possible
* Implement caching and revalidation using:
  ```typescript
  // Cache data indefinitely
  const data = await fetch(url, { cache: 'force-cache' })
  
  // Revalidate cache every 60 seconds
  const data = await fetch(url, { next: { revalidate: 60 } })
  
  // Dynamic data fetching
  const data = await fetch(url, { cache: 'no-store' })
  ```
* Use Server Actions for mutations and form submissions

### Development Workflow

1. Set up Next.js 14 project with:
   ```bash
   npx create-next-app@14 brillow --typescript --tailwind --app --use-npm
   ```
2. Enable recommended ESLint configuration
3. Use src directory for better code organization
4. Implement features incrementally, starting with core table functionality

## Implementation Details

### Display Formatting

**Link Display Format:**
- Store original URL only
- Display format: `{domain}//{identifier}`
- Examples:
  - `https://www.zillow.com/b/gables-central-park` → "Zillow//Gables Central Park"
  - `https://www.zillow.com/homedetails/29433961` → "Zillow//29433961"
  - `https://www.facebook.com/marketplace/item/544902295128276` → "Facebook//544902295128276"
- Strip www, https://, .com from domain
- Capitalize first letter of domain
- Use content after last slash as identifier
- Links are clickable in table (opens in new tab)

**Number Formatting:**
- Bedrooms/bathrooms: Allow decimals (e.g., 2.5)
- Square feet: Whole numbers only
- Price: Uses Intl.NumberFormat based on selected currency

**Date Formatting:**
- Uses date-fns library
- Store dates in ISO format
- Display in user's selected format
- Invalid dates shown as empty string
- No date picker UI needed

### Settings
User configurable options stored in localStorage:
- Currency format (default: USD)
  - Uses Intl.NumberFormat for display
  - Supports major currencies (USD, EUR, GBP, etc.)
  - Format example: "$1,907.00", "£1,907.00", "€1.907,00"
- Date format
- Column order (as specified in sample data)

### Default Data
New users should see a single sample listing to demonstrate the interface:
```typescript
{
  id: "sample-1",
  rating: 5,
  link: "https://www.zillow.com/b/gables-central-park",
  neighborhood: "Triangle State",
  address: "800 W 38th St",
  bedrooms: 2,
  bathrooms: 1,
  price: 1907,
  squareFeet: 1000,
  unit: "1308",
  availability: "2024-03-19",
  notes: "Sample listing to demonstrate the interface",
  dateAdded: "2024-03-19"
}
```

### Import/Export Behavior
- Use `link` field as unique identifier for merging
- Imported records overwrite existing records with matching links
- No conflict resolution needed - newer data takes precedence


