import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Bookmark, Pill } from "lucide-react";
import type { Medicine } from "../backend.d";

const MEDICINE_IMAGES: Record<string, string> = {
  Ibuprofen: "/assets/generated/medicine-ibuprofen.dim_400x280.jpg",
  Amoxicillin: "/assets/generated/medicine-amoxicillin.dim_400x280.jpg",
  Lisinopril: "/assets/generated/medicine-lisinopril.dim_400x280.jpg",
};

function getMedicineImage(name: string): string | null {
  const key = Object.keys(MEDICINE_IMAGES).find((k) =>
    name.toLowerCase().includes(k.toLowerCase()),
  );
  return key ? MEDICINE_IMAGES[key] : null;
}

interface MedicineCardProps {
  medicine: Medicine;
  index?: number;
}

export default function MedicineCard({
  medicine,
  index = 1,
}: MedicineCardProps) {
  const image = getMedicineImage(medicine.name);

  return (
    <div
      className="bg-card rounded-xl shadow-card overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
      data-ocid={`medicine.item.${index}`}
    >
      <div className="h-40 bg-teal-200 flex items-center justify-center relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={medicine.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-teal-700">
            <Pill className="w-12 h-12 opacity-60" />
            <span className="text-xs font-medium opacity-70">
              {medicine.category}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
            {medicine.category}
          </span>
        </div>
        <button
          type="button"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-teal-700 hover:bg-white transition-colors shadow-sm"
          aria-label="Bookmark"
          data-ocid={`medicine.toggle.${index}`}
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-foreground text-base leading-tight">
          {medicine.name}
        </h3>
        <div className="space-y-1.5 text-sm text-foreground flex-1">
          <div>
            <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
              Uses
            </span>
            <p className="line-clamp-2 mt-0.5">{medicine.uses}</p>
          </div>
          <div>
            <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
              Dosage
            </span>
            <p className="line-clamp-1 mt-0.5">{medicine.dosage}</p>
          </div>
          <div>
            <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
              Side Effects
            </span>
            <p className="line-clamp-2 mt-0.5">{medicine.sideEffects}</p>
          </div>
        </div>

        <Link
          to="/medicine/$id"
          params={{ id: medicine.id.toString() }}
          data-ocid={`medicine.link.${index}`}
        >
          <Button
            className="w-full bg-teal-700 hover:bg-teal-600 text-white rounded-lg font-semibold"
            data-ocid={`medicine.primary_button.${index}`}
          >
            More Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
