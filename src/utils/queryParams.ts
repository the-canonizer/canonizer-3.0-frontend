export default function queryParams(body) {
  return (
    "?" +
    Object.keys(body)
      .map((key) => key + "=" + body[key])
      .join("&")
  );
}
