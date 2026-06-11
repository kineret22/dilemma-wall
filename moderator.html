import { getStore } from "@netlify/blobs";

const DEFAULT_QUESTION =
  "כשאתה/את נאלצ/ת לבחור בין נאמנות לצוות שלך לבין ציות להנחיות ההנהלה — מה אתה/את עושה?";

export default async (req, context) => {
  const store = getStore("dilemma-answers");

  if (req.method === "GET") {
    try {
      const q = await store.get("question", { type: "text" });
      return Response.json({ question: q || DEFAULT_QUESTION });
    } catch {
      return Response.json({ question: DEFAULT_QUESTION });
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { question } = body;
      if (!question || typeof question !== "string" || question.trim().length === 0) {
        return Response.json({ error: "שאלה ריקה" }, { status: 400 });
      }
      await store.set("question", question.trim());
      // also clear answers when question changes
      await store.set("answers", JSON.stringify([]));
      return Response.json({ success: true });
    } catch {
      return Response.json({ error: "שגיאה בשמירה" }, { status: 500 });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = {
  path: "/api/question",
};
