import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Message from "../models/Message.js";

const router = express.Router();

// New Message
router.post("/", async (req, res) => {
    const newMessage = new Message({
        senderId: req.body.senderId,
        body: req.body.body,
        chatroomId: req.body.chatroomId,
    });
    console.log(newMessage);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json({error: err})
    }
});

// Get Messages
router.get("/:chatroomId", async (req, res) => {
    try {
        const messages = await Message.find({
            chatroomId: req.params.chatroomId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({error: err});
    }
})

export default router;
