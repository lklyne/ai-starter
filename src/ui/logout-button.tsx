import { authClient } from "@/client/auth";
import { useState } from "react";

export function LogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    
    try {
      await authClient.signOut();
      window.location.href = '/auth/sign-in';
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      className="btn btn-default text-sm"
    >
      {loggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}