import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./server/db";

dotenv.config();

function getEpicLevel(xp: number) {
  if (xp < 100) return 'Bronze V';
  if (xp < 250) return 'Bronze IV';
  if (xp < 500) return 'Bronze I';
  if (xp < 800) return 'Silver V';
  if (xp < 1200) return 'Silver I';
  if (xp < 1800) return 'Gold V';
  if (xp < 2500) return 'Gold I';
  if (xp < 3500) return 'Platinum V';
  if (xp < 4800) return 'Platinum I';
  if (xp < 6200) return 'Diamond V';
  if (xp < 7800) return 'Diamond I';
  if (xp < 9500) return 'Crown';
  if (xp < 12000) return 'Ace';
  return 'Conqueror';
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API routes FIRST
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      const apiKey = process.env.GROQ_API_KEY;
      
      if (!apiKey) {
        res.status(500).json({ error: "GROQ_API_KEY is not set in environment variables. Please create a .env file in the root directory and add GROQ_API_KEY=your_key" });
        return;
      }

      const groq = new Groq({ apiKey });

      const response = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content
        })),
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
      res.json({ text });
    } catch (error: any) {
      console.error(error);
      let errorMessage = error.message || "Failed to generate response";
      res.status(500).json({ error: errorMessage });
    }
  });

  const JWT_SECRET = process.env.JWT_SECRET || "super-secret-alvio-key";

  // --- Auth Routes ---
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hash = await bcrypt.hash(password, 10);
      const insert = db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
      const result = insert.run(name, email, hash);

      const user = { id: result.lastInsertRowid, name, email, xp: 0, level: "Apprentice" };
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
      
      // Add a welcome activity
      db.prepare("INSERT INTO user_activity (user_id, activity_type, points) VALUES (?, ?, ?)").run(user.id, "Joined Alvio", 100);

      res.json({ user, token });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const userData = { id: user.id, name: user.name, email: user.email, xp: user.xp, level: user.level };
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.json({ user: userData, token });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to log in" });
    }
  });

  // --- Dashboard Route ---
  app.get("/api/dashboard", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(decoded.id) as any;
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const activity = db.prepare("SELECT * FROM user_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 10").all(decoded.id);
      
      const allDates = db.prepare("SELECT DISTINCT date(created_at) as d FROM user_activity WHERE user_id = ? ORDER BY d DESC").all(decoded.id) as {d: string}[];
      let dayStreak = 0;
      const today = new Date();
      let currentDate = new Date(today);
      let foundTodayOrYesterday = false;
      
      if (allDates.length > 0) {
        const firstDate = new Date(allDates[0].d);
        const timeDiff = Math.abs(today.getTime() - firstDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        if (diffDays <= 2) {
            foundTodayOrYesterday = true;
            currentDate = firstDate;
        }
      }
      
      if (foundTodayOrYesterday) {
        let i = 0;
        while(i < allDates.length) {
            const checkDate = new Date(currentDate);
            checkDate.setDate(currentDate.getDate() - dayStreak);
            const checkDateString = checkDate.toISOString().split('T')[0];
            if (allDates[i].d === checkDateString) {
                dayStreak++;
                i++;
            } else {
                break;
            }
        }
      }

      const timeSpentMins = allDates.length * 45 + activity.length * 10;
      
      const realLevel = getEpicLevel(user.xp);

      const onlineUsers = 1200 + Math.floor(Math.random() * 50);

      const completedCountQuery = db.prepare("SELECT COUNT(*) as c FROM course_progress WHERE user_id = ?").get(decoded.id) as {c: number};
      const topicsCompleted = (completedCountQuery ? completedCountQuery.c : 0);

      res.json({
        user: { id: user.id, name: user.name, xp: user.xp, level: realLevel },
        stats: {
          topicsCompleted: topicsCompleted,
          totalTopics: Math.max(8, topicsCompleted + 7),
          timeSpentMins: timeSpentMins,
          dayStreak: dayStreak,
          daysActive: allDates.length,
          onlineUsers
        },
        activity,
        allDates: allDates.map(d => d.d),
      });
    } catch (error: any) {
      console.error("Dashboard error:", error);
      res.status(401).json({ error: "Invalid or expired token" });
    }
  });




  // --- Activity Routes ---
  app.post("/api/activity", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      const { activity_type, points } = req.body;
      
      db.prepare("INSERT INTO user_activity (user_id, activity_type, points) VALUES (?, ?, ?)").run(decoded.id, activity_type, points || 0);
      
      // Upsert into course_progress
      const existing = db.prepare("SELECT id FROM course_progress WHERE user_id = ? AND course_name = ?").get(decoded.id, activity_type);
      if (!existing) {
        db.prepare("INSERT INTO course_progress (user_id, course_name, progress) VALUES (?, ?, ?)").run(decoded.id, activity_type, 100);
      } else {
        db.prepare("UPDATE course_progress SET progress = 100, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run((existing as any).id);
      }
      
      if (points > 0) {
        db.prepare("UPDATE users SET xp = xp + ? WHERE id = ?").run(points, decoded.id);
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // --- Leaderboard Routes ---
  app.get("/api/leaderboard", (req, res) => {
    try {
      const topUsers = db.prepare("SELECT name, xp FROM users ORDER BY xp DESC LIMIT 5").all();
      res.json(topUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // --- Profile Routes ---
  app.get("/api/profile", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(decoded.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const activity = db.prepare("SELECT * FROM user_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 50").all(decoded.id);
      const courses = db.prepare("SELECT * FROM course_progress WHERE user_id = ? ORDER BY updated_at DESC").all(decoded.id);
      
      res.json({ user, activity, courses });
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.post("/api/profile/update", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const { location, university, github, linkedin, avatar_url } = req.body;
      
      db.prepare("UPDATE users SET location = ?, university = ?, github = ?, linkedin = ?, avatar_url = ? WHERE id = ?")
        .run(location, university, github, linkedin, avatar_url, decoded.id);
        
      res.json({ success: true });
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  // Vite middleware for development


  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("/*splat", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
