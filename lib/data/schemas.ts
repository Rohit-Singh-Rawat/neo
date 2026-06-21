import { z } from "zod";

export const SpanStatusSchema = z.enum(["success", "error", "running"]);
export const TraceStatusSchema = z.enum(["success", "error", "running"]);

const baseSpanFields = {
  id: z.string(),
  parentId: z.string().nullable(),
  name: z.string(),
  status: SpanStatusSchema,
  startTime: z.string(),
  endTime: z.string().optional(),
  latencyMs: z.number().optional(),
  input: z.unknown(),
  output: z.unknown().optional().nullable(),
  error: z.string().optional(),
};

const ChainSpanSchema = z.object({ ...baseSpanFields, type: z.literal("chain") });
const ToolSpanSchema = z.object({ ...baseSpanFields, type: z.literal("tool") });
const RetrieverSpanSchema = z.object({ ...baseSpanFields, type: z.literal("retriever") });
const ParserSpanSchema = z.object({ ...baseSpanFields, type: z.literal("parser") });
const GuardrailSpanSchema = z.object({ ...baseSpanFields, type: z.literal("guardrail") });
const LlmSpanSchema = z.object({
  ...baseSpanFields,
  type: z.literal("llm"),
  model: z.string().optional(),
  promptTokens: z.number().optional(),
  completionTokens: z.number().optional(),
  totalTokens: z.number().optional(),
  costUsd: z.number().optional(),
});

export const SpanSchema = z.discriminatedUnion("type", [
  ChainSpanSchema,
  ToolSpanSchema,
  RetrieverSpanSchema,
  ParserSpanSchema,
  GuardrailSpanSchema,
  LlmSpanSchema,
]);

export type Span = z.infer<typeof SpanSchema>;
export type LlmSpan = z.infer<typeof LlmSpanSchema>;

export const FeedbackSchema = z.object({
  rating: z.enum(["up", "down"]),
  score: z.number(),
  comment: z.string().nullable(),
});

export const TraceSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: TraceStatusSchema,
  startTime: z.string(),
  tags: z.array(z.string()),
  metadata: z.record(z.string(), z.unknown()),
  totalTokens: z.number(),
  totalCostUsd: z.number(),
  spans: z.array(SpanSchema),
  feedback: FeedbackSchema.optional(),
});

export type Trace = z.infer<typeof TraceSchema>;
