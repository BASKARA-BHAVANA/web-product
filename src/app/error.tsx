'use client';

import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl text-center">
        <h1 className="mb-2 text-3xl font-semibold">Something went wrong</h1>
        <p className="mb-6 text-sm text-gray-600">
          An unexpected error happened. Try again or contact support.
        </p>

        <div className="flex justify-center gap-3">
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => reset()} // attempts to recover the boundary
          >
            Try again
          </button>

          <button
            className="rounded border px-4 py-2"
            onClick={() => router.push('/')}
          >
            Go home
          </button>
        </div>

        {/* dev-only stack */}
        <pre className="mt-6 overflow-auto rounded border bg-white p-3 text-left text-xs">
          {process.env.NODE_ENV === 'development' ? String(error?.stack) : null}
        </pre>
      </div>
    </div>
  );
}
