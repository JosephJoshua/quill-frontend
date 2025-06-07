import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { flashcardService } from "@/services/flashcardService";
import { Language } from "@/types/api";

interface CreateFlashcardDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedText: string;
  contentId: string;
  language: Language;
}

export function CreateFlashcardDialog({ isOpen, onOpenChange, selectedText, contentId, language }: CreateFlashcardDialogProps) {
  const { t } = useTranslation();

  const formSchema = z.object({
    frontText: z.string().min(1, "Front text cannot be empty."),
    backText: z.string().min(1, "Back text cannot be empty."),
    furigana: z.string().optional(),
    pinyin: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: { frontText: selectedText, backText: "", furigana: "", pinyin: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await flashcardService.create({
        contentId,
        language,
        frontText: values.frontText,
        backText: values.backText,
        details: {
          furigana: values.furigana,
          pinyin: values.pinyin,
        },
      });
      toast.success(t('reader.toastSuccess'));
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error(t('reader.toastError'));
      console.error(error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('reader.createFlashcardTitle')}</DialogTitle>
          <DialogDescription>{t('reader.createFlashcardDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="frontText" render={({ field }) => (
              <FormItem><FormLabel>{t('reader.frontTextLabel')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="backText" render={({ field }) => (
              <FormItem><FormLabel>{t('reader.backTextLabel')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            {language === 'jpn' && (
              <FormField control={form.control} name="furigana" render={({ field }) => (
                <FormItem><FormLabel>{t('reader.furiganaLabel')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            )}
            {language === 'chi_sim' && (
              <FormField control={form.control} name="pinyin" render={({ field }) => (
                <FormItem><FormLabel>{t('reader.pinyinLabel')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            )}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t('reader.submittingButton') : t('reader.submitButton')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
