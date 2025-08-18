// src/routes/dashboard.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { useSession } from '@/client/auth';
import { ZeroInit } from '@/ui/zero-init';
import { LogoutButton } from '@/ui/logout-button';
import { NotesSection } from '@/ui/notes-section';
import { DebugInfo } from '@/ui/debug-info';

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
    <ZeroInit>
      <div className="min-h-screen bg-gray-50">
        {/* Header with logout */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Welcome back,</span>
                <span className="font-medium">{session.user.name || session.user.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="btn btn-default text-sm">
                Home
              </Link>
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <NotesSection />
        </main>

        {/* Footer with debug info */}
        <footer className="max-w-6xl mx-auto px-6 py-4">
          <DebugInfo />
        </footer>
      </div>
    </ZeroInit>
  );
}