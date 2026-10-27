import express from 'express';
import { createServer as createHttpServer } from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Server-side Gemini API Route
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { messages, userRole, memberName } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      const systemInstruction = `You are the TM3 Martial Arts Academy & TM Sports AI Coach, an expert martial arts, group workout, dancing class, and membership advisor (Discipline & Determination — Est. 2000).
Club Information (https://tm3gym.com):
- Taekwondo: Led by Master Mulatu Biru (Est. 2000). Traditional martial arts training with structured belt progression, discipline, and technique for all ages. Classes run Tue, Wed, Thu, Fri at 5:15 PM and Sat at 10:00 AM.
- Group Workout Sessions:
  • Early Morning (Mon / Wed / Fri): 6:00 AM – 7:00 AM
  • Late Morning (Mon – Fri): 9:00 AM – 10:00 AM
  • Evening (Mon – Fri): 6:30 PM – 7:00 PM
- Dancing Class Schedule & Cultural Dance (Led by Instructor Derege):
  • Choose your 3-day track: Mon / Wed / Fri OR Tue / Thu / Sat
  • Morning: 10:30 AM – 11:30 AM
  • Afternoon: 4:00 PM – 5:00 PM
  • Evening: 7:30 PM – 8:30 PM
- Olympic WT Sparring Rules: 1 pt for punch to trunk, 2 pts for kick to trunk protector, 3 pts for high kick to helmet, 4-5 pts for spinning/turning kicks to head.
- Membership Dues: Monthly $80, Quarterly $220, Annual $800. Existing members can claim their profile online using their 4-digit Member PIN.
- Pro Shop: Uniforms (sizes XS–XXL), sparring gear sets, and TM3 branded apparel available at the front desk. Contact: tm3martialartsacademy@gmail.com.
- Active User Context: Role: ${userRole || 'visitor'}, Member: ${memberName || 'Guest'}.

Tone: Encouraging, energetic, disciplined, athletic, and concise. Format with bullet points for readability.`;

      if (!apiKey) {
        const lastUserMsg = messages[messages.length - 1]?.content || '';
        let fallbackReply = `Welcome to TM3 Martial Arts Academy & TM Sports! I'm your AI Coach.\n\n`;
        const lower = lastUserMsg.toLowerCase();
        if (lower.includes('sparring') || lower.includes('taekwondo') || lower.includes('point') || lower.includes('rule')) {
          fallbackReply += `At TM3 Martial Arts Academy (Est. 2000), Taekwondo is led by **Master Mulatu Biru** (Tue–Fri 5:15 PM & Sat 10:00 AM). In Olympic WT sparring:\n• **1 pt**: Punch to trunk protector\n• **2 pts**: Turning or roundhouse kick to chest sensor\n• **3 pts**: High kick to headgear\n• **4-5 pts**: Spinning hook or turning kick to head`;
        } else if (lower.includes('dance') || lower.includes('dancing') || lower.includes('derege')) {
          fallbackReply += `Our **Dancing Class Schedule** with Instructor **Derege** runs on two flexible tracks (**Mon / Wed / Fri** OR **Tue / Thu / Sat**):\n• **Morning**: 10:30 AM – 11:30 AM\n• **Afternoon**: 4:00 PM – 5:00 PM\n• **Evening**: 7:30 PM – 8:30 PM`;
        } else if (lower.includes('schedule') || lower.includes('class') || lower.includes('time') || lower.includes('workout')) {
          fallbackReply += `Here is our weekly schedule at **TM3 Martial Arts Academy**:\n• **Group Workout Sessions**: Early Morning (Mon/Wed/Fri 6:00–7:00 AM), Late Morning (Mon–Fri 9:00–10:00 AM), Evening (Mon–Fri 6:30–7:00 PM)\n• **Dancing Classes (Instructor Derege)**: Mon/Wed/Fri OR Tue/Thu/Sat at 10:30–11:30 AM, 4:00–5:00 PM, and 7:30–8:30 PM\n• **Taekwondo (Master Mulatu Biru)**: Tue, Wed, Thu, Fri at 5:15 PM & Sat at 10:00 AM`;
        } else {
          fallbackReply += `How can I help you today? Ask me about our **Group Workout Sessions** (6 AM, 9 AM, 6:30 PM), **Dancing Class Schedule** (Mon/Wed/Fri or Tue/Thu/Sat), **Taekwondo with Master Mulatu Biru**, or our **$80/mo Membership Plans**!`;
        }
        return res.json({ reply: fallbackReply });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Format multi-turn conversation contents
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "I'm ready to help with your training and schedule!";
      return res.json({ reply });
    } catch (err: any) {
      console.error('Server Gemini Error:', err);
      return res.status(500).json({
        error: err.message || 'Gemini generation error',
        reply: "I'm currently unable to reach the AI Coach cloud service. In the meantime, you can review our full schedule and register for events directly in the Calendar!"
      });
    }
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`TM Sports dev server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
