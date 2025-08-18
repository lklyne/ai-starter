# Database Management Guide

## Overview

This project uses a multi-layer database architecture:
- **PostgreSQL**: Primary database (runs in Docker during development)
- **Drizzle ORM**: Schema definition and database operations
- **Zero Sync Engine**: Real-time data synchronization between frontend and backend

## Schema Architecture

```
src/db/schema.ts (Source of Truth)
        ↓
   Drizzle Push
        ↓
   PostgreSQL Database
        ↓
   Zero Schema Generation
        ↓
src/shared/schema.ts (Auto-generated)
        ↓
   Zero Queries & Mutators
        ↓
   Frontend Components
```

## Making Schema Changes

### Step-by-Step Process

Follow these steps **in order** when making any schema changes:

#### 1. Edit the Schema
```bash
# Edit the Drizzle schema file
src/db/schema.ts
```

Make your changes using Drizzle's schema syntax:
- Add/remove tables
- Add/remove columns
- Modify column types
- Add/remove indexes
- Define relationships using `relations()`

#### 2. Push Schema to Database
```bash
pnpm db:push
```

**Important Notes:**
- This command may prompt for input - monitor the output carefully
- It will ask for confirmation if destructive changes are detected
- During development, this replaces traditional migrations

#### 3. Generate Zero Schema
```bash
pnpm gen-schema
```

This regenerates `src/shared/schema.ts` from your Drizzle schema. **Never edit this file manually.**

#### 4. Update Zero Queries/Mutators (if needed)
If your schema changes affect existing queries or mutators:
- Update `src/shared/queries.ts`
- Update `src/shared/mutators.ts`
- Update server-side overrides in `src/server/` if applicable

#### 5. Type Check Everything
```bash
pnpm check:all
```

Fix any TypeScript errors that arise from schema changes.

#### 6. Test the Application
```bash
pnpm dev
```

Verify that your changes work as expected in the running application.

## Development Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start full development environment (PostgreSQL + Vite + Zero) |
| `pnpm db:push` | Apply schema changes to PostgreSQL |
| `pnpm db:studio` | Open Drizzle Studio for database exploration |
| `pnpm gen-schema` | Generate Zero schema from Drizzle schema |
| `pnpm check:all` | Run TypeScript type checking |
| `pnpm dev:docker` | Start only PostgreSQL in Docker |

## Schema Design Principles

### Normalization
The database uses normalized tables (3NF) to:
- Eliminate data redundancy
- Ensure data integrity
- Enable efficient updates

### Relationships
All foreign keys must be indexed for efficient Zero sync. Define relationships in Drizzle using:

```typescript
// In schema.ts
export const userRelations = relations(users, ({ many, one }) => ({
  posts: many(posts),
  profile: one(profiles),
}));
```

### Required Patterns

#### Primary Keys
Every table must have a primary key. Use UUIDs for distributed systems:

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  // other columns...
});
```

#### Timestamps
Include created/updated timestamps on most tables:

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  // other columns...
});
```

#### Foreign Key Indexes
All foreign keys must be indexed:

```typescript
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  // other columns...
}, (table) => ({
  userIdIdx: index('posts_user_id_idx').on(table.userId),
}));
```

## Common Scenarios

### Adding a New Table

1. Define table in `src/db/schema.ts`
2. Add relationships if needed
3. Run `pnpm db:push`
4. Run `pnpm gen-schema`
5. Add queries/mutators for the new table
6. Run `pnpm check:all`

### Adding a Column

1. Add column to existing table in `src/db/schema.ts`
2. Run `pnpm db:push`
3. Run `pnpm gen-schema`
4. Update affected queries/mutators
5. Run `pnpm check:all`

### Modifying Relationships

1. Update `relations()` definitions in `src/db/schema.ts`
2. Run `pnpm db:push`
3. Run `pnpm gen-schema`
4. Update queries that use `.related()` calls
5. Run `pnpm check:all`

## Troubleshooting

### Common Issues

**Schema push fails:**
- Check for syntax errors in `src/db/schema.ts`
- Ensure PostgreSQL is running (`pnpm dev:docker`)
- Review destructive changes carefully

**Type errors after schema changes:**
- Run `pnpm gen-schema` to regenerate Zero schema
- Update query/mutator type annotations
- Check for breaking changes in table/column names

**Zero sync not working:**
- Verify relationships are properly defined
- Ensure foreign keys are indexed
- Check that queries use correct table/column names

### Getting Help

If you encounter issues:
1. Check the console output for specific error messages
2. Verify each step was completed in order
3. Use `pnpm db:studio` to inspect the actual database state

## File Reference

| File | Purpose | Edit? |
|------|---------|-------|
| `src/db/schema.ts` | Drizzle schema definition | ✅ Edit this |
| `src/shared/schema.ts` | Zero schema (auto-generated) | ❌ Never edit |
| `src/shared/queries.ts` | Zero query definitions | ✅ Edit as needed |
| `src/shared/mutators.ts` | Zero mutator definitions | ✅ Edit as needed |
| `src/server/server-queries.ts` | Server-side query overrides | ✅ Edit as needed |
| `src/server/server-mutators.ts` | Server-side mutator overrides | ✅ Edit as needed |