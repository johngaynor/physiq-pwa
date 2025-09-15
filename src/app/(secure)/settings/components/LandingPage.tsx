import React from "react";

interface LandingPageProps {
  title?: string;
  subtitle?: string;
}

export default function LandingPage({
  title = "This page is not available yet",
  subtitle = "We're working on bringing you this feature soon.",
}: LandingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4 border-2 rounded-lg">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
