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
  increment?: number;
  onUpdate: (value: number) => void;
}> = ({
  header,
  subheader,
  currentValue,
  Trigger,
  onUpdate,
  increment = 1,
}) => {
  const [inputValue, setInputValue] = useState("0");
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = () => {
    const currentVal = parseFloat(inputValue) || 0;
    const newValue = currentVal + increment;
    setInputValue(newValue.toString());
  };

  const handleSubtract = () => {
    const currentVal = parseFloat(inputValue) || 0;
    const newValue = Math.max(0, currentVal - increment); // Prevent negative values
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

  const handleAddValue = () => {
    const formValue = parseFloat(inputValue) || 0;
    onUpdate(currentValue + formValue);
    setInputValue("0");
    setIsOpen(false);
  };

  const handleSubtractValue = () => {
    const formValue = parseFloat(inputValue) || 0;
    const newValue = Math.max(0, currentValue - formValue);
    onUpdate(newValue);
    setInputValue("0");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setInputValue("0");
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
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
