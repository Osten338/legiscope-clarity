
"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "@/lib/utils";

// Enhanced version with debug logging for tabs
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, value, defaultValue, onValueChange, ...props }, ref) => {
  // Add debugging to track tab value changes
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log("Tabs component value:", value);
    }
  }, [value]);

  // Simplified handler without preventDefault - let Radix handle the native behavior
  const handleValueChange = React.useCallback(
    (newValue: string) => {
      console.log("Tabs onValueChange called with:", newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    },
    [onValueChange]
  );

  return (
    <TabsPrimitive.Root
      ref={ref}
      className={className}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      {...props}
    />
  );
});
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-lg bg-muted p-0.5 text-muted-foreground/70",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// Simplified TabsTrigger without custom click handling
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, value, children, ...props }, ref) => {
  // Debug log when component renders
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`TabsTrigger rendered with value: ${value}`);
    }
  }, [value]);
  
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium outline-offset-2 transition-all hover:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-black/5",
        className,
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, value, ...props }, ref) => {
  // Add some logging when content is rendered
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`TabsContent mounted: ${value}`);
    }
    
    return () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`TabsContent unmounted: ${value}`);
      }
    };
  }, [value]);
  
  return (
    <TabsPrimitive.Content
      ref={ref}
      value={value}
      className={cn(
        "mt-2 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70",
        className,
      )}
      {...props}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
