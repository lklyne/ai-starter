// src/routes/dashboard.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { useSession } from '@/client/auth';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="card">
          <h1 className="text-xl font-bold mb-4">Access Denied</h1>
          <p className="text-body mb-4">You need to be logged in to access the dashboard.</p>
          <Link to="/auth/sign-in" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="card max-w-md">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-sm font-medium text-gray-600 mb-1">User ID</h2>
            <p className="text-lg font-mono text-gray-900">{session.user.id}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-sm font-medium text-gray-600 mb-1">Email</h2>
            <p className="text-lg text-gray-900">{session.user.email}</p>
          </div>
          
          {session.user.name && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-sm font-medium text-gray-600 mb-1">Name</h2>
              <p className="text-lg text-gray-900">{session.user.name}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <Link to="/" className="btn btn-default">
            Home
          </Link>
          <Link to="/auth/sign-in" className="btn btn-primary">
            Sign Out (go to sign-in)
          </Link>
        </div>
      </div>
    </div>
  );
}