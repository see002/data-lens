"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QUERY_TEMPLATES } from "@/lib/constants";

import { usePlaygroundStore } from "../state/playgroundStore";

export default function TemplatesMenu() {
  const setQueryText = usePlaygroundStore((s) => s.setQueryText);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" aria-label="Saved Queries" title="Saved Queries">
          Saved Queries
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {QUERY_TEMPLATES.map((t) => (
          <DropdownMenuItem
            className="cursor-pointer"
            key={t.label}
            onClick={() => setQueryText(t.sql)}
          >
            {t.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
