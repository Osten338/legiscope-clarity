
import { cn } from "@/lib/utils";
import React from "react";

type TypographyVariant = 
  | 'display'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' 
  | 'lead' | 'body' | 'small' | 'label' | 'caption';

type TypographyProps = {
  variant: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

export function Typography({
  variant,
  children,
  className,
  as,
}: TypographyProps) {
  const Component = getComponent(variant, as);
  
  const variantClassNames = {
    display: "typography-display text-5xl md:text-6xl lg:text-7xl",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    lead: "text-lead",
    body: "text-body",
    small: "text-small",
    label: "typography-label",
    caption: "typography-caption",
  };

  return (
    <Component className={cn(variantClassNames[variant], className)}>
      {children}
    </Component>
  );
}

function getComponent(variant: TypographyVariant, override?: React.ElementType): React.ElementType {
  if (override) return override;
  
  switch (variant) {
    case 'display':
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'h5':
      return 'h5';
    case 'h6':
      return 'h6';
    case 'lead':
    case 'body':
    case 'small':
      return 'p';
    case 'label':
      return 'label';
    case 'caption':
      return 'span';
    default:
      return 'p';
  }
}

// Convenience components for common typography variants
export function Display({ children, className, as }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="display" className={className} as={as}>
      {children}
    </Typography>
  );
}

export function Heading1({ children, className, as }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="h1" className={className} as={as}>
      {children}
    </Typography>
  );
}

export function Heading2({ children, className, as }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="h2" className={className} as={as}>
      {children}
    </Typography>
  );
}

export function Heading3({ children, className, as }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="h3" className={className} as={as}>
      {children}
    </Typography>
  );
}

export function Lead({ children, className, as }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="lead" className={className} as={as}>
      {children}
    </Typography>
  );
}

export function Body({ children, className, as }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="body" className={className} as={as}>
      {children}
    </Typography>
  );
}

export function Small({ children, className, as }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="small" className={className} as={as}>
      {children}
    </Typography>
  );
}

export function Caption({ children, className, as }: Omit<TypographyProps, 'variant'>) {
  return (
    <Typography variant="caption" className={className} as={as}>
      {children}
    </Typography>
  );
}
