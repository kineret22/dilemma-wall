import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("dilemma-answers");

  if (req.method === "GET") {
    try {
      const data = await store.get("answers", { type: "json" });
      return Response.json(data || []);
    } catch {
      return Response.json([]);
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { text } = body;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return Response.json({ error: "תשובה ריקה" }, { status: 400 });
      }

      if (text.trim().length > 500) {
        return Response.json({ error: "התשובה ארוכה מדי" }, { status: 400 });
      }

      let answers = [];
      try {
        answers = (await store.get("answers", { type: "json" })) || [];
      } catch {}

      const newAnswer = {
        id: Date.now().toString(),
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };

      answers.push(newAnswer);
      await store.set("answers", JSON.stringify(answers));

      return Response.json({ success: true, id: newAnswer.id });
    } catch (err) {
      return Response.json({ error: "שגיאה בשמירה" }, { status: 500 });
    }
  }

  if (req.method === "DELETE") {
    try {
      await store.set("answers", JSON.stringify([]));
      return Response.json({ success: true });
    } catch {
      return Response.json({ error: "שגיאה במחיקה" }, { status: 500 });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = {
  path: "/api/answers",
};
