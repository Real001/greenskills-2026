import axios from "axios";
import type { IVideo } from "@/types.ts";
import { EStatusVideo } from "@/constants.ts";
import { message } from "antd";

interface IStatus {
  id: number;
  status: EStatusVideo;
}

const getStatus = async (id: number) => {
  const res = await axios.get<IStatus>(
    `${import.meta.env.VITE_API_URL}/video/${id}/status`
  );
  return res.data.status;
};

const fetchResults = async (id: number) => {
  const res = await axios.get<IVideo>(
    `${import.meta.env.VITE_API_URL}/video/${id}/`
  );
  return res.data;
};

export function pollRecognitionStatus(
  videoId: number,
  onDone: (result: IVideo) => void,
  intervalSeconds: number = 5,
  setLoading: (val: boolean) => void
): () => void {
  let cancelled = false;
  let timeoutId: NodeJS.Timeout;
  setLoading(true);

  const checkStatus = async () => {
    if (cancelled) return;

    try {
      const status = await getStatus(videoId);

      if (status === EStatusVideo.processed) {
        // Статус готов – запрашиваем результаты
        try {
          const results = await fetchResults(videoId);
          if (!cancelled) {
            onDone(results);
            setLoading(false);
          }
        } catch {
          message.error("Не удалось загрузить информацию");
          setLoading(false);
        }
        return; // завершаем опрос
      }

      // Если статус ещё не готов (pending/processing), планируем следующий запрос
      if (!cancelled) {
        timeoutId = setTimeout(checkStatus, intervalSeconds * 1000);
      }
    } catch {
      if (!cancelled) {
        message.error("Не удалось загрузить информацию");
      }
    }
  };

  // Запускаем первый запрос немедленно
  checkStatus();

  // Возвращаем функцию отмены
  return () => {
    cancelled = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}
