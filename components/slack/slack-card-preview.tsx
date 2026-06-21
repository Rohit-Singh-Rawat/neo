"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CardThread } from "./card-thread";
import type { SlackMessage } from "@/lib/data/slack-schemas";

export function DeviconSlack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 128 128" {...props}><path fill="#de1c59" d="M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317S.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317c-7.33 0-13.317-5.987-13.317-13.317zm0 0" /><path fill="#35c5f0" d="M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309S39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317zm0 0" /><path fill="#2eb57d" d="M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317s13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317zm0 0" /><path fill="#ebb02e" d="M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309s-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317c0 7.33-5.987 13.317-13.317 13.317zm0 0" /></svg>
  )
}

export function SlackCardPreview({ thread }: { thread: SlackMessage[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="h-5 rounded-4xl px-2 ml-1 border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-medium text-xs shadow-none inline-flex items-center justify-center gap-1" />
        }
      >
        <DeviconSlack className="size-3" />
        Preview Slack card
      </SheetTrigger>
      <SheetContent side="right" className="sm:!max-w-[640px] sm:!h-[calc(100vh-2rem)] sm:!inset-y-4 sm:!right-4 sm:rounded-2xl border shadow-2xl p-0 flex flex-col gap-0 overflow-hidden">
        <SheetHeader className="px-5 py-4">
          <SheetTitle>Slack preview</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-5 pt-0">
          <CardThread thread={thread} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
