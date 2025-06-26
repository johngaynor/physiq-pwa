import React, { useState } from "react";
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

export const DrawerWrapper: React.FC<{
  header: string;
  subheader: string;
  currentValue: number;
  Trigger: React.ReactNode;
  description: string;
  onUpdate: (value: number) => void;
}> = ({ header, subheader, currentValue, Trigger, onUpdate, description }) => {
  const [value, setValue] = useState(currentValue);
  const [inputValue, setInputValue] = useState(currentValue.toString());
  const [isOpen, setIsOpen] = useState(false);

  // Update local state when currentValue changes
  React.useEffect(() => {
    setValue(currentValue);
    setInputValue(currentValue.toString());
  }, [currentValue]);

  const handleAdd = () => {
    const newValue = value + 1;
    setValue(newValue);
    setInputValue(newValue.toString());
  };

  const handleSubtract = () => {
    const newValue = Math.max(0, value - 1); // Prevent negative values
    setValue(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);
    const numVal = parseFloat(inputVal);
    if (!isNaN(numVal) && numVal >= 0) {
      setValue(numVal);
    }
  };

  const handleSave = () => {
    onUpdate(value);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setValue(currentValue);
    setInputValue(currentValue.toString());
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{header}</DrawerTitle>
            <DrawerDescription>
              Use the buttons to add or subtract, or enter a custom value.
            </DrawerDescription>
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
                  id="custom-input"
                  type="number"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="text-center"
                  min="0"
                  step="0.1"
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
            <Button onClick={handleSave}>Save</Button>
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
