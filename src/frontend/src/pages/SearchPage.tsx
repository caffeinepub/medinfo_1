import { useSearch } from "@tanstack/react-router";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import MedicineCard from "../components/MedicineCard";
import { useSearchMedicines } from "../hooks/useQueries";

export default function SearchPage() {
  const searchParams = useSearch({ strict: false }) as { q?: string };
  const [term, setTerm] = useState(searchParams.q ?? "");
  const [debouncedTerm, setDebouncedTerm] = useState(term);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(term), 400);
    return () => clearTimeout(t);
  }, [term]);

  const { data: results, isLoading } = useSearchMedicines(debouncedTerm);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        Search Medicines
      </h1>

      <div className="bg-teal-700 rounded-2xl p-3 flex items-center gap-3 shadow-card max-w-2xl mb-10">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Type a medicine name..."
          className="flex-1 bg-white rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          data-ocid="search.input"
        />
        <div className="w-11 h-11 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0">
          <Search className="w-4 h-4" />
        </div>
      </div>

      {isLoading && (
        <div
          className="flex justify-center py-16"
          data-ocid="search.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
        </div>
      )}

      {!isLoading && debouncedTerm && results && results.length === 0 && (
        <div className="text-center py-16" data-ocid="search.empty_state">
          <p className="text-muted-foreground text-lg">
            No medicines found for <strong>{debouncedTerm}</strong>.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Try a different name or spelling.
          </p>
        </div>
      )}

      {!isLoading && results && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {results.map((m, i) => (
            <MedicineCard key={m.id.toString()} medicine={m} index={i + 1} />
          ))}
        </div>
      )}

      {!debouncedTerm && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Enter a medicine name above to begin your search.</p>
        </div>
      )}
    </div>
  );
}
