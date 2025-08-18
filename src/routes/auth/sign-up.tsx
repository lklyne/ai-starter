// src/routes/auth/sign-up.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { signIn, signUp } from '@/client/auth';

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpPage,
});

function SignUpPage() {
  const [signingUp, setSigningUp] = useState(false);
  const [error, setError] = useState<string>();

  async function handleGitHubSignUp() {
    if (signingUp) {
      return;
    }
    setSigningUp(true);
    setError(undefined);

    const response = await signIn.social({
      provider: "github",
    });

    if (response.error) {
      setSigningUp(false);
      setError(response.error.message ?? response.error.statusText);
      return;
    }

    // Redirect to dashboard on successful signup
    if (response.data) {
      window.location.href = '/dashboard';
    }
  }

  async function handleEmailSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (signingUp) {
      return;
    }
    setSigningUp(true);
    setError(undefined);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!name) {
      setSigningUp(false);
      setError("Name is required");
      return;
    }
    if (!email) {
      setSigningUp(false);
      setError("Email is required");
      return;
    }
    if (!password) {
      setSigningUp(false);
      setError("Password is required");
      return;
    }

    const response = await signUp.email({
      name,
      email,
      password,
    });

    if (response.error) {
      setSigningUp(false);
      setError(response.error.message ?? response.error.statusText);
      return;
    }

    // Redirect to dashboard on successful signup
    if (response.data) {
      window.location.href = '/dashboard';
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="card w-full max-w-md">
        {error && <div className="text-error">{error}</div>}
        <h2 className="text-lg font-semibold mb-4">Create Your Account</h2>
        <form className="space-y-4" onSubmit={handleEmailSignUp}>
          <div>
            <label className="block mb-1 text-xs font-medium text-heading">
              Name
            </label>
            <input type="text" name="name" className="input" placeholder="your name" />
            <label className="block mb-1 text-xs font-medium text-heading mt-2">
              Email
            </label>
            <input type="email" name="email" className="input" placeholder="email" />
            <label className="block mb-1 text-xs font-medium text-heading mt-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="password"
            />
          </div>
          <button
            disabled={signingUp}
            type="submit"
            className="btn btn-primary w-full"
          >
            Sign Up with Email
          </button>
        </form>
        <div className="text-center text-sm text-muted my-4">or</div>
        <button
          disabled={signingUp}
          className="btn btn-default w-full flex items-center justify-center gap-2"
          onClick={handleGitHubSignUp}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82a7.5 7.5 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.94-.01 2.2 0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Continue with GitHub
        </button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-subtle">
            Already have an account?{' '}
            <Link to="/auth/sign-in" className="text-blue-600 hover:text-blue-800 underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}