require("dotenv").config();
const express = require("express");
const OpenAI = require("openai").default;

const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/chat", (req, res) => res.sendFile(path.join(__dirname, "public", "chat.html")));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !messages.length) return res.status(400).json({ error: "messages is required" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `당신은 SeSAC 코인 네트워크 플랫폼의 AI 어시스턴트 "새싹이"입니다.

## 사이트 소개
SeSAC(새싹)은 분산 네트워크 기반의 코인 포인트 적립 플랫폼입니다.
사용자가 유휴 인터넷 대역폭을 공유하면 SeSAC 포인트를 획득할 수 있습니다.

## 주요 기능
- **대시보드**: 총 수익, 오늘의 수익, 업타임 현황을 한눈에 확인
- **포인트 종류**: 네트워크 포인트, 업타임 포인트, 추천 업타임 포인트, 업타임 랭크, 추천 보너스
- **네트워크 연결**: 대시보드에서 "네트워크 연결하기" 버튼으로 SeSAC 네트워크에 참여
- **리워드**: 포인트를 모아 다양한 혜택으로 교환 (로그인 필요)
- **스토어**: SeSAC 포인트로 아이템 구매 (로그인 필요)
- **앱 다운로드**: Windows/Mac 데스크탑 앱 설치 시 업타임 포인트 2배
- **친구 초대**: 추천 링크 공유 시 두 사람 모두 보너스 포인트 지급

## 수익 늘리는 방법
1. 데스크탑 앱 설치 → 업타임 포인트 2배
2. 친구 초대 → 추천 보너스 지급
3. 매일 접속 → 데일리 보너스
4. 네트워크 안정적 유지 → 랭크 포인트 증가

## 시작 방법
1. 우상단 "회원가입" 버튼으로 계정 생성
2. 가입 즉시 10,000 SeSAC 포인트 지급
3. "네트워크 연결하기" 버튼 클릭
4. 포인트 자동 적립 시작

## 안내 원칙
- 항상 친근하고 밝게 답변하세요 (새싹이 캐릭터: 🌱)
- 모르는 내용은 솔직하게 모른다고 하세요
- 이전 대화 내용을 기억하며 자연스럽게 대화를 이어가세요` },
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
