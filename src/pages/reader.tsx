import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContentDisplay } from '@/components/reader/content-display';
import { TutorPanel } from '@/components/reader/tutor-panel';
import { CreateFlashcardDialog } from '@/components/reader/create-flashcard-dialog';
import { contentService } from '@/services/contentService';
import { ContentDetailResponse } from '@/types/api';

export default function ReaderPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [content, setContent] = useState<ContentDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCardCreatorOpen, setIsCardCreatorOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    if (!id) {
      setError('Content ID is missing.');
      setIsLoading(false);
      return;
    }
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await contentService.getById(id);
        setContent(data);
      } catch (err) {
        setError(t('reader.error'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [id, t]);

  const handleTextSelect = (text: string) => {
    setSelectedText(text);
    setIsCardCreatorOpen(true);
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen">{t('reader.loading')}</div>;
  if (error || !content) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-destructive">{error || t('reader.error')}</p>
        <Button asChild><Link to="/library">{t('reader.backToLibrary')}</Link></Button>
      </div>
    );
  }

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="min-h-screen w-full">
        <ResizablePanel defaultSize={65} minSize={30}>
          <ScrollArea className="h-screen">
            <ContentDisplay content={content} onTextSelect={handleTextSelect} />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={35} minSize={20}>
          <TutorPanel contentId={content.id} />
        </ResizablePanel>
      </ResizablePanelGroup>
      <CreateFlashcardDialog
        isOpen={isCardCreatorOpen}
        onOpenChange={setIsCardCreatorOpen}
        selectedText={selectedText}
        contentId={content.id}
        language={content.language}
      />
    </>
  );
}
