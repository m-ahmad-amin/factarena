const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://localhost:3001",
];

if (process.env.FRONTEND_URL) {
  const cleanFrontendUrl = process.env.FRONTEND_URL.replace(/\/$/, "");
  allowedOrigins.push(cleanFrontendUrl);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(
        origin,
      );

      if (
        !process.env.FRONTEND_URL ||
        process.env.FRONTEND_URL === "*" ||
        isLocalhost ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      const msg = `The CORS policy for this site does not allow access from origin: ${origin}.`;
      return callback(new Error(msg), false);
    },
  }),
);

const API_KEY = process.env.GROQ_API_KEY;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", hasKey: !!API_KEY });
});

app.post("/api/evaluate", async (req, res) => {
  const { topic, players, transcript } = req.body;

  if (!API_KEY) {
    return res
      .status(500)
      .json({ error: "Server is missing GROQ_API_KEY environment variable." });
  }

  if (!transcript || transcript.length === 0) {
    return res
      .status(400)
      .json({ error: "Transcript is empty. Please submit arguments." });
  }

  const transcriptText = transcript
    .map((arg, idx) => {
      const playerLabel = arg.player === "playerA" ? "Player A" : "Player B";
      return `${idx + 1}. ${arg.playerName} (${playerLabel}): "${arg.text}" [Time spent: ${arg.timeSpent}s]`;
    })
    .join("\n\n");

  const systemPrompt = `You are an impartial, highly analytical, and strict debate judge. Your task is to evaluate a transcript of a debate between two players on a specific topic.

You must rate both players on four criteria (0-100 score):
1. Relevance: How well did they address the topic and stay on point. 
   * CRITICAL PENALTY RULE: If a player submits off-topic arguments, talks about irrelevant subjects, uses distracting nonsense, or tries to evade the topic, you MUST penalize their Relevance score severely (e.g., immediately drop it below 30). Irrelevant chatter must heavily drag down their overall score, no matter how grammatically correct or persuasive it sounds.
2. Logic: Structure, logical validity, and reasoning strength of arguments.
3. Persuasiveness: Strength of vocabulary, rhetoric, tone, and delivery.
4. Counterarguments: Effectiveness of addressing points made by their opponent.

CRITICAL INSTRUCTIONS FOR GRADING VARIANCE:
- BE HIGHLY DISCERNING AND CRITICAL. Do not hand out identical or high scores easily. Use the full 0-100 scale:
  * 90-100: Exceptional, brilliant reasoning, flawless counterarguments (rarely awarded).
  * 75-89: Strong, logical, convincing points.
  * 50-74: Mediocre, contains minor fallacies, weak phrasing, or loose connection to points.
  * Below 50: Incoherent, off-topic, or completely empty/meaningless arguments.
- AVOID DECLARING A TIE. You must choose a winner ('playerA' or 'playerB') even if the margin of victory is extremely thin (e.g. one player scored 0.5 points higher overall). Only declare 'tie' in absolute, rare stalemates where both players performed identically.
- Ensure the metrics reflect the actual difference in quality between the players' statements. Avoid rounding or flattening scores to the same values.

Calculate the 'overall' score as the arithmetic mean of the four criteria (relevance + logic + persuasiveness + counterarguments) / 4.
Determine the winner ('playerA', 'playerB', or 'tie').
Provide constructive feedback detailing strengths and weaknesses for each player, and write a summary verdict.

Your response MUST be a valid JSON object matching this exact schema:
{
  "winner": "playerA" | "playerB" | "tie",
  "scores": {
    "playerA": { "relevance": number, "logic": number, "persuasiveness": number, "counterarguments": number, "overall": number },
    "playerB": { "relevance": number, "logic": number, "persuasiveness": number, "counterarguments": number, "overall": number }
  },
  "verdict": "string",
  "feedback": {
    "playerA": { "strengths": ["string"], "weaknesses": ["string"] },
    "playerB": { "strengths": ["string"], "weaknesses": ["string"] }
  }
}
Do not output any introductory or concluding text outside of this JSON block. Make sure the JSON is properly formatted and does not contain syntax errors.`;

  const userPrompt = `Topic: "${topic}"
Player A: "${players.playerA}"
Player B: "${players.playerB}"

Transcript of the debate:
${transcriptText}`;

  const callGroq = async (modelName) => {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.4,
          max_tokens: 1500,
        }),
      },
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || `HTTP ${response.status}`;
      throw new Error(errMsg);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from AI judge.");
    }

    return JSON.parse(content);
  };

  try {
    const parsed = await callGroq("llama-3.3-70b-versatile");

    if (
      Math.abs(parsed.scores.playerA.overall - parsed.scores.playerB.overall) <
      0.01
    ) {
      parsed.winner = "tie";
    }

    res.json(parsed);
  } catch (error) {
    console.warn(
      "Llama 3.3 70B evaluation failed, falling back to Llama 3.1 8B...",
      error.message,
    );
    try {
      const parsed = await callGroq("llama-3.1-8b-instant");

      if (
        Math.abs(
          parsed.scores.playerA.overall - parsed.scores.playerB.overall,
        ) < 0.01
      ) {
        parsed.winner = "tie";
      }

      res.json(parsed);
    } catch (fallbackError) {
      console.error("All Groq models failed:", fallbackError);
      res.status(500).json({
        error: `AI Judge Error: ${fallbackError.message || fallbackError}`,
      });
    }
  }
});

app.post("/api/niche-topic", async (req, res) => {
  const { customTopic } = req.body;

  if (!customTopic || !customTopic.trim()) {
    return res.status(400).json({ error: "Missing customTopic parameter." });
  }

  if (!API_KEY) {
    return res.json({ topic: customTopic.trim() });
  }

  const systemPrompt = `You are a creative debate prompt architect. 
Your task is to take a raw, generic topic submitted by a user and transform it into a highly specific, creative, fun, and easy-to-understand debate prompt.
Avoid overly academic, dry, scientific, or highly technical terms. Make it engaging, relatable, and fun for everyday players.
Format it as a single clear thesis statement.
Respond ONLY with the single debate prompt string. Do not include quotes, introductory remarks, or explanations. Keep it under 20 words.`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Transform this raw topic into a niche debate statement: "${customTopic}"`,
            },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsedTopic = content
      ? content.trim().replace(/^"|"$/g, "")
      : customTopic.trim();
    res.json({ topic: parsedTopic });
  } catch (err) {
    console.error("Failed to generate niche topic:", err);
    res.json({ topic: customTopic.trim() });
  }
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend proxy server listening on port ${PORT}`);
});
