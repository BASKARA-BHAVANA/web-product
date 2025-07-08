'use client';

import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  LoaderIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-center"
      visibleToasts={4}
      toastOptions={{
        classNames: {
          content: '',
          toast: 'border-2 !shadow-lg',
          title: 'typo-small',
          description: 'typo-small text-muted-foreground',
          icon: '!me-3',
          loading: '!ps-6',
          actionButton:
            '!bg-primary !text-primary-foreground py-2 px-4 text-lg !font-semibold !hover:bg-primary/90',
        },
      }}
      icons={{
        success: <CircleCheckIcon className="text-green-500" />,
        error: <CircleAlertIcon className="text-destructive" />,
        warning: <TriangleAlertIcon className="text-yellow-500" />,
        info: <InfoIcon className="text-blue-500" />,
        loading: <LoaderIcon className="animate-spin" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
