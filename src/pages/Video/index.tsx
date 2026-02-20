import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  Row,
  Col,
  Card,
  Spin,
  message,
  Flex,
  Typography,
  Button,
  Alert,
  Skeleton
} from "antd";
import axios from "axios";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ChromeDinoGame from "react-chrome-dino-ts";
import { VideoPlayer } from "@/components/VideoPlayer";
import { EventList } from "@/components/EventList";
import { ExportButtons } from "@/components/ExportButton";
import { PromptInput } from "@/components/PromtInput";
import { type IVideo, type IVideoEvent } from "@/types";
import "react-chrome-dino-ts/index.css";
import { EStatusVideo } from "@/constants";
import { pollRecognitionStatus } from "@/utils/pollRecognitionStatus";
import { statusPromt } from "@/utils/statusPromt";

export const VideoDetailPage = () => {
  const { id } = useParams({ from: "/video/$id" });
  const navigate = useNavigate();

  const [video, setVideo] = useState<IVideo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadingHighlights, setLoadingHighlights] = useState<boolean>(false);
  const [events, setEvents] = useState<IVideoEvent[]>([]);
  const [taskPromtId, setTaskPromtId] = useState<number | null>(null);
  const [loadingPromt, setLoadingPromt] = useState<boolean>(false);

  useEffect(() => {
    pollRecognitionStatus(Number(id), setVideo, 5, setLoading);
  }, [id]);

  useEffect(() => {
    if (video?.status === EStatusVideo.processed) {
      setLoadingHighlights(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/highlights/?video_id=${video.id}`)
        .then((res) => {
          setEvents(res.data);
        })
        .catch(() => {
          message.error("Не удалось загрузить список хайлайтов");
        })
        .finally(() => {
          setLoadingHighlights(false);
        });
    }
  }, [video]);

  useEffect(() => {
    if (taskPromtId) {
      statusPromt(Number(id), taskPromtId, setEvents, 5, setLoadingPromt);
    }
  }, [taskPromtId])

  const handleBack = () => {
    navigate({ to: "/video" });
  };

  const handlePrompt = (promt: string) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/video/${id}/promt/`, {
        promt
      })
      .then((res) => {
        setTaskPromtId(res.data.task_id);
        message.success("Промт ушел в обработку");
      })
      .catch(() => {
        message.error(
          "При отправке текстового промта произошла ошибка попробуйте позднее"
        );
      });
  };

  return (
    <Flex vertical gap="small">
      <Flex>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Назад
        </Button>
      </Flex>
      {loading ? (
        <Flex vertical>
          <Alert
            type="info"
            title="Распознавание видео"
            description="Подождите пока распознается видео, а чтобы не скучать сыграйте в динозаврика"
            action={<Spin style={{ marginTop: "20px" }} />}
            banner
          />
          <ChromeDinoGame
            instructions={
              <Typography.Text>Нажмите пробел для старта</Typography.Text>
            }
          />
        </Flex>
      ) : (
        <>
          {video ? (
            <>
              <Typography.Title level={5}>
                Видео: {video.title}
              </Typography.Title>
              <Row gutter={16}>
                <Col span={24}>
                  <Card>
                    <VideoPlayer
                      url={video.file}
                      currentTime={currentTime}
                      onProgress={setCurrentTime}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={16}>
                  <Card title="События">
                    {loadingHighlights ? (
                      <Skeleton.Node active />
                    ) : (
                      <EventList
                        events={events ?? []}
                        onSelectEvent={setCurrentTime}
                      />
                    )}
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Экспорт">
                    <ExportButtons
                      events={events ?? []}
                      videoUrl={video.file}
                    />
                  </Card>
                  <Card title="Текстовый промпт" style={{ marginTop: 16 }}>
                    <PromptInput onPromptSubmit={handlePrompt} loading={loadingPromt} />
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <div></div>
          )}
        </>
      )}
    </Flex>
  );
};
