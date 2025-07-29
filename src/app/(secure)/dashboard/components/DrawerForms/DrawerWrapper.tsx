import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button, Input } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";

export const DrawerWrapper: React.FC<{
  header: string;
  subheader: string;
  currentValue: number | string;
  Trigger: React.ReactNode;
  increment?: number;
  defaultReplace?: boolean;
  onUpdate: (value: number) => void;
}> = ({
  header,
  subheader,
  currentValue,
  Trigger,
  onUpdate,
  increment = 1,
  defaultReplace = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [replaceMode, setReplaceMode] = useState(defaultReplace);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // assign initial form value when drawer opens
  useEffect(() => {
    if ((defaultReplace || replaceMode) && isOpen) {
      if (
        currentValue !== null &&
        currentValue !== undefined &&
        currentValue !== ""
      ) {
        setInputValue(currentValue.toString());
      } else {
        setInputValue("");
      }
    }
  }, [currentValue, defaultReplace, replaceMode, isOpen]);

  // focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }, 250); // Adjust delay if needed based on your drawer's animation timing
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Handle mobile keyboard behavior
  useEffect(() => {
    const handleViewportChange = () => {
      // Detect if virtual keyboard is open on mobile
      const currentViewportHeight =
        window.visualViewport?.height || window.innerHeight;
      const heightDifference = window.innerHeight - currentViewportHeight;

      // If viewport height reduced by more than 150px, likely keyboard is open
      setIsKeyboardOpen(heightDifference > 150);
    };

    // Listen for viewport changes (mobile keyboard open/close)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
      return () => {
        window.visualViewport?.removeEventListener(
          "resize",
          handleViewportChange
        );
      };
    }
  }, []);

  // Prevent body scroll when drawer is open (helps with mobile positioning)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const handleAdd = () => {
    const currentVal = parseFloat(inputValue) || 0;
    const newValue = Math.round((currentVal + increment) * 10) / 10; // Round to 1 decimal place
    setInputValue(newValue.toString());
  };

  const handleSubtract = () => {
    const currentVal = parseFloat(inputValue) || 0;
    const newValue = Math.max(
      0,
      Math.round((currentVal - increment) * 10) / 10
    ); // Prevent negative values and round
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const numVal = parseFloat(inputVal);

    // Only allow non-negative values
    if (inputVal === "" || (!isNaN(numVal) && numVal >= 0)) {
      setInputValue(inputVal);
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Scroll input into view on mobile when focused
    setTimeout(() => {
      e.target.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 300); // Wait for keyboard animation
  };

  const handleAddValue = () => {
    const formValue = parseFloat(inputValue) || 0;
    const baseValue =
      typeof currentValue === "number"
        ? currentValue
        : parseFloat(currentValue as string) || 0;
    onUpdate(baseValue + formValue);
    setInputValue("");
    setIsOpen(false);
  };

  const handleSubtractValue = () => {
    const formValue = parseFloat(inputValue) || 0;
    const baseValue =
      typeof currentValue === "number"
        ? currentValue
        : parseFloat(currentValue as string) || 0;
    const newValue = Math.max(0, baseValue - formValue);
    onUpdate(newValue);
    setInputValue("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setInputValue("");
    setReplaceMode(defaultReplace);
    setIsOpen(false);
  };

  const handleSave = () => {
    const formValue = parseFloat(inputValue) || 0;
    onUpdate(formValue);
    setInputValue("");
    setReplaceMode(defaultReplace);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
      <DrawerContent className={`${isKeyboardOpen ? "pb-0" : ""}`}>
        <div
          className={`mx-auto w-full max-w-sm ${
            isKeyboardOpen ? "pb-4" : "pb-10"
          }`}
        >
          <DrawerHeader>
            <DrawerTitle>{header}</DrawerTitle>
            <DrawerDescription>{subheader}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleSubtract}
                className="h-12 w-12 rounded-full"
              >
                -
              </Button>
              <div className="text-center">
                <Input
                  ref={inputRef}
                  id="custom-input"
                  type="number"
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  className="text-center"
                  min="0"
                  step="0.1"
                  inputMode="decimal"
                  autoComplete="off"
                />
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={handleAdd}
                className="h-12 w-12 rounded-full"
              >
                +
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Checkbox
                id="replace-mode"
                checked={replaceMode}
                onCheckedChange={(checked) =>
                  setReplaceMode(checked as boolean)
                }
              />
              <label
                htmlFor="replace-mode"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Replace current value instead of add/subtract
              </label>
            </div>
            {replaceMode ? (
              <Button onClick={handleSave}>Save</Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSubtractValue}
                  variant="secondary"
                  className="flex-1"
                >
                  Subtract
                </Button>
                <Button onClick={handleAddValue} className="flex-1">
                  Add
                </Button>
              </div>
            )}
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
