import { z } from "zod";

export const PlainTextSchema = z.object({
  type: z.literal("plain_text"),
  text: z.string(),
  emoji: z.boolean().optional(),
});

export const MrkdwnTextSchema = z.object({
  type: z.literal("mrkdwn"),
  text: z.string(),
});

export const ImageElementSchema = z.object({
  type: z.literal("image"),
  image_url: z.string(),
  alt_text: z.string(),
});

const ContextElementSchema = z.discriminatedUnion("type", [MrkdwnTextSchema, ImageElementSchema]);

export const ButtonElementSchema = z.object({
  type: z.literal("button"),
  text: PlainTextSchema,
  url: z.string().optional(),
  style: z.enum(["primary", "danger"]).optional(),
  action_id: z.string(),
});

export const StaticSelectElementSchema = z.object({
  type: z.literal("static_select"),
  placeholder: PlainTextSchema,
  action_id: z.string(),
  options: z.array(z.object({ text: PlainTextSchema, value: z.string() })),
});

const KnownActionElementSchema = z.discriminatedUnion("type", [
  ButtonElementSchema,
  StaticSelectElementSchema,
]);
const UnknownActionElementSchema = z.object({ type: z.string() }).loose();

export const ActionElementSchema = z.union([KnownActionElementSchema, UnknownActionElementSchema]);
export type KnownActionElement = z.infer<typeof KnownActionElementSchema>;
export type ActionElement = z.infer<typeof ActionElementSchema>;

const HeaderBlockSchema = z.object({ type: z.literal("header"), text: PlainTextSchema });
const ContextBlockSchema = z.object({ type: z.literal("context"), elements: z.array(ContextElementSchema) });
const SectionBlockSchema = z.object({
  type: z.literal("section"),
  text: MrkdwnTextSchema.optional(),
  fields: z.array(MrkdwnTextSchema).optional(),
});
const DividerBlockSchema = z.object({ type: z.literal("divider") });
const ActionsBlockSchema = z.object({ type: z.literal("actions"), elements: z.array(ActionElementSchema) });

const KnownBlockSchema = z.discriminatedUnion("type", [
  HeaderBlockSchema,
  ContextBlockSchema,
  SectionBlockSchema,
  DividerBlockSchema,
  ActionsBlockSchema,
]);
const UnknownBlockSchema = z.object({ type: z.string() }).loose();

export const BlockSchema = z.union([KnownBlockSchema, UnknownBlockSchema]);
export type KnownBlock = z.infer<typeof KnownBlockSchema>;
export type Block = z.infer<typeof BlockSchema>;

export const LifecycleSchema = z.enum(["alert", "investigating", "triage", "resolved"]);
export type Lifecycle = z.infer<typeof LifecycleSchema>;

export const SlackMessageSchema = z.object({
  id: z.string(),
  scenario: z.string(),
  channel: z.string(),
  postedAt: z.string(),
  traceId: z.string(),
  lifecycle: LifecycleSchema,
  blocks: z.array(BlockSchema),
});

export type SlackMessage = z.infer<typeof SlackMessageSchema>;
