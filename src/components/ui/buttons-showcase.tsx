
"use client";
import React from "react";
import { ButtonsCard } from "@/components/ui/buttons-card";
import { buttons } from "@/data/button-styles";
import { copyToClipboard, getButtonString } from "@/utils/copy-utils";

export function ButtonsShowcase() {
  const handleCopy = (button: any) => {
    const buttonString = getButtonString(button);
    if (buttonString) {
      copyToClipboard(buttonString);
    }
  };

  return (
    <div className="pb-20 px-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl mx-auto gap-6">
        {buttons.map((button, idx) => (
          <ButtonsCard key={idx} onClick={() => handleCopy(button)}>
            {button.component}
          </ButtonsCard>
        ))}
      </div>
    </div>
  );
}
