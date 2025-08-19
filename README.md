# Zero AI Starter

Prompt example:

> I want to create an bug tracker. This repository has the scaffold to get started and documents what frameworks should be used.

To aim for better results, refine CLAUDE.md. Counter-examples work well.

### For first-time setup, run these commands in order:

  1. pnpm install - Install dependencies
  2. pnpm run db:push - Set up the database schema
  3. pnpm run gen-schema - Generate Zero schema from Drizzle schema
  4. pnpm run dev - Start the full development environment

  The project will be available at `http://localhost:8080/`

to kill zero:

`pkill -f zero-cache`
