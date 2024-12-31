<h1 align="center">⚡ Dependency Tracker ⚡</h1>

<p align="center">
Track all dependency across all your projects at one place.
</p>

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Use `cd` to change into the app's directory

   ```bash
   cd name-of-new-app
   ```

3. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   GH_ACCESS_TOKEN=[INSERT GITHUB ACCESS TOKEN]
   NEXT_PUBLIC_GITHUB_OWNER=[INSERT GITHUB OWNER/ORG NAME]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

4. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The project should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

# Example DB

The app is currently configured to use the following type of data from the table `versions`:

```csv
created_at,id,environment,key,value,modified_at
{dateandtime},{your-project-name},{LOCAL/DEV/BETA/PROD},{your-tool-name},{current-version},{dateandtime}
```

Create your DB matching the above example.

# Documentation

### Scripts

- `npm run dev` — Starts the application in development mode at `http://localhost:3000`.
- `npm run build` — Creates an optimized production build of your application.
- `npm run start` — Starts the application in production mode.
- `npm run type-check` — Validate code using TypeScript compiler.
- `npm run lint` — Runs ESLint for all files in the `src` directory.
- `npm run format-check` — Runs Prettier and checks if any files have formatting issues.
- `npm run format` — Runs Prettier and formats files.
- `npm run prepush` — Runs all checks.
