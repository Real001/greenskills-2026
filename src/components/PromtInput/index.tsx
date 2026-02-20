import { useState } from "react";
import { Input, Button, message, Flex } from "antd";

interface PromptInputProps {
  onPromptSubmit: (prompt: string) => void;
  loading?: boolean;
}

export const PromptInput = ({
  onPromptSubmit,
  loading
}: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (!prompt.trim()) {
      message.warning("Введите текст запроса");
      return;
    }
    onPromptSubmit(prompt);
  };

  return (
    <Flex vertical gap="small">
      <Input.TextArea
        disabled={loading}
        allowClear
        placeholder="Введите запрос, например: найди момент опасности"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onPressEnter={handleSubmit}
      />
      <Button type="primary" onClick={handleSubmit} loading={loading} disabled={!prompt}>
        Найти
      </Button>
    </Flex>
  );
};
