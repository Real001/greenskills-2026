import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import {
  Badge,
  Button,
  Card,
  Col,
  Flex,
  message,
  Row,
  Skeleton,
  Space,
  Typography
} from "antd";
import ReactPlayer from "react-player";
import type { IVideo } from "@/types";
import { EStatusVideo, STATUS_TITLE } from "@/constants";
import { VideoThumbnail } from "@/components/VideoThumbnail";

const { Title, Text } = Typography;

export const VideoListPage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get<IVideo[]>(`${import.meta.env.VITE_API_URL}/video/`)
      .then((res) => {
        setVideos(res.data);
      })
      .catch(() => {
        message.error(
          "Не удалось загрузить список, попробуйте обновить страницу"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Flex vertical>
      <Title level={3}>Загруженные видео</Title>
      <Row gutter={[16, 16]}>
        {loading ? (
          <>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Skeleton.Node
                active
                style={{ width: "304px", height: "322px" }}
              />
            </Col>
          </>
        ) : (
          <>
            {videos.map((video) => (
              <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
                <Badge.Ribbon
                  text={
                    video.status === EStatusVideo.processed
                      ? "Готово"
                      : "Видео в работе"
                  }
                  color={
                    video.status === EStatusVideo.processed ? "green" : "blue"
                  }>
                  <Card
                    onClick={() => navigate({ to: `/video/${video.id}` })}
                    hoverable
                    cover={
                      <div style={{ width: "100%", height: "150px" }}>
                        <ReactPlayer
                          url={video.file}
                          light={
                            <VideoThumbnail
                              videoUrl={video.file}
                              snapshotAtTime={5}
                            />
                          }
                          width="100%"
                          height={150}
                          controls={false}
                        />
                      </div>
                    }
                    actions={[
                      <Button
                        key="videoId"
                        type="link"
                        onClick={() => navigate({ to: `/video/${video.id}` })}>
                        Открыть
                      </Button>
                    ]}>
                    <Card.Meta
                      title={video.title}
                      description={
                        <Space orientation="vertical">
                          <Text>
                            <Text type="secondary">Статус: </Text>
                            {STATUS_TITLE[video.status]}
                          </Text>
                          <Text>
                            <Text type="secondary">Длительность: </Text>
                            {video.duration
                              ? formatTime(video.duration)
                              : "неизвестно"}
                          </Text>
                          <Text>
                            <Text type="secondary">Событий: </Text>
                            {video.highlights_count ?? 0}
                          </Text>
                        </Space>
                      }
                    />
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
          </>
        )}
        {videos.length === 0 && !loading && (
          <Col span={24} style={{ textAlign: "center", padding: 50 }}>
            <Text type="secondary">Нет загруженных видео</Text>
          </Col>
        )}
      </Row>
    </Flex>
  );
};

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};
