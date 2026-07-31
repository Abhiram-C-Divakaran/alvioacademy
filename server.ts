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

      // Server-side system prompt — enforced regardless of what the frontend sends.
      // This ensures consistent, high-quality tutor behavior even if the client-side
      // SYSTEM_PROMPT is stripped or modified.
      const SERVER_SYSTEM_PROMPT = `You are Alvio — a brilliant, friendly, and patient Data Structures & Algorithms (DSA) tutor powered by Generative AI.
Your mission is to help students truly understand CS concepts through clear explanations, analogies, and interactive 3D visualizations.

PERSONALITY:
- Warm, encouraging, and engaging. Celebrate student progress.
- Use plain English first, then introduce technical terms with definitions.
- Always ask "Does that make sense?" or offer a follow-up question at the end.

CONTENT RULES:
1. Always use Markdown for formatting. Use headers, bullet points, and code blocks liberally.
2. When explaining an algorithm or data structure, ALWAYS provide a working code example.
3. Prefer JavaScript or Python examples. Match the language the user prefers if they mention one.
4. NEVER give vague answers. Be concrete, precise, and thorough.

VISUALIZATION RULES (CRITICAL):
Whenever you explain a data structure or algorithm execution, you MUST include an interactive animated 3D visualization using this exact format:

\`\`\`animated-3d
{
  "type": "array" | "graph" | "binary-tree" | "linked-list",
  "code": "<optional: the solution code as a string>",
  "steps": [
    {
      "values": [<numbers or strings for arrays/linked-lists>],
      "highlight": [<indices or node IDs to highlight>],
      "activeLine": <1-indexed line number in code>,
      "description": "<one sentence describing this step>"
    }
  ]
}
\`\`\`

For GRAPH type, each step uses:
{ "nodes": ["A","B","C"], "edges": [["A","B"]], "highlight": ["A"], "description": "..." }

For BINARY-TREE type, each step uses:
{ "values": [50, 30, 70, 20, 40], "highlight": [0], "description": "..." }

IMPORTANT:
- Include at least 4 steps per visualization (more is better).
- "highlight" must use the SAME values as the actual data, not made-up ones.
- Steps must progress logically (e.g., a sort must actually sort).
- ONLY include ONE animated-3d block per response. Place it after the explanation.`;

      // Merge: always use server system prompt as the first message.
      // Filter out any system messages the client sent (they may be outdated),
      // then prepend the server-authoritative one.
      const userMessages = messages.filter((m: any) => m.role !== 'system');

      // Use streaming so the response feels fast and live
      const stream = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SERVER_SYSTEM_PROMPT },
          ...userMessages.map((m: any) => ({ role: m.role, content: m.content }))
        ],
        temperature: 0.7,
        max_tokens: 4096,
        stream: true,
      });

      // Stream the response back as Server-Sent Events
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let fullText = "";
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        if (delta) {
          fullText += delta;
          res.write(`data: ${JSON.stringify({ delta })}\n\n`);
        }
      }
      res.write(`data: ${JSON.stringify({ done: true, text: fullText })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error(error);
      let errorMessage = error.message || "Failed to generate response";
      res.status(500).json({ error: errorMessage });
    }
  });



  app.post("/api/generate-trace", async (req, res) => {
    try {
      const { problem } = req.body;
      const apiKey = process.env.GROQ_API_KEY;

      if (!apiKey) {
        res.status(500).json({ error: "GROQ_API_KEY is not set in environment variables." });
        return;
      }

      const groq = new Groq({ apiKey });

      const systemPrompt = `You are a world-class algorithm visualizer engine and 3D Animation Director. Your role is to generate a step-by-step 3D video storyboard for any coding problem. You are powering a premium 3D educational platform.

RESPOND WITH ONLY VALID JSON. No markdown. No explanation. No backticks.

=== OUTPUT SCHEMA ===
{
  "language": "javascript",
  "dataStructureType": <one of: "array", "stack", "queue", "hashmap", "binary-tree", "graph">,
  "code": <full working JS solution as a string>,
  "trace": [ <array of step objects, minimum 8 steps> ]
}

Each step object must be:
{
  "step": <integer, 1-indexed>,
  "line": <integer: which line of your code is executing>,
  "description": <string: a short label for the UI>,
  "narration": <string: a conversational, teacher-like explanation to be spoken aloud via Text-to-Speech. Make it engaging!>,
  "cameraPosition": <array of 3 numbers [x, y, z]: focus the 3D camera. Default is [0, 1.5, 11]. Zoom in for emphasis (e.g. [0, 1, 6]) or move left/right (e.g. [-3, 1, 8])>,
  "dataState": <object: see rules below>
}

=== CRITICAL RULES FOR dataState ===

RULE 1 — ALWAYS show the COMPLETE input structure at EVERY step.
If the input is an array, every step must have "elements".
If it's a binary-tree or graph, provide the full state in "nodes" or "elements".

RULE 2 — "elements" (for arrays/queues/stacks/strings) MUST be an array of objects containing a unique string "id" and a "val". 
Example: "elements": [{"id": "e1", "val": 5}, {"id": "e2", "val": 3}]
You MUST keep the exact same "id" for an element as it moves around in the array across steps! This allows the frontend to animate its movement.

RULE 3 — "activeIndices" is an array of integer indices (for arrays) or IDs (for graphs/trees) that should be highlighted.

RULE 4 — For String parsing or Backtracking problems, map the string characters to the "elements" array, and use "pointers" (e.g., {"start": 0, "end": 2}) to show the boundaries of the segment currently being evaluated.

RULE 4 — "pointers" maps label strings to integer indices. Use for named pointers like left, right, i, j, slow, fast.

RULE 5 — For HASHMAP problems:
- Put hashmap state in "mapEntries": an array of {key, value} objects.

RULE 6 — For BINARY-TREE problems:
- "dataState" should ideally have "nodes": [{ "id": 1, "value": 50, "position": {"x": 0, "y": 3}, "left": 2, "right": 3 }, ...] (format matching BinaryTreeStructure). 
- If not full structure, at least provide "elements" as the BFS/level-order traversal. 
- "activeIndices" should contain the IDs or values of active nodes.

RULE 7 — For GRAPH problems:
- "dataState" can just provide "activeNodes", "visitedNodes", and "activeEdges" (e.g. [["A","B"]]). We use a default graph if no nodes are explicitly provided, but you can provide "queue" array for BFS.

RULE 8 — Step count: generate 8–30 steps. Skip trivial var declarations, BUT for sorting algorithms you MUST show EVERY single comparison and EVERY single swap step-by-step. Do not jump to the sorted array.

=== CODE FORMAT RULES ===
- Write clean, readable JavaScript.
- The "code" field must be a plain string with real newlines (not escaped \\n).
- Line numbers in "line" must exactly match the line number in the code string (1-indexed).

Now solve the problem the user provides, following ALL rules above precisely.`;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: problem }
        ],
        temperature: 0.1,
        max_tokens: 8000,
        response_format: { type: "json_object" }
      });

      const jsonStr = response.choices[0]?.message?.content || "{}";
      res.json(JSON.parse(jsonStr));
    } catch (error: any) {
      console.error("Generate trace error:", error);
      res.status(500).json({ error: error.message || "Failed to generate trace" });
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
  // Ensure table exists on hot-reload without full restart
  db.exec(`
    CREATE TABLE IF NOT EXISTS problems (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      topic TEXT,
      difficulty TEXT NOT NULL,
      description TEXT NOT NULL,
      examples TEXT NOT NULL,
      constraints TEXT NOT NULL,
      signature TEXT NOT NULL,
      starterCode TEXT NOT NULL,
      testCases TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_problem_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      problem_id TEXT NOT NULL,
      interaction_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(problem_id) REFERENCES problems(id),
      UNIQUE(user_id, problem_id, interaction_type)
    );

    CREATE TABLE IF NOT EXISTS problem_stats (
      problem_id TEXT PRIMARY KEY,
      accepted INTEGER DEFAULT 0,
      submissions INTEGER DEFAULT 0,
      FOREIGN KEY(problem_id) REFERENCES problems(id)
    );
  `);

  // Dummy stats seeding removed as per user request to only use real time data

  // --- Problems API Routes (Dedicated Backend) ---
  app.get("/api/problems", (req, res) => {
    try {
      // Return summary info along with accepted and submissions stats
      const problems = db.prepare(`
        SELECT p.id, p.title, p.topic, p.difficulty,
               COALESCE(s.accepted, 0) as accepted,
               COALESCE(s.submissions, 0) as submissions
        FROM problems p
        LEFT JOIN problem_stats s ON p.id = s.problem_id
        ORDER BY p.created_at ASC
      `).all() as any[];

      const cleanedProblems = problems.map(p => ({
        ...p,
        title: p.title.replace(/^Problem\s+\d+:\s*/i, '')
      }));
      res.json(cleanedProblems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/problems/:problemId", (req, res) => {
    try {
      const problem = db.prepare("SELECT * FROM problems WHERE id = ?").get(req.params.problemId) as any;
      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }
      
      // Clean title
      problem.title = problem.title.replace(/^Problem\s+\d+:\s*/i, '');
      
      // Parse the JSON fields back to objects for the frontend
      problem.examples = JSON.parse(problem.examples);
      problem.constraints = JSON.parse(problem.constraints);
      problem.signature = JSON.parse(problem.signature);
      problem.starterCode = JSON.parse(problem.starterCode);
      problem.testCases = JSON.parse(problem.testCases);

      // Fetch stats
      const stats = db.prepare("SELECT accepted, submissions FROM problem_stats WHERE problem_id = ?").get(req.params.problemId) as any;
      if (stats) {
        problem.stats = stats;
      } else {
        // Initialize real data starting at 0
        const initialStats = {
          accepted: 0,
          submissions: 0
        };
        db.prepare("INSERT INTO problem_stats (problem_id, accepted, submissions) VALUES (?, ?, ?)").run(req.params.problemId, initialStats.accepted, initialStats.submissions);
        problem.stats = initialStats;
      }
      
      res.json(problem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // --- Problem Interaction Routes ---
  app.post("/api/problems/:problemId/feedback", (req, res) => {
    try {
      const { problemId } = req.params;
      const { issues, additionalFeedback, rating } = req.body;
      
      const authHeader = req.headers.authorization;
      let userId = null;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (token) {
          try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
            userId = decoded.userId;
          } catch (e) {
            // Ignore invalid tokens for feedback, just insert without user_id
          }
        }
      }

      db.prepare("INSERT INTO problem_feedback (user_id, problem_id, issues, additional_feedback, rating) VALUES (?, ?, ?, ?, ?)").run(
        userId,
        problemId,
        JSON.stringify(issues || []),
        additionalFeedback || "",
        rating || null
      );

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app.get("/api/problems/:problemId/interaction", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const problemId = req.params.problemId;

      const interactions = db.prepare("SELECT interaction_type FROM user_problem_interactions WHERE user_id = ? AND problem_id = ?").all(decoded.id, problemId) as any[];
      
      const state = { liked: false, disliked: false, starred: false };
      interactions.forEach(i => {
        if (i.interaction_type === 'like') state.liked = true;
        if (i.interaction_type === 'dislike') state.disliked = true;
        if (i.interaction_type === 'star') state.starred = true;
      });
      
      // Also get total likes for the problem
      const totalLikesQuery = db.prepare("SELECT COUNT(*) as c FROM user_problem_interactions WHERE problem_id = ? AND interaction_type = 'like'").get(problemId) as {c: number};
      const totalLikes = totalLikesQuery ? totalLikesQuery.c : 0;

      res.json({ ...state, totalLikes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/problems/:problemId/submit", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const problemId = req.params.problemId;
      const { status, language, code, runtimeMs, memoryMb, passedTestcases, totalTestcases } = req.body;
      
      const stats = db.prepare("SELECT accepted, submissions FROM problem_stats WHERE problem_id = ?").get(problemId) as any;
      if (stats) {
        db.prepare("UPDATE problem_stats SET submissions = submissions + 1, accepted = accepted + ? WHERE problem_id = ?")
          .run(status === 'Passed' ? 1 : 0, problemId);
      } else {
        db.prepare("INSERT INTO problem_stats (problem_id, accepted, submissions) VALUES (?, ?, 1)")
          .run(problemId, status === 'Passed' ? 1 : 0);
      }

      db.prepare(`
        INSERT INTO user_submissions (user_id, problem_id, status, language, code, runtime_ms, memory_mb, passed_testcases, total_testcases)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        decoded.id, 
        problemId, 
        status || 'Unknown', 
        language || 'javascript', 
        code || '', 
        runtimeMs || 0, 
        memoryMb || 0, 
        passedTestcases || 0, 
        totalTestcases || 0
      );

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/problems/:problemId/submissions", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const problemId = req.params.problemId;

      const submission = db.prepare(`
        SELECT us.*, u.name as user_name 
        FROM user_submissions us 
        JOIN users u ON us.user_id = u.id 
        WHERE us.problem_id = ? AND us.user_id = ? 
        ORDER BY us.created_at DESC 
        LIMIT 1
      `).get(problemId, decoded.id);

      if (submission) {
        res.json({ submission });
      } else {
        res.json({ submission: null });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/problems/:problemId/interaction", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const problemId = req.params.problemId;
      const { type, action } = req.body; // type: 'like' | 'dislike' | 'star', action: 'add' | 'remove'

      if (action === 'add') {
        // If adding a like, remove dislike (and vice versa)
        if (type === 'like') {
          db.prepare("DELETE FROM user_problem_interactions WHERE user_id = ? AND problem_id = ? AND interaction_type = 'dislike'").run(decoded.id, problemId);
        } else if (type === 'dislike') {
          db.prepare("DELETE FROM user_problem_interactions WHERE user_id = ? AND problem_id = ? AND interaction_type = 'like'").run(decoded.id, problemId);
        }
        
        // Insert new interaction (ignore if exists due to unique constraint)
        db.prepare("INSERT OR IGNORE INTO user_problem_interactions (user_id, problem_id, interaction_type) VALUES (?, ?, ?)").run(decoded.id, problemId, type);
      } else if (action === 'remove') {
        db.prepare("DELETE FROM user_problem_interactions WHERE user_id = ? AND problem_id = ? AND interaction_type = ?").run(decoded.id, problemId, type);
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/profile/favourites", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      const favourites = db.prepare("SELECT problem_id, created_at FROM user_problem_interactions WHERE user_id = ? AND interaction_type = 'star' ORDER BY created_at DESC").all(decoded.id);
      res.json(favourites);
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
      const solvedProblems = db.prepare(`
        SELECT p.id, p.title, p.difficulty, MAX(us.created_at) as solved_at
        FROM user_submissions us
        JOIN problems p ON us.problem_id = p.id
        WHERE us.user_id = ? AND us.status = 'Passed'
        GROUP BY p.id, p.title, p.difficulty
        ORDER BY solved_at DESC
      `).all(decoded.id);
      
      res.json({ user, activity, courses, solvedProblems });
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
