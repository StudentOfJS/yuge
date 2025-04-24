# Yuge grid project
In progress please wait. I will likely make many changes before changing this to a library and publishing it. I may remove or swap out dependencies. I still have to make decisions on styling and theming. Pushing unfinished, ruff and broken.
## Description
We all love a good table or grid, right? Me neither, so I decided to make one that I would choose to use. Just the features I want, none of the bloat, optimized for performance and ease of use. 
## Features
- **Virtual scrolling**: Only renders the rows that are visible in the viewport, improving performance for large datasets.
- **Sort**: Sortable columns, cached for better performance.
- **Search**: Filtering optimizeed for your pleasurre.

## Dependencies
- [Tanstack Virtual](https://tanstack.com/virtual/latest) - The premier library for virtual scrolling in React.
- [Zustand](https://github.com/pmndrs/zustand) - The best state management library for React.
## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Start the dev server:

```bash
pnpm dev
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```
