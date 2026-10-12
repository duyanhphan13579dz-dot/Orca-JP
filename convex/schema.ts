import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  userProgress: defineTable({
    userId: v.id("users"),
    srsCardsJson: v.optional(v.string()),
    statsJson: v.optional(v.string()),
    streakJson: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});

export default schema;
