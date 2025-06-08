import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { BookMarked } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { contentService } from "@/services/contentService";
import { Language, CefrLevel } from "@/types/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LibrarySkeleton } from "@/components/skeletons/library-skeleton";
import { EmptyState } from "@/components/shared/empty-state";

const PAGE_LIMIT = 10;

export default function LibraryPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState<Language | "">("");
  const [difficulty, setDifficulty] = useState<CefrLevel | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const queryParams = {
    q: debouncedSearchTerm,
    language: language.trim().length === 0 ? undefined : language,
    difficultyLevel: difficulty.trim().length === 0 ? undefined : difficulty,
    page: currentPage,
    limit: PAGE_LIMIT,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allContent", queryParams],
    queryFn: () => contentService.getAll(queryParams),
  });

  return (
    <div className="w-full p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("library.title")}
        </h1>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <Input
            placeholder={t("library.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[250px]"
          />
          <Select
            value={language}
            onValueChange={(v) => {
              setLanguage(v as Language | "");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder={t("library.language")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("library.allLanguages")}</SelectItem>
              <SelectItem value="eng">English</SelectItem>
              <SelectItem value="jpn">Japanese</SelectItem>
              <SelectItem value="chi_sim">Chinese</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={difficulty}
            onValueChange={(v) => {
              setDifficulty(v as CefrLevel | "");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder={t("library.difficulty")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">{t("library.allLevels")}</SelectItem>
              <SelectItem value="A1">A1</SelectItem>
              <SelectItem value="A2">A2</SelectItem>
              <SelectItem value="B1">B1</SelectItem>
              <SelectItem value="B2">B2</SelectItem>
              <SelectItem value="C1">C1</SelectItem>
              <SelectItem value="C2">C2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isError ? (
        <EmptyState title="Error" description={t("common.error")} />
      ) : (
        <>
          {isLoading ? (
            <LibrarySkeleton />
          ) : !data?.data?.length ? (
            <EmptyState
              title="No Content Found"
              description="Try adjusting your search or filters to find what you're looking for."
              icon={<BookMarked className="h-16 w-16" />}
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("library.table.title")}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {t("library.table.author")}
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      {t("library.table.language")}
                    </TableHead>
                    <TableHead>{t("library.table.level")}</TableHead>
                    <TableHead>
                      <span className="sr-only">
                        {t("library.table.actions")}
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {item.author || "N/A"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.language.toUpperCase()}
                      </TableCell>
                      <TableCell>{item.difficultyLevel || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/reader/${item.id}`}>
                            {t("library.read")}
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {data?.data?.length ? (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {t("library.pagination.previous")}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("library.pagination.pageInfo", {
                  currentPage: data?.meta.currentPage,
                  totalPages: data?.meta.totalPages,
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!data || currentPage >= data.meta.totalPages}
              >
                {t("library.pagination.next")}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
