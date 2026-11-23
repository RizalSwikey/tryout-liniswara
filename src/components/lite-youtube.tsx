"use client";

import { createElement, useEffect } from "react";
import "lite-youtube-embed/src/lite-yt-embed.css";

export function LiteYouTube({ videoId, title }: { videoId: string; title: string }) {
  useEffect(() => {
    // Registrasi custom element sekali saja, di luar bundle awal.
    void import("lite-youtube-embed/src/lite-yt-embed.js");
  }, []);

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink [&>lite-youtube]:max-w-none [&>lite-youtube]:w-full">
      {createElement("lite-youtube", {
        videoid: videoId,
        playlabel: `Putar: ${title}`,
        params: "rel=0",
        title,
      })}
    </div>
  );
}
