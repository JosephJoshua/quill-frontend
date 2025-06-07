import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ContentDetailResponse } from '@/types/api';

interface ContentDisplayProps {
  content: ContentDetailResponse;
  onTextSelect: (text: string) => void;
}

export function ContentDisplay({ content, onTextSelect }: ContentDisplayProps) {
  const { t } = useTranslation();
  const vocabularyMap = React.useMemo(() => {
    const map = new Map<string, typeof content.linguisticAnalysis.keyVocabulary[0]>();
    content.linguisticAnalysis.keyVocabulary.forEach(item => map.set(item.word.toLowerCase(), item));
    return map;
  }, [content.linguisticAnalysis.keyVocabulary]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (selectedText && selectedText.length > 0) {
      onTextSelect(selectedText);
    }
  };

  const renderText = () => {
    const words = content.rawText.split(/(\s+)/);
    return words.map((word, index) => {
      if (/\s+/.test(word)) return <React.Fragment key={index}>{word}</React.Fragment>;
      const cleanWord = word.replace(/[.,!?;:"]$/, '').toLowerCase();
      const vocabEntry = vocabularyMap.get(cleanWord);
      if (vocabEntry) {
        return (
          <Popover key={index}>
            <PopoverTrigger asChild><span className="bg-primary/10 hover:bg-primary/20 cursor-pointer rounded-sm px-0.5 -mx-0.5">{word}</span></PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2"><h4 className="font-medium leading-none">{vocabEntry.word}</h4><p className="text-sm text-muted-foreground">{t('reader.wordDefinition')}</p></div>
                <div className="grid gap-2"><p className="text-sm">{vocabEntry.definition}</p><p className="text-xs text-muted-foreground"><strong>{t('reader.partOfSpeech')}:</strong> {vocabEntry.partOfSpeech}</p><p className="text-xs text-muted-foreground italic"><strong>{t('reader.example')}:</strong> "{vocabEntry.exampleSentence}"</p></div>
              </div>
            </PopoverContent>
          </Popover>
        );
      }
      return <span key={index}>{word}</span>;
    });
  };

  return (
    <div onMouseUp={handleMouseUp} className="prose dark:prose-invert max-w-none p-6 md:p-8 text-lg leading-relaxed">
      {renderText()}
    </div>
  );
}
