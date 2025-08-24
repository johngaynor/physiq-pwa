"use client";
import React, { useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";

interface LocationSearchBoxProps {
  onRetrieve: (response: any) => void;
  placeholder?: string;
  label?: string;
  initialValue?: string;
}

const LocationSearchBox: React.FC<LocationSearchBoxProps> = ({
  onRetrieve,
  placeholder = "Search for locations...",
  label,
  initialValue = "",
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const SearchBoxComponent = SearchBox as any;
  const { theme } = useTheme();

  const handleRetrieve = (response: any) => {
    // Set the search value to the selected location's address
    if (response.features?.[0]?.properties?.full_address) {
      setSearchValue(response.features[0].properties.full_address);
    }
    // Call the parent's onRetrieve callback
    onRetrieve(response);
  };

  return (
    <>
      {label && <Label>{label}</Label>}
      <SearchBoxComponent
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        options={{
          language: "en",
          country: "US",
          types: "poi",
          proximity: "ip",
        }}
        onRetrieve={handleRetrieve}
        placeholder={placeholder}
        value={searchValue}
        onChange={setSearchValue}
        theme={
          theme === "dark"
            ? {
                variables: {
                  colorBackground: "#0f172a",
                  colorBackgroundHover: "#1e293b",
                  colorText: "#ffffff",
                  fontFamily: "inherit",
                  unit: "14px",
                },
                cssText: `
                  .Input {
                    color: #ffffff !important;
                    border: 1px solid #374151 !important;
                    border-radius: 6px !important;
                    background-color: #0f172a !important;
                  }
                `,
              }
            : {}
        }
      />
    </>
  );
};

export default LocationSearchBox;
