import type { Block, KnownBlock } from "@/lib/data/slack-schemas";
import { HeaderBlock } from "./blocks/header-block";
import { ContextBlock } from "./blocks/context-block";
import { SectionBlock } from "./blocks/section-block";
import { DividerBlock } from "./blocks/divider-block";
import { ActionsBlock } from "./blocks/actions-block";

function isKnownBlock(block: Block): block is KnownBlock {
  return (
    block.type === "header" ||
    block.type === "context" ||
    block.type === "section" ||
    block.type === "divider" ||
    block.type === "actions"
  );
}

type BlockComponentMap = {
  [K in KnownBlock["type"]]: React.ComponentType<{ block: Extract<KnownBlock, { type: K }>; extraActions?: React.ReactNode }>;
};

// Every block component above keeps its own exact prop type — this literal is
// fully checked against BlockComponentMap, so a mismatched component here is a
// compile error. Adding a new block type later means adding one file + one line
// here, not editing a switch statement.
const BLOCK_REGISTRY: BlockComponentMap = {
  header: HeaderBlock,
  context: ContextBlock,
  section: SectionBlock,
  divider: DividerBlock,
  actions: ActionsBlock,
};

export function BlockRenderer({ blocks, extraActions }: { blocks: Block[]; extraActions?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      {blocks.map((block, index) => {
        if (!isKnownBlock(block)) {
          return (
            <div
              key={index}
              className="rounded border border-dashed border-muted-foreground/30 px-2 py-1 text-xs text-muted-foreground"
            >
              Unsupported block type: {block.type}
            </div>
          );
        }
        // Single documented cast: same TS limitation as actions-block.tsx — a
        // dynamic key lookup into a mapped type can't be statically correlated.
        const Component = BLOCK_REGISTRY[block.type] as React.ComponentType<{ block: typeof block; extraActions?: React.ReactNode }>;
        return <Component key={index} block={block} extraActions={block.type === "actions" ? extraActions : undefined} />;
      })}
    </div>
  );
}
