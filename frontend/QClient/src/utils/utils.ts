export function formatDate(date: Date) {
  return (
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }) +
    " " +
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
}

export function formatPrice(price: number) {
  return price.toFixed(2) + " RON";
}
