import {
  addDays,
  addHours,
  addMinutes,
  addSeconds,
  addWeeks,
  startOfToday,
  format,
} from "date-fns";
import { title } from "process";

const buildAvailabilityDates = (
  openDays: number,
  blockedRanges: Array<{ startOffset: number; endOffset: number }>,
) => {
  const today = startOfToday();
  const blocked = new Set<string>();

  for (const range of blockedRanges) {
    for (
      let offset = range.startOffset;
      offset <= range.endOffset;
      offset += 1
    ) {
      blocked.add(format(addDays(today, offset), "yyyy-MM-dd"));
    }
  }

  return Array.from({ length: openDays }, (_, index) =>
    format(addDays(today, index), "yyyy-MM-dd"),
  ).filter((date) => !blocked.has(date));
};
