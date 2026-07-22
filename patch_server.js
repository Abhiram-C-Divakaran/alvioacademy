const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf-8');

const profileRoutes = `
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
      
      const submissions = db.prepare("SELECT * FROM user_submissions WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20").all(decoded.id);
      
      res.json({ user, submissions });
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
      
      const { location, university, github, linkedin } = req.body;
      
      db.prepare("UPDATE users SET location = ?, university = ?, github = ?, linkedin = ? WHERE id = ?")
        .run(location, university, github, linkedin, decoded.id);
        
      res.json({ success: true });
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  // Vite middleware for development
`;

content = content.replace('  // Vite middleware for development', profileRoutes);

fs.writeFileSync('server.ts', content);
console.log("Server patched.");
