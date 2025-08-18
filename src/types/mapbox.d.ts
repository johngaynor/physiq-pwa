declare module "@mapbox/search-js-react" {
  import { ReactNode } from "react";

  interface AddressAutofillProps {
    accessToken: string;
    children?: ReactNode;
    onRetrieve?: (response: any) => void;
    onSuggest?: (response: any) => void;
    onError?: (error: any) => void;
  }

  interface SearchBoxProps {
    accessToken: string;
    value?: string;
    options?: {
      language?: string;
      country?: string;
      types?: string;
      proximity?: string;
    };
    onRetrieve?: (response: any) => void;
    onSuggest?: (response: any) => void;
    onError?: (error: any) => void;
    placeholder?: string;
  }

  export const AddressAutofill: React.FC<AddressAutofillProps>;
  export const SearchBox: React.FC<SearchBoxProps>;
}
