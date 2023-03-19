import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Chatroom from "../models/Chatroom.js";

const router = express.Router();

// New Conversation
router.post("/", async (req, res) => {
    const newChatroom = new Chatroom({
        members: [req.body.userId, req.body.friendId],
    });

    try {
        const savedChatroom = await newChatroom.save();
        res.status(200).json(savedChatroom);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

// Get Conversation
router.get("/:userId/:friendId", async (req, res) => {
    try {
        const chatroom = await Chatroom.find({
            members: {
                $all: [req.params.userId, req.params.friendId]
            },
        });
        res.status(200).json(chatroom);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const chatroom = await Chatroom.find({
            members: {
                $in: [req.params.userId]
            },
        });
        res.status(200).json(chatroom);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

export default router;
