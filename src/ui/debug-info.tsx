import { useSession } from "@/client/auth";
import { useState } from "react";

export function DebugInfo() {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-gray-200 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 mb-2"
      >
        <span>{isExpanded ? '▼' : '▶'}</span>
        Debug Info
      </button>
      
      {isExpanded && (
        <div className="space-y-4 text-xs">
          {/* Account Information */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-700 mb-1">User ID</h5>
                <p className="font-mono text-gray-900 text-xs break-all">{session?.user?.id || 'Not logged in'}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-700 mb-1">Email</h5>
                <p className="text-gray-900">{session?.user?.email || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-700 mb-1">Name</h5>
                <p className="text-gray-900">{session?.user?.name || 'Not set'}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-700 mb-1">Email Status</h5>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${session?.user?.emailVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-gray-900">{session?.user?.emailVerified ? 'Verified' : 'Not verified'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium text-gray-700 mb-2">Session Details</h4>
              <div className="space-y-1">
                <div><span className="font-medium">Session ID:</span> {session?.session?.id || 'N/A'}</div>
                <div><span className="font-medium">Token:</span> {session?.session?.token ? '••••••••' : 'N/A'}</div>
                <div><span className="font-medium">Expires:</span> {session?.session?.expiresAt ? new Date(session.session.expiresAt).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium text-gray-700 mb-2">Environment</h4>
              <div className="space-y-1">
                <div><span className="font-medium">URL:</span> {typeof window !== 'undefined' ? window.location.origin : 'Server'}</div>
                <div><span className="font-medium">User Agent:</span> {typeof navigator !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'N/A'}</div>
                <div><span className="font-medium">Timestamp:</span> {new Date().toISOString()}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium text-gray-700 mb-2">Application</h4>
              <div className="space-y-1">
                <div><span className="font-medium">Framework:</span> TanStack Start</div>
                <div><span className="font-medium">Database:</span> PostgreSQL</div>
                <div><span className="font-medium">Sync:</span> Zero</div>
                <div><span className="font-medium">Auth:</span> Better-Auth</div>
              </div>
            </div>
          </div>
          
          {session && (
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Raw Session Data</h4>
              <pre className="text-yellow-700 overflow-x-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}