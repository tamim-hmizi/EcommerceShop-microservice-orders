import jwt from "jsonwebtoken";

// Verifies the Bearer token issued by the auth service and exposes the user id.
export const protect = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: id, id };
    next();
  } catch {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
