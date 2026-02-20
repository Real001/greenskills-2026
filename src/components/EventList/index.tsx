import { List, Tag, Button, Space, Typography, Flex, Badge } from "antd";
import { type IVideoEvent } from "@/types";

interface EventListProps {
  events: IVideoEvent[];
  onSelectEvent: (time: number) => void;
}

const EVENTS_TYPES = {
  TRAFFIC: "Дорожные проишествия",
  FIGHT: "Драки",
  INDUSTRIAL: "Индустриальные"
};

export const EventList = ({
  events,
  onSelectEvent,
}: EventListProps) => {
  const handleClick = (event: IVideoEvent) => {
    const element = document.getElementById("content");
    element?.scrollTo(0, 0);
    onSelectEvent(event.start_time);
  };
  return (
    <List
      header={<div>Найденные события</div>}
      bordered
      dataSource={events}
      renderItem={(event) => (
        <>
          {event.is_custom ? (
            <Badge.Ribbon text="Пользовательский">
              <List.Item
                actions={[
                  <Button
                    key="go"
                    type="link"
                    onClick={() => handleClick(event)}>
                    Перейти
                  </Button>
                ]}>
                <List.Item.Meta
                  title={(EVENTS_TYPES as any)[event.event_type] ?? "Другое"}
                  description={
                    <Flex vertical>
                      <Typography.Text italic>
                        {event.description}
                      </Typography.Text>
                      <Space>
                        <span>
                          Уверенность: {(event.confidence * 100).toFixed(1)}%
                        </span>
                        <Tag color="blue">
                          {formatTime(event.start_time)} –{" "}
                          {formatTime(event.end_time)}
                        </Tag>
                      </Space>
                    </Flex>
                  }
                />
              </List.Item>
            </Badge.Ribbon>
          ) : (
            <List.Item
              actions={[
                <Button key="go" type="link" onClick={() => handleClick(event)}>
                  Перейти
                </Button>
              ]}>
              <List.Item.Meta
                title={(EVENTS_TYPES as any)[event.event_type] ?? "Другое"}
                description={
                  <Flex vertical>
                    <Typography.Text italic>
                      {event.description}
                    </Typography.Text>
                    <Space>
                      <span>
                        Уверенность: {(event.confidence * 100).toFixed(1)}%
                      </span>
                      <Tag color="blue">
                        {formatTime(event.start_time)} –{" "}
                        {formatTime(event.end_time)}
                      </Tag>
                    </Space>
                  </Flex>
                }
              />
            </List.Item>
          )}
        </>
      )}
    />
  );
};

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
};
