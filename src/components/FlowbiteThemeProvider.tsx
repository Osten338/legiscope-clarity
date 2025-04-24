
import { ReactNode } from 'react';
import { CustomFlowbiteTheme, ThemeModeScript } from 'flowbite-react';

// Custom Flowbite theme configuration
const flowbiteTheme: CustomFlowbiteTheme = {
  sidebar: {
    root: {
      base: "h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
      inner: "h-full overflow-y-auto overflow-x-hidden bg-white py-4 px-3 dark:bg-gray-800"
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
      active: "bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-500",
      icon: {
        base: "h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        active: "text-primary-600 dark:text-primary-500"
      }
    }
  },
  navbar: {
    base: "fixed z-30 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
  },
  dropdown: {
    floating: {
      base: "z-10 w-fit rounded-lg divide-y divide-gray-100 shadow bg-white dark:bg-gray-800 dark:divide-gray-700",
      content: "py-1 text-sm text-gray-700 dark:text-gray-300",
      target: "w-fit dark:text-white"
    },
    item: {
      base: "flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:text-white"
    }
  }
};

interface FlowbiteThemeProviderProps {
  children: ReactNode;
}

export const FlowbiteThemeProvider = ({ children }: FlowbiteThemeProviderProps) => {
  return (
    <>
      <ThemeModeScript />
      <div className="flowbite-theme" data-theme={flowbiteTheme}>
        {children}
      </div>
    </>
  );
};
