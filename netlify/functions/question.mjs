import { getStore } from "@netlify/blobs";

const DEFAULT_QUESTIONS = [
  "כשאתה/את נאלצ/ת לבחור בין נאמנות לצוות שלך לבין ציות להנחיות ההנהלה — מה אתה/את עושה?",
  "מה עושים כשעובד מוכשר מפר שוב ושוב נורמות צוות?",
  "כיצד מתמודדים עם לחץ מלמעלה שסותר את הערכים שלך?"
];

export default async (req, context) => {
  const store = getStore("dilemma-answers");

  // GET — return full state: questions list + current index
  if (req.method === "GET") {
    try {
      const raw = await store.get("questions-state", { type: "json" });
      if (raw) return Response.json(raw);
      // first time: return defaults
      const state = { questions: DEFAULT_QUESTIONS, currentIndex: 0 };
      return Response.json(state);
    } catch {
      return Response.json({ questions: DEFAULT_QUESTIONS, currentIndex: 0 });
    }
  }

  // POST — update state (questions list and/or currentIndex)
  if (req.method === "POST") {
    try {
      const body = await req.json();

      // load existing state
      let state = { questions: DEFAULT_QUESTIONS, currentIndex: 0 };
      try {
        const raw = await store.get("questions-state", { type: "json" });
        if (raw) state = raw;
      } catch {}

      // update questions list if provided
      if (body.questions !== undefined) {
        if (!Array.isArray(body.questions) || body.questions.length === 0) {
          return Response.json({ error: "רשימת שאלות לא תקינה" }, { status: 400 });
        }
        state.questions = body.questions.map(q => q.trim()).filter(Boolean);
        // clamp index
        if (state.currentIndex >= state.questions.length) {
          state.currentIndex = state.questions.length - 1;
        }
      }

      // update currentIndex if provided
      if (body.currentIndex !== undefined) {
        const idx = parseInt(body.currentIndex, 10);
        if (isNaN(idx) || idx < 0 || idx >= state.questions.length) {
          return Response.json({ error: "אינדקס לא תקין" }, { status: 400 });
        }
        state.currentIndex = idx;
      }

      await store.set("questions-state", JSON.stringify(state));
      return Response.json({ success: true, state });
    } catch (err) {
      return Response.json({ error: "שגיאה בשמירה" }, { status: 500 });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = {
  path: "/api/questions",
};
