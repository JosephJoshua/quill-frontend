import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { flashcardService, UpdateFlashcardDto } from "@/services/flashcardService";
import { Flashcard, PaginatedResponse, JapaneseVocabDetails, ChineseVocabDetails } from "@/types/api";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const PAGE_LIMIT = 15;

// Edit Dialog Component (defined inside for simplicity)
const EditCardDialog = ({ card, isOpen, onOpenChange, onUpdate }: { card: Flashcard | null, isOpen: boolean, onOpenChange: (open: boolean) => void, onUpdate: () => void }) => {
  const { t } = useTranslation();
  const formSchema = z.object({
    frontText: z.string().min(1), backText: z.string().min(1), furigana: z.string().optional(), pinyin: z.string().optional()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { frontText: '', backText: '', furigana: '', pinyin: '' }
  });

  useEffect(() => {
    if (card) {
      form.reset({
        frontText: card.frontText,
        backText: card.backText,
        furigana: (card.details as JapaneseVocabDetails)?.furigana || '',
        pinyin: (card.details as ChineseVocabDetails)?.pinyin || '',
      });
    }
  }, [card, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!card) return;
    const updateDto: UpdateFlashcardDto = {
      language: card.language,
      frontText: values.frontText,
      backText: values.backText,
      details: { ...card.details, furigana: values.furigana, pinyin: values.pinyin }
    };
    try {
      await flashcardService.update(card.id, updateDto);
      toast.success(t('srs.browse.updateToastSuccess'));
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast.error(t('srs.browse.updateToastError'));
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent><DialogHeader><DialogTitle>{t('srs.browse.edit')}</DialogTitle></DialogHeader>
        <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="frontText" render={({ field }) => (<FormItem><FormLabel>{t('reader.frontTextLabel')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="backText" render={({ field }) => (<FormItem><FormLabel>{t('reader.backTextLabel')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          {card?.language === 'jpn' && <FormField control={form.control} name="furigana" render={({ field }) => (<FormItem><FormLabel>{t('reader.furiganaLabel')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />}
          {card?.language === 'chi_sim' && <FormField control={form.control} name="pinyin" render={({ field }) => (<FormItem><FormLabel>{t('reader.pinyinLabel')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />}
          <Button type="submit" disabled={form.formState.isSubmitting}>{t('reader.submitButton')}</Button>
        </form></Form>
      </DialogContent>
    </Dialog>
  );
};

export default function SrsBrowsePage() {
  const { t } = useTranslation();
  const [data, setData] = useState<PaginatedResponse<Flashcard> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [cardToEdit, setCardToEdit] = useState<Flashcard | null>(null);
  const [cardToDelete, setCardToDelete] = useState<Flashcard | null>(null);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const result = await flashcardService.getAll({ q: debouncedSearchTerm, page: currentPage, limit: PAGE_LIMIT });
      setData(result);
    } catch (err) {
      toast.error("Failed to load flashcards.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCards(); }, [debouncedSearchTerm, currentPage]);

  const handleDelete = async () => {
    if (!cardToDelete) return;
    try {
      await flashcardService.deleteById(cardToDelete.id);
      toast.success(t('srs.browse.deleteToastSuccess'));
      fetchCards(); // Refresh data
    } catch (error) {
      toast.error(t('srs.browse.deleteToastError'));
    } finally {
      setCardToDelete(null);
    }
  };

  return (
    <div className="container p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{t('srs.browse.title')}</h1>
        <Input placeholder={t('srs.browse.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-[300px]" />
      </div>
      <div className="rounded-md border">
        <Table><TableHeader><TableRow>
          <TableHead>{t('srs.browse.table.front')}</TableHead><TableHead>{t('srs.browse.table.back')}</TableHead>
          <TableHead className="hidden md:table-cell">{t('srs.browse.table.dueDate')}</TableHead>
          <TableHead><span className="sr-only">{t('srs.browse.table.actions')}</span></TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {isLoading ? (<TableRow><TableCell colSpan={4} className="h-24 text-center">{t('common.loading')}</TableCell></TableRow>)
          : data?.items.length ? (data.items.map((card) => (
            <TableRow key={card.id}>
              <TableCell className="font-medium">{card.frontText}</TableCell><TableCell>{card.backText}</TableCell>
              <TableCell className="hidden md:table-cell">{new Date(card.dueDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setCardToEdit(card)}>{t('srs.browse.edit')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCardToDelete(card)} className="text-destructive">{t('srs.browse.delete')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))) : (<TableRow><TableCell colSpan={4} className="h-24 text-center">{t('library.noResults')}</TableCell></TableRow>)}
        </TableBody></Table>
      </div>
      {/* Pagination controls would go here */}
      <EditCardDialog card={cardToEdit} isOpen={!!cardToEdit} onOpenChange={(open) => !open && setCardToEdit(null)} onUpdate={fetchCards} />
      <AlertDialog open={!!cardToDelete} onOpenChange={(open) => !open && setCardToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>{t('srs.browse.deleteConfirmTitle')}</AlertDialogTitle><AlertDialogDescription>{t('srs.browse.deleteConfirmDescription')}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('srs.browse.delete')}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
