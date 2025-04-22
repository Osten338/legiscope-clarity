
import { toast } from "sonner";

// Try to import the package, but gracefully handle if it's not available
let reactElementToJSXString: any;
try {
  reactElementToJSXString = require("react-element-to-jsx-string").default;
} catch (error) {
  console.error("Error importing react-element-to-jsx-string:", error);
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success("Button code copied to clipboard!");
    })
    .catch((err) => {
      console.error("Error copying text to clipboard:", err);
      toast.error("Failed to copy to clipboard");
    });
};

export const getButtonString = (button: { code?: string; component: JSX.Element }) => {
  if (button.code) {
    return button.code;
  }
  
  try {
    if (reactElementToJSXString) {
      return reactElementToJSXString(button.component);
    } else {
      return "/* Unable to convert component to string. Please install react-element-to-jsx-string */";
    }
  } catch (err) {
    console.error("Error converting element to string:", err);
    return "/* Error converting component to string */";
  }
};
