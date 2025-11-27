export const getInitials = (str?: string | null) => {
  return str
    ? str
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    : '-';
};

export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const isUUID = (value: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

export const isURL = (
  urlString: string,
  domain?: string | string[]
): boolean => {
  try {
    const url = new URL(urlString);
    if (!domain) return true;

    const hostname = url.hostname.toLowerCase();
    const domains = Array.isArray(domain)
      ? domain.map((d) => d.toLowerCase())
      : [domain.toLowerCase()];

    return domains.some((d) => hostname === d || hostname.endsWith(`.${d}`));
  } catch {
    return false;
  }
};
