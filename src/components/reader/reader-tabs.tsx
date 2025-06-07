import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentDisplay } from "@/components/reader/content-display";
import { TutorPanel } from "@/components/reader/tutor-panel";
import { ContentDetailResponse } from "@/types/api";

interface ReaderTabsProps {
  content: ContentDetailResponse;
  onTextSelect: (text: string) => void;
}

export function ReaderTabs({ content, onTextSelect }: ReaderTabsProps) {
  return (
    <Tabs defaultValue="text" className="w-full h-screen flex flex-col">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="tutor">AI Tutor</TabsTrigger>
      </TabsList>
      <TabsContent value="text" className="flex-1 overflow-y-auto">
        <ContentDisplay content={content} onTextSelect={onTextSelect} />
      </TabsContent>
      <TabsContent value="tutor" className="flex-1 h-full">
        <TutorPanel contentId={content.id} />
      </TabsContent>
    </Tabs>
  );
}
