export enum EStatusVideo {
  notProcessed = "not_processed",
  downloading = "downloading",
  processing = "processing",
  processed = "processed"
}

export const STATUS_TITLE: Record<EStatusVideo, string> = {
  [EStatusVideo.notProcessed]: "Процесс обработки видео еще не начат(в очереди)",
  [EStatusVideo.downloading]: "Видео в процессе обработке",
  [EStatusVideo.processing]: "Видео в процессе обработке",
  [EStatusVideo.processed]: "Видео распознано"
}
