import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { contentService } from "@/services/contentService";
import { ContentSummary, Language, CefrLevel, PaginatedResponse } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const PAGE_LIMIT = 10;

export default function LibraryPage() {
  const [data, setData] = useState<PaginatedResponse<ContentSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState<Language | "">("");
  const [difficulty, setDifficulty] = useState<CefrLevel | "">("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await contentService.getAll({
          q: debouncedSearchTerm,
          language,
          difficultyLevel: difficulty,
          page: currentPage,
          limit: PAGE_LIMIT,
        });
        setData(result);
      } catch (err) {
        setError("Failed to load content library.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [debouncedSearchTerm, language, difficulty, currentPage]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language | "");
    setCurrentPage(1);
  };

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as CefrLevel | "");
    setCurrentPage(1);
  };

  return (
    <div className="container p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <Input
            placeholder="Search titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[250px]"
          />
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Languages</SelectItem>
              <SelectItem value="eng">English</SelectItem>
              <SelectItem value="jpn">Japanese</SelectItem>
              <SelectItem value="chi_sim">Chinese</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
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

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Author</TableHead>
                  <TableHead className="hidden md:table-cell">Language</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.items.length > 0 ? (
                  data.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="hidden sm:table-cell">{item.author || "N/A"}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.language.toUpperCase()}</TableCell>
                      <TableCell>{item.difficultyLevel || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/reader/${item.id}`}>Read</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {data?.meta.currentPage} of {data?.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!data || currentPage >= data.meta.totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
