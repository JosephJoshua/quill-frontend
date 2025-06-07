import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { tutorService } from '@/services/tutorService';
import { Dialogue } from '@/types/api';
import { useAuthStore } from '@/store/auth';

interface TutorPanelProps {
  contentId: string;
}

export function TutorPanel({ contentId }: TutorPanelProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Omit<Dialogue, 'id' | 'timestamp'>[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { userMessage, aiResponse: '...' }]);
    setIsLoading(true);

    try {
      const res = await tutorService.chat({
        contentId,
        message: userMessage,
        conversationId,
      });
      setConversationId(res.conversationId);
      setMessages(prev => prev.slice(0, -1).concat({ userMessage, aiResponse: res.response }));
    } catch (error) {
      console.error("Tutor chat error:", error);
      setMessages(prev => prev.slice(0, -1).concat({ userMessage, aiResponse: 'Sorry, I had trouble responding.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-l">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{t('tutor.title')}</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-primary">AI Tutor</p>
              <div className="bg-muted p-3 rounded-lg text-sm">{t('tutor.welcome')}</div>
            </div>
          </div>
          {messages.map((msg, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-start gap-3 justify-end">
                <div className="flex-1 space-y-1 text-right">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg inline-block text-left">{msg.userMessage}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-primary">AI Tutor</p>
                  <div className="bg-muted p-3 rounded-lg text-sm">{msg.aiResponse}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder={t('tutor.placeholder')}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">{t('tutor.submit')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
