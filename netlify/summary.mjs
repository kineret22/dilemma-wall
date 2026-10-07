import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("dilemma-answers");

  if (req.method === "GET") {
    try {
      const d = await store.get("ai-summary", { type: "json" });
      return Response.json(d || {});
    } catch {
      return Response.json({});
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      await store.set("ai-summary", JSON.stringify(body.summary || {}));
      return Response.json({ success: true });
    } catch {
      return Response.json({ error: "שגיאה בשמירה" }, { status: 500 });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = {
  path: "/api/summary",
};
