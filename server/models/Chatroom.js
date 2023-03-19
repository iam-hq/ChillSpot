import mongoose from "mongoose";

const chatroomSchema = mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Chatroom = mongoose.model("Chatroom", chatroomSchema);

export default Chatroom;
