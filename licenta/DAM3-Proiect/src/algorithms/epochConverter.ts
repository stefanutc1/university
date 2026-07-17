export function epochToDate(sec: number) { return new Date(sec * 1000).toISOString(); }
export function dateToEpoch(d: Date) { return Math.floor(d.getTime() / 1000); }
