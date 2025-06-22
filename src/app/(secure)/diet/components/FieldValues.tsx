import React from "react";

export const FieldValue = ({
  title,
  value,
}: {
  title: string;
  value: string | number | null;
}) => {
  return (
    <div>
      <p className="text-muted-foreground">{title}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
};
