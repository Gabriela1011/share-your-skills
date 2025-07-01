import { differenceInHours, parseISO } from "date-fns";

export function isLessThan48HoursAway(sessionDate: string, startHour: string): boolean {
  const sessionDateTimeStr = `${sessionDate}T${startHour}`;
  const sessionDateTime = parseISO(sessionDateTimeStr);

  const now = new Date();
  const diff = differenceInHours(sessionDateTime, now);

  return diff < 48;
}
