import express from "express";
import dotenv from "dotenv";
import {
  getVideoInfo,
  getChannelInfo,
} from "./youtube.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3322;
const ADDRESS = process.env.ADDRESS || "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "development";

// Initialize Express app
const app = express();

// ==================== Routes ====================
/**
 * Get full channel information
 * GET /youtube/channel/:id
 */
app.get("/youtube/channel/:id", async (req, res) => {
  const channelID = req.params.id;

  try {
    const data = await getChannelInfo(channelID);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Channel not found or data unavailable",
      });
    }

    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`Error fetching channel info for "${channelID}":`, err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch channel info. Please check the channel ID and try again.",
    });
  }
});

/**
 * Get video information
 * GET /youtube/video/:id
 */
app.get("/youtube/video/:id", async (req, res) => {
  const videoID = req.params.id;

  try {
    const data = await getVideoInfo(videoID);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Video not found or data unavailable",
      });
    }

    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`Error fetching video info for "${videoID}":`, err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch video info. Please check the video ID and try again.",
    });
  }
});

// ==================== 404 Handler ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.path,
  });
});

// ==================== Start Server ====================

app.listen(PORT, ADDRESS, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                      YouTube API Server                    ║
╠════════════════════════════════════════════════════════════╣
║  🌐 Server: http://${ADDRESS}:${PORT}${" ".repeat(Math.max(0, 39 - ADDRESS.length - PORT.toString().length))}║
╚════════════════════════════════════════════════════════════╝
  `);
});