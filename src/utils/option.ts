export interface Option {
  value: string;
  label: string;
}

export const getOption = (list: Option[], value: string): Option | null => {
  return list.find((o) => o.value == value) ?? null;
};

export const getOptionsLabel = (
  list: Option[],
  value: string,
  { fallback = '' }: { fallback?: string } = {}
): string => {
  return list.find((o) => o.value == value)?.label ?? fallback;
};

export const getOptionLabel = (
  option: Option,
  { fallback = '' }: { fallback?: string } = {}
): string => {
  return option.label ?? fallback;
};
