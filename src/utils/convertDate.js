export default function convertDate(inputFormat) {
  const pad = (s) => (s < 10 ? "0" + s : s);
  var d = new Date(inputFormat);
  return (
    pad(d.getMonth() + 1) +
    "/" +
    pad(d.getDate()) +
    "/" +
    d.getFullYear() +
    " " +
    (((d.getHours() + 11) % 12) + 1) +
    ":" +
    pad(d.getMinutes()) +
    (d.getHours() >= 12 ? "PM" : "AM")
  );
}
