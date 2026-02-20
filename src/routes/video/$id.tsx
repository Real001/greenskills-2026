import { createFileRoute } from "@tanstack/react-router";
import { VideoDetailPage } from "@/pages/Video"

export const Route = createFileRoute("/video/$id")({
  component: VideoDetailPage
});
