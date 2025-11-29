import { CheckIcon } from 'lucide-react';
import { ComponentProps, useMemo } from 'react';
import { Button } from './button';

interface CheckboxesProps<T> extends ComponentProps<'div'> {
  name: string;
  options: T[];
  keyValue: keyof T;
  keyLabel?: keyof T;
  values?: string[];
  onValuesChange?: (v: string[]) => void;
}

function Checkboxes<T>({
  name,
  options,
  keyValue,
  keyLabel,
  values,
  onValuesChange,
}: CheckboxesProps<T>) {
  const renderLabel = useMemo(() => {
    if (keyLabel) return (item: T) => String(item[keyLabel]);
    return () => '';
  }, [keyLabel]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((item, i) => {
        const v = String(item[keyValue]);
        const label = renderLabel(item);
        const id = `${name}-${v}`;
        return (
          <div key={i}>
            <input
              type="checkbox"
              value={v}
              id={id}
              className="hidden"
              name={name}
              onChange={(e) => {
                const copyValues = [...(values ?? [])];
                onValuesChange?.(
                  e.currentTarget.checked
                    ? [...copyValues, v]
                    : copyValues.filter((cv) => cv != v)
                );
              }}
            />
            <Button
              type="button"
              variant={values?.includes(v) ? 'default' : 'outline'}
              asChild
            >
              <label
                htmlFor={id}
                className={'btn btn-sm cursor-pointer rounded-full'}
                onKeyDown={(e) => {
                  if (
                    e.key === ' ' ||
                    e.key === 'Spacebar' ||
                    e.key === 'Enter'
                  ) {
                    e.preventDefault();
                    document.getElementById(id)?.click();
                  }
                }}
              >
                {values?.includes(v) && <CheckIcon size={18} />}
                {label}
              </label>
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export { Checkboxes };
