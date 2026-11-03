export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { success: true, service: "beanance-frontend", status: "ok", timestamp: new Date().toISOString() },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
