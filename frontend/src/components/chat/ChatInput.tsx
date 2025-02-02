import { AIInputWithFile } from "@/components/ui/ai-input-with-file";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onFileUpload?: (file: File) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onFileUpload, disabled }: ChatInputProps) {
  const handleSubmit = async (message: string, file?: File) => {
    if (message.trim()) {
      await onSendMessage(message);
    }
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <AIInputWithFile 
        onSubmit={handleSubmit}
        className="container max-w-4xl mx-auto"
        placeholder="Type a message..."
        disabled={disabled}
      />
    </div>
  );
}
