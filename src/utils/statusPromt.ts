import axios from "axios";
import type { IVideoEvent } from "@/types";
import { message } from "antd";

interface IStatus {
  id: number;
  status: string;
}

const getStatus = async (idVideo: number, idTask: number) => {
  const res = await axios.get<IStatus>(
    `${import.meta.env.VITE_API_URL}/video/${idVideo}/promt/?task_id=${idTask}`,
  );
  return res.data.status;
};

const fetchResults = async (id: number) => {
  const res = await axios
    .get(`${import.meta.env.VITE_API_URL}/highlights/?video_id=${id}`)

  return res.data;
};

export function statusPromt(
  videoId: number,
  taskId: number,
  onDone: (result: IVideoEvent[]) => void,
  intervalSeconds: number = 5,
  setLoading: (val: boolean) => void
): () => void {
  let cancelled = false;
  let timeoutId: NodeJS.Timeout;
  setLoading(true);

  const checkStatus = async () => {
    if (cancelled) return;

    try {
      const status = await getStatus(videoId, taskId);

      if (status === "success") {
        // Статус готов – запрашиваем результаты
        try {
          const results = await fetchResults(videoId);
          if (!cancelled) {
            onDone(results);
            setLoading(false);
          }
        } catch {
          message.error("Не удалось загрузить информацию");
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
