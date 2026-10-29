import React, { memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import { PROFILE_CONFIG } from "../config";
import { Terminal as TerminalIcon } from "lucide-react";

function TerminalWidget() {
  const { whoami, skills, currentlyBuilding } = PROFILE_CONFIG.terminal;

  return (
    <GlassWidgetCard className="p-4 sm:p-5 flex flex-col justify-between w-full">
      {/* Terminal Mini Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-400 ml-2 flex items-center gap-1">
            <TerminalIcon size={10} className="text-[#0A84FF]" />
            shubham@macbook-pro ~ zsh
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">bash 5.2</span>
      </div>

      {/* Terminal Lines with DecryptedText */}
      <div className="font-mono text-[11px] sm:text-xs space-y-2 py-0.5">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[#0A84FF] font-semibold">❯ whoami:</span>
          <DecryptedText
            text={whoami}
            speed={25}
            className="text-zinc-200"
            encryptedClassName="text-[#0A84FF]/60"
          />
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-zinc-400 font-semibold">❯ skills:</span>
          <DecryptedText
            text={skills}
            speed={20}
            className="text-zinc-300"
            encryptedClassName="text-[#0A84FF]/60"
          />
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-emerald-400 font-semibold">❯ currently_building:</span>
          <DecryptedText
            text={currentlyBuilding}
            speed={25}
            className="text-zinc-200"
            encryptedClassName="text-[#0A84FF]/60"
          />
        </div>
      </div>
    </GlassWidgetCard>
  );
}

export default memo(TerminalWidget);

