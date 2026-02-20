import { createFileRoute } from "@tanstack/react-router";
import Main from "@/pages/Main"

export const Route = createFileRoute("/")({
  component: () => (
    <Main />
  )
});
