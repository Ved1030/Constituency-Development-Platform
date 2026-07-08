"use client";

import { Button } from "@/components/ui/button";
import { APIError } from "@/services/api/client";

interface APIErrorDisplayProps {
  error: Error | APIError | null;
  onRetry?: () => void;
  title?: string;
}

export function APIErrorDisplay({
  error,
  onRetry,
  title,
}: APIErrorDisplayProps) {
  const status = error instanceof APIError ? error.status : null;
  const message = error?.message || "An unexpected error occurred";

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
      <div className={`rounded-full p-4 mb-4 ${
        status && status >= 500 ? "bg-red-100" : "bg-amber-100"
      }`}>
        <svg
          className={`w-8 h-8 ${
            status && status >= 500 ? "text-red-600" : "text-amber-600"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      )}
      <p className="text-sm text-gray-500 mb-4 max-w-sm">{message}</p>
      {status && (
        <span className="text-xs text-gray-400 mb-4">Status: {status}</span>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Retry
        </Button>
      )}
    </div>
  );
}
