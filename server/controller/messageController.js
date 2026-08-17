import fs from "fs";
import imageKit from "../configs/imagekit.js";
import Message from "../models/Message.js";

// Store SSE connections
const connections = {};

// ===============================
// SSE Controller
// ===============================
export const sseController = (req, res) => {
    const { userId } = req.params;

    console.log("New Client connected:", userId);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    connections[userId] = res;

    // Initial connection message
    res.write(": Connected to SSE stream\n\n");

    req.on("close", () => {
        delete connections[userId];
        console.log("Client disconnected:", userId);
    });
};


// ===============================
// Send Message
// ===============================
export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id, text } = req.body;
        const image = req.file;

        let media_url = "";
        let message_type = image ? "image" : "text";

        // Upload image
        if (message_type === "image") {
            const fileBuffer = fs.readFileSync(image.path);

            const response = await imageKit.upload({
                file: fileBuffer,
                fileName: image.originalname,
            });

            media_url = imageKit.url({
                path: response.filePath,
                transformation: [
                    {
                        quality: "auto",
                    },
                    {
                        format: "webp",
                    },
                    {
                        width: "1280",
                    },
                ],
            });
        }

        // Create message
        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type,
            media_url,
        });

        // Get populated message
        const messageWithUserData = await Message.findById(message._id)
            .populate("from_user_id")
            .populate("to_user_id");

        // Send response to sender
        res.json({
            success: true,
            message: messageWithUserData,
        });

        // Send real-time message to receiver
        if (connections[to_user_id]) {
            connections[to_user_id].write(
                `data: ${JSON.stringify(messageWithUserData)}\n\n`
            );
        }

    } catch (error) {
        console.log("SEND MESSAGE ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ===============================
// Get Chat Messages
// ===============================
export const getChatMessage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id } = req.body;

        console.log("GET CHAT USER:", userId);
        console.log("CHAT WITH:", to_user_id);

        const messages = await Message.find({
            $or: [
                {
                    from_user_id: userId,
                    to_user_id: to_user_id,
                },
                {
                    from_user_id: to_user_id,
                    to_user_id: userId,
                },
            ],
        })
            .populate("from_user_id")
            .populate("to_user_id")
            .sort({ created_at: -1 });

        // Mark received messages as seen
        await Message.updateMany(
            {
                from_user_id: to_user_id,
                to_user_id: userId,
            },
            {
                seen: true,
            }
        );

        res.json({
            success: true,
            messages,
        });

    } catch (error) {
        console.log("GET CHAT ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ===============================
// Get Recent Messages
// ===============================
export const getUserRecentMessages = async (req, res) => {
    try {
        const { userId } = req.auth();

        const messages = await Message.find({
            to_user_id: userId,
        })
            .populate("from_user_id")
            .populate("to_user_id")
            .sort({ created_at: -1 });

        res.json({
            success: true,
            messages,
        });

    } catch (error) {
        console.log("GET RECENT MESSAGES ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};