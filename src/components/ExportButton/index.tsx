import React from "react";
import { Button, message, Flex } from "antd";
import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import { type IVideoEvent } from "@/types";

interface ExportButtonsProps {
  events: IVideoEvent[];
  videoUrl?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ events }) => {
  const handleExportReport = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.json";
    a.click();
    URL.revokeObjectURL(url);
    message.success("Отчёт экспортирован");
  };

  const handleExportHighlights = () => {
    message.info("Экспорт хайлайтов (нарезка видео) – заглушка");
  };

  return (
    <Flex gap="small" wrap>
      <Button icon={<FileTextOutlined />} onClick={handleExportReport}>
        Экспорт отчёта
      </Button>
      <Button icon={<DownloadOutlined />} onClick={handleExportHighlights}>
        Экспорт хайлайтов
      </Button>
    </Flex>
  );
};
