import type { ActionElement, KnownActionElement, KnownBlock } from "@/lib/data/slack-schemas";
import { ButtonElement } from "../elements/button-element";
import { StaticSelectElement } from "../elements/static-select-element";

type ActionsBlockData = Extract<KnownBlock, { type: "actions" }>;

function isKnownActionElement(element: ActionElement): element is KnownActionElement {
  return element.type === "button" || element.type === "static_select";
}

type ActionElementComponentMap = {
  [K in KnownActionElement["type"]]: React.ComponentType<{
    element: Extract<KnownActionElement, { type: K }>;
  }>;
};

const ACTION_ELEMENT_REGISTRY: ActionElementComponentMap = {
  button: ButtonElement,
  static_select: StaticSelectElement,
};

export function ActionsBlock({ block, extraActions }: { block: ActionsBlockData; extraActions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {block.elements.map((element, index) => {
        if (!isKnownActionElement(element)) {
          return (
            <span key={index} className="text-xs text-muted-foreground">
              Unsupported action: {element.type}
            </span>
          );
        }
        // Single documented cast: TS can't statically prove a dynamic key lookup
        // into ActionElementComponentMap preserves the element/component correlation.
        const Component = ACTION_ELEMENT_REGISTRY[element.type] as React.ComponentType<{
          element: typeof element;
        }>;
        return <Component key={index} element={element} />;
      })}
      {extraActions}
    </div>
  );
}
