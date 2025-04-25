# Yuge grid project
In progress please wait. I will likely make many changes before changing this to a library and publishing it. I may remove or swap out dependencies. I still have to make decisions on styling and theming. Pushing unfinished, ruff and broken.
## Description
We all love a good table or grid, right? Me neither, so I decided to make one that I would choose to use. Just the features I want, none of the bloat, optimized for performance and ease of use. 
## Features
- **Virtual scrolling**: Only renders the rows that are visible in the viewport, improving performance for large datasets.
- **Sort**: Sortable columns, cached for better performance.
- **Search**: Filtering optimizeed for your pleasurre.

## Dependencies
- [Tanstack Virtual](https://tanstack.com/virtual/latest) - The premier library for virtual scrolling in React 🏆.
- [Zustand](https://github.com/pmndrs/zustand) - The best state management library for React 😍.
- [React Aria](https://react-spectrum.adobe.com/react-aria/getting-started.html) - I ❤️ react-spectrum for a11y but undecided to only include @react-aria/interactions to keep the bundle size down 🤓

## Important note
If you happen to find this prior to it becoming a package just ignore it. 
(What am I talking about, nobody is going to stumble upon the random profile of a Dev who spends his working life committing into the obscurity of AWS codecommit)
My workflow:
1. Ideas put straight into code
2. Think about life and code choices
3. Dream about stupid details I later discard
4. Iterate before testing or checking in browser
5. Finally decide I should probably try something in the browser (high chance of being distracted by something else at this stage even if it works as expected)
6. Iterate more
7. Bring in the help of an LLM to help add accessiblity
8. Use LLM to sanity check on the basis of maximum performance and smallest bundle size
9. Use my [MCP frontend testing server](https://github.com/StudentOfJS/mcp-frontend-testing) to write unit and component tests
10. Create a package
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
