export async function GET(request: Request) {
  const target = new URL(process.env["AWS_PLACES_API"] || "");

  const QueryText = await request.text();

  return fetch(target, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: JSON.stringify({
      QueryText,
    }),
  });
}
