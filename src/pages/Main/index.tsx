import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Card,
  Upload,
  Input,
  message,
  Button,
  Flex,
  Typography,
  type UploadFile,
  Space,
  notification,
  Alert
} from "antd";
import { CloseOutlined, InboxOutlined } from "@ant-design/icons";
import axios from "axios";

function Main() {
  const [videoFile, setVideoFile] = useState<UploadFile | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onChangeFile = (file: UploadFile) => {
    setVideoFile(file);
  };

  // Запуск анализа
  const startAnalysis = () => {
    if (!videoFile && !videoUrl) {
      message.warning("Сначала загрузите видео или укажите ссылку");
    } else if (videoUrl) {
      if (!new RegExp(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i).test(videoUrl)) {
        message.warning("Вы ввели не валидную ссылку на видео, измените её");
        return;
      }
      setLoading(true);
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/video/`,
          { source_url: videoUrl },
          {}
        )
        .then((res) => {
          if (res.data.id) {
            navigate({ to: `/video/${res.data.id}` });
          }
        })
        .catch(() => {
          notification.error({
            title: "Ошибка",
            description: "Не удалось отправить видео на распознавание"
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (videoFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", videoFile.originFileObj as any);
      axios
        .post(`${import.meta.env.VITE_API_URL}/video/`, formData)
        .then((res) => {
          if (res.data.id) {
            navigate({ to: `/video/${res.data.id}` });
          }
        })
        .catch(() => {
          notification.error({
            title: "Ошибка",
            description: "Не удалось отправить видео на распознавание"
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Card title="Загрузка видео" size="small">
      <Flex vertical gap="small" justify="center" align="center">
        <Alert
          banner
          description="Видео с youtube пока не поддерживается, мы уже решаем эту проблему, приносим свои извинения"></Alert>
        <Upload.Dragger
          disabled={!!videoUrl}
          maxCount={1}
          fileList={videoFile ? [videoFile] : []}
          onChange={(info) => onChangeFile(info.file)}
          styles={{ root: { width: "100%" } }}
          accept="video/*"
          showUploadList={false}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p>Нажмите или перетащите видео</p>
        </Upload.Dragger>
        {videoFile && (
          <Space
            align="center"
            style={{ width: "100%", justifyContent: "space-between" }}>
            <Typography.Text>
              Выбран файл: <strong>{videoFile.name}</strong> (
              {((videoFile.size ?? 0) / 1024 / 1024).toFixed(2)} MB)
            </Typography.Text>
            <Button
              disabled={loading}
              icon={<CloseOutlined />}
              size="small"
              danger
              onClick={() => setVideoFile(null)}>
              Удалить
            </Button>
          </Space>
        )}
        <Typography.Text>ИЛИ</Typography.Text>
        <Input
          disabled={!!videoFile}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="вставьте URL ссылку"
          style={{ marginTop: 16 }}
        />
        <Button type="primary" onClick={startAnalysis} block loading={loading}>
          Запустить анализ
        </Button>
      </Flex>
    </Card>
  );
}

export default Main;
