import dotenv from "dotenv";
dotenv.config();

const NEXT_BASE_URL = process.env.NEXT_BASE_URL;

export async function authMiddleware(req, res, next) {
  try {
    // Forward cookies from incoming request
    const sessionRes = await fetch(`${NEXT_BASE_URL}/api/auth/session`, {
      method: "GET",
      headers: {
        cookie: req.headers.cookie || "",
        authorization: req.headers.authorization || "",
      },
      credentials: "include",
    });

    if (sessionRes.status === 401) {
      return res.status(401).json({ message: "Invalid Session" });
    }

    const data = await sessionRes.json();

    req.user = {
      userId: data.user.id,
      role: data.user?.role?.name,
      name: data.user.name,
      email: data.user.email,
    };
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}
