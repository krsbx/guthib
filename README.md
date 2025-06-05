# Getting Started

## Pre-requisites

- NodeJS v20 (`nvm install 20`)
- pnpm (`npm install -g pnpm`)

## Running locally

1. Clone the repository

```bash
> git clone git@github.com:krsbx/guthib.git
```

2. Install dependencies

```bash
> pnpm install
```

3. Setup environment variables

```bash
cp .env.example .env
```

> Chnage `VITE_GITHUB_TOKEN` on the `.env` file to your Github token, you can generate one [here](https://github.com/settings/tokens)
> The `VITE_GITHUB_TOKEN` is only used in development mode, if you want to use it in production change the `Github` object initiation process in `src/utils/github/index.ts`

```diff
// Only use `import.meta.env.VITE_GITHUB_TOKEN` if we're in development
// Change this to true if you want to use it in production or just change the `import.meta.env.DEV` to `import.meta.env.PROD`
- const conditionalToken = import.meta.env.DEV;
+ const conditionalToken = true;
```

4. Run the app

```bash
> pnpm run dev
```

5. Open [http://localhost:5173](http://localhost:5173)

# Tech Stack

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Chakra UI](https://chakra-ui.com/)
- [Zod](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

# Design Decisions

- Add a filter drawer so the user can filter the results based on their preferences
- User repositories are fetch only and only if the user clicks on a card, by doing so we can avoid making too many requests to Github and reduce the time it takes to load the page
