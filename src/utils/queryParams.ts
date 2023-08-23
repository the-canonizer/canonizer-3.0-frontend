export default function queryParams(body:any) {
  return (
    "?" +
    Object.keys(body)
      .map((key) => key + "=" + body[key])
      .join("&")
  );
}
