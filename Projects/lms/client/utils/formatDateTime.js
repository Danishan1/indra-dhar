export function formatDateTime(isoString) {
  const date = new Date(isoString);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

export function timeAgo(isoString) {
  const date = new Date(isoString);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  const isFuture = seconds < 0;
  const absoluteSeconds = Math.abs(seconds);

  for (const interval of intervals) {
    const count = Math.floor(absoluteSeconds / interval.seconds);

    if (count > 0) {
      return isFuture
        ? `in ${count} ${interval.label}${count > 1 ? "s" : ""}`
        : `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
