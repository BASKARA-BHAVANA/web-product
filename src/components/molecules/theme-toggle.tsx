'use client';

import { useTheme } from 'next-themes';
import React from 'react';
import { Switch } from '../atoms/switch';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      label="Dark mode"
      checked={theme == 'dark'}
      onCheckedChange={(s) => setTheme(s ? 'dark' : 'light')}
    />
  );
};

export default ThemeToggle;
