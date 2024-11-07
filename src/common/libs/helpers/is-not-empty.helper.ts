export const isNotEmpty = (value: unknown): boolean => {
  if (value === null) {
    return false;
  }

  if (typeof value === 'object' && Array.isArray(value)) {
    return !!value.length;
  }

  if (typeof value === 'object') {
    return !!Object.keys(value).length;
  }

  if (typeof value === 'string') {
    return !!value.trim().length;
  }

  return true;
};
