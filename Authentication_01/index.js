const express = require("express");

const app = express();
const PORT = 8000;

app.use(express.json());

const DIARY = {};
const EMAILS = new Set();

//Write
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (EMAILS.has(email)) {
    return res.status(400).json({ error: "User email already taken" });
  }

  //create a toekn for user
  const token = `${Date.now()}`;

  DIARY[token] = { name, email, password };
  EMAILS.add(email);

  return res.json({ Status: "Success", token });
});

app.post("/me", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  if (!token in DIARY) {
    return res.status(400).json({ error: "Invalid Token" });
  }

  const entry = DIARY[token];

  return res.json({ data: entry });
});

app.post("/private-data", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  if (!token in DIARY) {
    return res.status(400).json({ error: "Invalid Token" });
  }

  const entry = DIARY[token];
  return res.json({ data: { privateData: "Access Granted" } });
});

app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
});
