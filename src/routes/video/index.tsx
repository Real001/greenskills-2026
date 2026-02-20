import { createFileRoute } from "@tanstack/react-router";
import { VideoListPage } from "@/pages/VideoList";

export const Route = createFileRoute("/video/")({
  component: VideoListPage
});
