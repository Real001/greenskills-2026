import React from "react";
import { Button, message, Flex } from "antd";
import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import { type IVideoEvent } from "@/types";

interface ExportButtonsProps {
  events: IVideoEvent[];
  videoUrl?: string;
  videoId: number;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  events,
  videoId
}) => {
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

  return (
    <Flex gap="small" wrap>
      <Button icon={<FileTextOutlined />} onClick={handleExportReport}>
        Экспорт отчёта
      </Button>
      <Button
        variant="solid"
        icon={<DownloadOutlined />}
        href={`http://45.80.129.41:8001/api/highlight-files/?video_id=${videoId}`}>
        Экспорт хайлайтов
      </Button>
    </Flex>
  );
};
