require("dotenv").config();
const express = require("express");
const OpenAI = require("openai").default;

const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/chat", (req, res) => res.sendFile(path.join(__dirname, "public", "chat.html")));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !messages.length) return res.status(400).json({ error: "messages is required" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "당신은 친절한 AI 어시스턴트입니다. 이전 대화 내용을 기억하며 자연스럽게 대화를 이어가세요." },
        ...messages,
      ],
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI API 호출 실패" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
  const open = require("child_process").exec;
  const url = `http://localhost:${PORT}`;
  if (process.platform === "win32") open(`cmd /c start ${url}`);
  else if (process.platform === "darwin") open(`open ${url}`);
  else open(`xdg-open ${url}`);
});
