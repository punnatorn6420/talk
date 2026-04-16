export type DateTimeFormatMode = 'full' | 'date' | 'time';

export interface DateTimeFormatOptions {
  mode?: DateTimeFormatMode;
  locale?: string;
  timeZone?: string;
  emptyText?: string;
}

export function formatDateTime(
  value?: string | Date | null,
  options: DateTimeFormatOptions = {},
): string {
  const {
    mode = 'full',
    locale = 'en-GB',
    timeZone = 'Asia/Bangkok',
    emptyText = '-',
  } = options;

  if (!value) return emptyText;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return emptyText;

  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: mode === 'date' ? undefined : '2-digit',
    minute: mode === 'date' ? undefined : '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '';

  if (mode === 'date') {
    return `${get('day')} ${get('month')} ${get('year')}`;
  }

  if (mode === 'time') {
    return `${get('hour')}:${get('minute')}`;
  }

  return `${get('day')} ${get('month')} ${get('year')} ${get('hour')}:${get('minute')}`;
}
