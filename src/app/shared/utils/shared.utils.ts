export function when(date: Date): string {
  const date$ = unifyTime(new Date(date));
  const today = unifyTime(new Date());
  const yesterday = unifyTime(new Date(today));
  yesterday.setDate(yesterday.getDate() - 1);

  switch (date$.getTime()) {
    case today.getTime():
      return 'today';
    case yesterday.getTime():
      return 'yesterday';
  }
}

export function unifyTime(date: Date): Date {
  date = new Date(date);

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0, 0);

  return date;
}

export function insertIndex(
  chatItem: any,
  chatItems: any[],
  key: (o2: any, o1: any) => boolean,
  start: number = null,
  end: number = null
): number {
  start = start || 0;
  end = end || chatItems.length;

  if (chatItems.length) {
    if (key(chatItems[end - 1], chatItem)) return end;
    if (!key(chatItems[start], chatItem)) return start;
  } else {
    return start;
  }

  const pivot = Math.ceil(start + (end - start) / 2);

  if (Math.abs(end - start) <= 1 || chatItems[pivot] === chatItem) return pivot;

  if (key(chatItems[pivot], chatItem)) {
    return insertIndex(chatItem, chatItems, key, pivot, end);
  } else {
    return insertIndex(chatItem, chatItems, key, start, pivot);
  }
}
