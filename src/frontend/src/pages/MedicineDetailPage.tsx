import { Button } from "@/components/ui/button";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Loader2, Pill } from "lucide-react";
import { useGetMedicine } from "../hooks/useQueries";

export default function MedicineDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const medicineId = id ? BigInt(id) : null;
  const { data: medicine, isLoading, isError } = useGetMedicine(medicineId);

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center min-h-[50vh]"
        data-ocid="medicine.loading_state"
      >
        <Loader2 className="w-10 h-10 animate-spin text-teal-700" />
      </div>
    );
  }

  if (isError || !medicine) {
    return (
      <div
        className="max-w-3xl mx-auto px-6 py-16 text-center"
        data-ocid="medicine.error_state"
      >
        <Pill className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Medicine Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find the medicine you're looking for.
        </p>
        <Link to="/search">
          <Button
            className="bg-teal-700 hover:bg-teal-600 text-white rounded-full"
            data-ocid="medicine.primary_button"
          >
            Back to Search
          </Button>
        </Link>
      </div>
    );
  }

  const details = [
    { label: "Generic Name", value: medicine.genericName },
    { label: "Category", value: medicine.category },
    { label: "Manufacturer", value: medicine.manufacturer },
    { label: "Barcode", value: medicine.barcode },
  ];

  const clinicalDetails = [
    { label: "Uses", value: medicine.uses, icon: "💊" },
    { label: "Dosage", value: medicine.dosage, icon: "📋" },
    { label: "Side Effects", value: medicine.sideEffects, icon: "⚠️" },
    { label: "Warnings", value: medicine.warnings, icon: "🔴" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Back */}
      <Link
        to="/search"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-teal-700 text-sm mb-8 transition-colors"
        data-ocid="medicine.link"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </Link>

      {/* Header */}
      <div className="bg-teal-200 rounded-2xl px-8 py-8 mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="text-xs font-semibold text-teal-700 bg-white/80 px-2 py-0.5 rounded-full">
              {medicine.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mt-3 leading-tight">
              {medicine.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {medicine.genericName} · {medicine.manufacturer}
            </p>
          </div>
          {medicine.featured && (
            <span className="bg-teal-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {details.map(({ label, value }) => (
            <div key={label} className="bg-white/60 rounded-xl p-3">
              <p className="text-xs text-muted-foreground font-medium">
                {label}
              </p>
              <p
                className="text-sm font-semibold text-foreground mt-0.5 truncate"
                title={value}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Details */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        data-ocid="medicine.panel"
      >
        {clinicalDetails.map(({ label, value, icon }) => (
          <div key={label} className="bg-card rounded-xl shadow-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{icon}</span>
              <h3 className="font-bold text-foreground">{label}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Warning banner */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4 items-start">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>Medical Disclaimer:</strong> This information is for
          educational purposes only. Always consult your doctor or pharmacist
          before taking any medication. Do not change your dosage without
          professional medical advice.
        </p>
      </div>
    </div>
  );
}
