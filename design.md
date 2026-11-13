# Design Note – Margalla Table Menu and Allergen Manager

**Assigned idea:** Restaurant Menu and Allergy Guide (idea # 27)
**Instructor rule:** menu management, ingredient/allergen filters, cross-contact notes, update timestamps. Not presented as medical advice.

## 1. User and problem

**User:** A restaurant manager or kitchen staff member at Margalla Table.

**Problem:** Allergy information is only useful if it is accurate and current. Staff need one place to record what each dish contains, note cross-contact risks, see which entries are out of date, and answer a guest's allergy question quickly and consistently.

**Core workflow:**
1. Check the overview to see how many dishes need review.
2. Search, filter and sort the menu.
3. Add, edit or delete a dish, or mark it as reviewed.
4. When a guest states an allergy, use Guest lookup to see which dishes to offer, which to check with the chef, and which to avoid.
5. Export the menu as CSV.

**Caveat:** The app shows only what staff have entered. It is not medical advice, and a banner says so on every screen.

## 2. Web design life cycle (WDLC)

| Stage | What I did |
|---|---|
| Planning | Chose the user (restaurant staff) and the problem (accurate, current allergen data). |
| Analysis | Listed the data needed per dish (allergens, traces, ingredients, note, timestamp) and the tasks (search, filter, edit, review, lookup). |
| Design | Sketched the wireframes below, chose a green and saffron palette, and planned the mobile, tablet and desktop layouts. |
| Implementation | Semantic HTML, CSS (Grid, Flexbox, media queries) and vanilla JavaScript. |
| Testing | Checked empty search results, an empty menu, invalid form input, duplicate dish names, and the three screen sizes. |
| Maintenance | Staff update data through the app. New allergens are added to the `ALLERGENS` array. |

## 3. Browser (client) versus server

**Runs in the browser now:**
- Rendering the page and the table
- Search, filter and sort
- Form validation (HTML attributes plus JavaScript checks)
- Guest lookup logic and the overview counters
- Data storage in `localStorage`, behind an `api` object (`list`, `save`, `remove`)
- CSV export

**Would run on a server later (Assignments 2 and 3):**
- A shared database, so every staff device sees the same menu
- Staff login and permissions
- A history of who changed which dish and when
- A REST API. Only the three `api` methods change, from `localStorage` to `fetch()`.

## 4. Wireframes

**Desktop (1000px and wider)**
```
+--------------------------------------------------------------+
| Hero: title, short text, nav links              [bowl art]   |
+--------------------------------------------------------------+
| Banner: Not medical advice                                   |
+--------------------------------------------------------------+
| [ Dishes ] [ Need review ] [ Cross-contact notes ] [ Free ]  |
+-------------------------------------+------------------------+
| MENU MANAGEMENT      [Add] [CSV]    | GUEST ALLERGY LOOKUP   |
| [search][category][contains]        | [x nuts] [x dairy] ... |
| [free from][show][sort]             | Can offer / Ask chef / |
| +---------------------------------+ | Do not offer           |
| | Dish | Price | Contains | ...   | +------------------------+
| | rows with Edit/Reviewed/Delete  | | RECENT CHANGES         |
| +---------------------------------+ | 1. ...  2. ...         |
+-------------------------------------+------------------------+
```

**Tablet (640px to 999px)**
```
Hero / Banner
[ Stat ][ Stat ][ Stat ][ Stat ]
Guest lookup (full width)
Menu management (full width table)
Recent changes
```

**Mobile (under 640px)**
```
Hero / Banner
[ Stat ][ Stat ]
[ Stat ][ Stat ]
Guest lookup
Menu management
 +-----------------+
 | Dish name       |   each table row becomes a
 | Price           |   stacked card with labels
 | Contains        |
 | Updated         |
 | [Edit][Review]  |
 +-----------------+
Recent changes
```

## 5. Key design decisions

- **Left table, right tools on desktop:** The main job (managing dishes) gets the most space, and the quick lookup stays visible beside it.
- **Responsive table:** Rows turn into labelled cards on mobile, so no horizontal scrolling is needed.
- **Colour has a meaning:** Red marks allergens and "do not offer", amber marks traces and "needs review", and green marks safe.
- **Accessibility:** Semantic landmarks, labelled inputs, keyboard-usable chips, a native `<dialog>` for the editor, `aria-live` status messages, visible focus, and `prefers-reduced-motion` support.
- **Data freshness:** Each dish shows its last-updated time, and anything older than 30 days is flagged "Needs review".