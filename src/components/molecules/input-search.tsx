'use client';

import React, { useState } from 'react';
import { Input } from '../atoms/input';

interface Props {
  defaultValue?: string;
  placeholder?: string;
  onEnter: (v: string) => void;
}

const InputSearch = ({
  placeholder = 'Cari...',
  defaultValue,
  onEnter,
}: Props) => {
  const [value, setValue] = useState(defaultValue ?? '');

  return (
    <Input
      type="text"
      name="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key == 'Enter') {
          onEnter(value);
        }
      }}
    />
  );
};

export default InputSearch;
