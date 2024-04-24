const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

// define a secret key for JWT
const secretKey = "user-secret-key";

// create an example user
const user = {
  id: 1,
  username: "User",
  password: "password"
};

// middleware for JWT authentication
const authenticateJWT = (req, res, next) =>
{
  const token = req.header("x-auth-token");

  if (!token)
  {
    return res.status(401).json({ message: "Authentication failed" });
  }

  try
  {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } 
  catch (error)
  {
    res.status(400).json({ message: "Invalid token" });
  }
};

// example protected route
app.get("/protected", authenticateJWT, (req, res) =>
{
  res.json({ message: "Protected route accessed successfully" });
});

// login user
app.post("/login", (req, res) =>
{
  const { username, password } = req.body;

  // check data
  if (username === user.username && password === user.password)
  {
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
    res.json({ username, token });
  }
  else
  {
    res.status(401).json({ message: "Login failed" });
  }
});

app.listen(3000);
