'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { Switch } from '../atoms/switch';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Switch
      label="Dark mode"
      checked={theme === 'dark'}
      onCheckedChange={(s) => setTheme(s ? 'dark' : 'light')}
    />
  );
};

export default ThemeToggle;
