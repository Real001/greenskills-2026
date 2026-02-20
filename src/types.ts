import { EStatusVideo } from "@/constants";

export interface IVideoEvent {
  id: number;
  video: number;
  event_type: string;
  start_time: number;
  end_time: number;
  confidence: number; // 0-1
  description: string;
  highlight: string;
  is_custom?: boolean;
}

export interface IVideo {
  created_at: string;
  file: string;
  id: number;
  source_url: string | null;
  status: EStatusVideo;
  title: string;
  duration?: number;
  highlights_count: number;
}
