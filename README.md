# Margalla Table – Menu and Allergen Manager

**Course project, Assignment 1** (due Friday 30 October 2026)
**Assigned idea:** Restaurant Menu and Allergy Guide (idea # 27 from page 4)
**Instructor rule / data variant:** Menu management, ingredient/allergen filters, cross-contact notes and update timestamps. Not presented as medical advice.

**Live URL:** https://manahilfaran.github.io/Restaurant-Menu-And-Allergy-Guide/

## What it is

A web app for restaurant managers and kitchen staff to keep each dish's allergen information accurate and up to date, and to answer guest allergy questions quickly. It uses only HTML, CSS and vanilla JavaScript, with no frameworks and no backend.

**User:** restaurant manager or kitchen staff.
**Problem:** allergy data is only useful if it is accurate, current and easy to check.

See [`DESIGN.md`](DESIGN.md) for the design note, WDLC stages, client-versus-server split and wireframes.

## Setup and run

No installation or build step is needed.

1. Download or clone the repository: `git clone <your-repo-url>`
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox or Safari).

Data is saved in the browser's `localStorage`. To reset to the 8 sample dishes, clear the site data in your browser.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure (semantic HTML, forms, dialog) |
| `style.css` | Layout, responsive design and animation |
| `script.js` | Data, logic, DOM events and rendering |
| `DESIGN.md` | Design note and wireframes |

## Features

- **Overview:** counters for total dishes, dishes needing review, dishes with cross-contact notes, and allergen-free dishes
- **Menu management:** add, edit and delete dishes; mark a dish as reviewed
- **Search, filter and sort:** by dish or ingredient, category, "contains" allergen, "free from" allergen, needs review, has cross-contact note, and by name, price or oldest update
- **Guest allergy lookup:** tick what a guest avoids to see "Can offer", "Ask the chef first (traces)" and "Do not offer"
- **Cross-contact notes and traces:** recorded per dish and shown in the table
- **Update timestamps and data freshness:** every dish shows when it was last updated; dishes older than 30 days are flagged "Needs review"
- **Recent changes:** the five most recently updated dishes
- **Export CSV:** download the menu as a spreadsheet
- **Caveat banner:** states clearly that this is not medical advice

## Brief requirements and where to find them

| Requirement | Where |
|---|---|
| Semantic HTML, labels, input types, browser validation | `index.html` (`header`, `main`, `section`, `table`, `dialog`, `required`, `min`, `max`, `type=number`) |
| Selectors, box model, Flexbox/Grid | `style.css` |
| At least two media-query breakpoints | 640px (tablet) and 1000px (desktop); 1100px shows the hero illustration; a max-width 639px rule turns table rows into cards on mobile |
| Variables, functions, arrays, conditionals, DOM events | `script.js` |
| Two or more interactions | Filtering/search/sort of the menu; guest lookup conflict check; add/edit/delete with validation |
| Empty and invalid input | Empty search results, empty menu, empty lookup, invalid or duplicate dish form |
| Six or more sample records | 8 dishes in the `SEED` array |
| Works without a backend | Data stored in `localStorage` behind an `api` object |

## Data and API layer

Each dish is a structured object:

```js
{ id, name, price, cat, allergens[], traces[], ingredients[], note, updated }
```

The `api` object (`list`, `save`, `remove`) reads and writes `localStorage`. In later assignments these three functions will be replaced with `fetch()` calls to a real server and database. The rest of the app will not change.

## Accessibility

Semantic landmarks, a skip link, labelled form controls, a real table with `scope` headers, a native `<dialog>` for the editor, `aria-live` status messages, visible keyboard focus, keyboard-usable allergen chips, and `prefers-reduced-motion` support.

## Disclaimer

This is a student project with sample data. It shows only what staff have entered and is **not medical advice**. Always confirm allergen information with the chef.

