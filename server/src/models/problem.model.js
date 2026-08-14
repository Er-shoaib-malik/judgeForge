import mongoose, { Schema } from "mongoose";

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    statement: {
      type: String,
      required: true,
    },

    constraints: {
      type: String,
    },

    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],

    timeLimit: {
      type: Number,
      default: 2, // seconds
    },

    memoryLimit: {
      type: Number,
      default: 256, // MB
    },
  },
  {
    timestamps: true,
  }
);

export const Problem = mongoose.model("Problem", problemSchema);