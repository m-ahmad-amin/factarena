# 🏆 Fact Arena

A multiplayer debate software powered by AI. Two players share a single device, engage in timed debates, and receive objective scoring based on the strength of their reasoning.
**[▶ Live Demo](https://fact-arena.netlify.app)**    

![Fact Arena](https://res.cloudinary.com/dzzrxqiho/image/upload/v1781799298/Group_3_1_1_cnjdg0.png)

## ⚡ What is Fact Arena?

Fact Arena turns debates into a competitive game.

Two players sit on the same device, take turns entering arguments under a time limit, and at the end, arguments are evaluated and winner is decided.

Instead of just “who talks more,” the system focuses on **who argues better** with facts.

![Fact](https://res.cloudinary.com/dzzrxqiho/image/upload/v1781799274/Group_9_2_gxaoqc.png)

## 🎮 How It Works

1. Enter Player A and Player B names
2. Choose a debate topic
3. Start the timed debate
4. Players alternate adding arguments
5. Debate ends automatically after the timer
6. Full transcript is sent to impartial AI judge
7. Judge returns:
   - Winner
   - Individual scores
   - Detailed reasoning feedback

## 🧠 Impartial AI Judge System

The AI evaluates each player based on:

- Logical consistency
- Relevance to the topic
- Strength of arguments
- Persuasiveness
- Quality of counterpoints

It outputs a structured judgment including:

- Score for Player A
- Score for Player B
- Final winner
- Explanation of decision

## 🛠 Tech Stack

**Frontend**

- React (Vite)
- Tailwind CSS

**Backend**

- Node.js
- Express.js

**AI Engine**

- Groq API (LLM-based evaluation system)

**Deployment**

- Frontend: Netlify
- Backend: Render
