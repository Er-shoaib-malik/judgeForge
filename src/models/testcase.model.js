import mongoose, { Schema } from "mongoose";

const testCaseSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    input: {
      type: String,
      required: true,
    },

    expectedOutput: {
      type: String,
      required: true,
    },

    hidden: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TestCase = mongoose.model("TestCase", testCaseSchema);