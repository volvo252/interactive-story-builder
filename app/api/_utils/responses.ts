export function jsonError(message: string, status: number) {
  return Response.json(
    {
      error: {
        message,
      },
    },
    { status }
  );
}

export function jsonData<T>(data: T, status = 200) {
  return Response.json(
    {
      data,
    },
    { status }
  );
}