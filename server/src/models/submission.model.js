import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    language: {
      type: String,
      enum: ["cpp", "python", "java", "javascript"],
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "RUNNING",
        "ACCEPTED",
        "WRONG_ANSWER",
        "COMPILATION_ERROR",
        "RUNTIME_ERROR",
        "TIME_LIMIT_EXCEEDED",
        "MEMORY_LIMIT_EXCEEDED",
      ],
      default: "PENDING",
    },

    runtime: {
      type: Number, // milliseconds
      default: 0,
    },

    memory: {
      type: Number, // MB
      default: 0,
    },

    passedTestCases: {
      type: Number,
      default: 0,
    },

    totalTestCases: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },
    errorMessage:{
        type:String
    },

    errorDetails:{
        type:String
    }
  },
  {
    timestamps: true,
  }
);

export const Submission = mongoose.model("Submission", submissionSchema);