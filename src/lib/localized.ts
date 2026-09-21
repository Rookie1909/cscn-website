// Picks the localized variant of a field (e.g. description_fi) for the
// current language, falling back to the German base field when missing.
export function localized<T, K extends keyof T & string>(
  item: T,
  field: K,
  lang: string
): T[K] {
  if (lang === 'de') return item[field];
  const key = `${field}_${lang}` as keyof T;
  return (item[key] as T[K] | undefined) ?? item[field];
}
