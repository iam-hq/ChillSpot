import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    chatroomId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    body: {
        type: String,
    },
    status: {
      type: String,
      default: "unread"
    },
    attachments: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
