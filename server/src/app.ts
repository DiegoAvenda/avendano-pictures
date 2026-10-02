import express, { Application, Request, Response, NextFunction } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import authRoutes from "./routes/auth.routes.js"
import videoRoutes from "./routes/video.routes.js"

const app: Application = express()

const clientOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_ORIGIN
    : "http://localhost:5177"

if (!clientOrigin) {
  throw new Error("CLIENT_ORIGIN must be configured in production")
}

// CORS – allow credentials from the configured client origin
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

// API base path
app.use("/api/auth", authRoutes)
app.use("/api/videos", videoRoutes)

// Global error formatter (ensures { success, message, data? })
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err)
  const status = err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || "Server error",
  })
})

export default app
