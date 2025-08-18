// src/routes/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="card text-center">
        <h1 className="text-3xl font-bold mb-6">AI Starter</h1>
        <Link to="/auth/sign-in" className="btn btn-primary">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
