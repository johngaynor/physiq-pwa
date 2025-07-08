import React from "react";

interface FieldValueProps {
  title: string;
  value: string | number | null | undefined;
}

export const FieldValue: React.FC<FieldValueProps> = ({ title, value }) => {
  const displayValue =
    value !== null && value !== undefined ? String(value) : "Not provided";

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-gray-600">{title}</div>
      <div className="text-base text-gray-900 break-words">{displayValue}</div>
    </div>
  );
};
