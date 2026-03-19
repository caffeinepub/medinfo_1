import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, Info, Loader2, ScanLine, Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import MedicineCard from "../components/MedicineCard";
import {
  useGetAllMedicines,
  useGetFeaturedMedicines,
  useInitializeSamples,
} from "../hooks/useQueries";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { data: featured, isLoading: featuredLoading } =
    useGetFeaturedMedicines();
  const { data: allMedicines, isFetched } = useGetAllMedicines();
  const initSamples = useInitializeSamples();
  const { mutate: doInitSamples } = initSamples;

  useEffect(() => {
    if (isFetched && allMedicines && allMedicines.length === 0) {
      doInitSamples();
    }
  }, [isFetched, allMedicines, doInitSamples]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate({ to: "/search", search: { q: searchTerm } });
    }
  };

  const popularSearches = [
    "Ibuprofen",
    "Amoxicillin",
    "Metformin",
    "Lisinopril",
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-teal-100 px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-foreground mb-4">
              Your Complete Guide to{" "}
              <span className="text-teal-700">Medicine</span> Information
            </h1>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              Search thousands of medicines, scan barcodes to instantly identify
              pills, and get accurate dosage &amp; safety information.
            </p>

            <form onSubmit={handleSearch}>
              <div className="bg-teal-700 rounded-2xl p-3 flex items-center gap-3 shadow-card">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a medicine..."
                  className="flex-1 bg-white rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  data-ocid="search.input"
                />
                <button
                  type="submit"
                  className="w-11 h-11 rounded-xl bg-teal-500 hover:bg-teal-600 flex items-center justify-center text-white transition-colors shrink-0"
                  aria-label="Search"
                  data-ocid="search.submit_button"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            <p className="text-xs text-muted-foreground mt-3">
              <span className="font-semibold">Popular Searches:</span>{" "}
              {popularSearches.map((s, i) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => navigate({ to: "/search", search: { q: s } })}
                  className="text-teal-700 font-semibold hover:underline"
                  data-ocid={`search.link.${i + 1}`}
                >
                  {s}
                  {i < popularSearches.length - 1 ? ", " : ""}
                </button>
              ))}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col gap-5">
              <div className="flex gap-5 items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground leading-tight mb-2">
                    Instantly Identify
                    <br />
                    Your Pills!
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    Use your camera to scan a pill barcode and get instant
                    detailed information.
                  </p>
                  <Button
                    onClick={() => navigate({ to: "/scanner" })}
                    className="bg-teal-700 hover:bg-teal-600 text-white rounded-full font-semibold px-6"
                    data-ocid="hero.primary_button"
                  >
                    Start Scanning
                  </Button>
                </div>
                <img
                  src="/assets/generated/hero-scan-illustration.dim_400x320.png"
                  alt="Scan pills"
                  className="w-32 h-28 object-cover rounded-xl flex-shrink-0"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Medicines */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-2xl font-bold text-center text-foreground mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Featured Medicine Summaries
          </motion.h2>

          {featuredLoading ? (
            <div
              className="flex justify-center py-12"
              data-ocid="medicine.loading_state"
            >
              <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {(featured ?? []).slice(0, 3).map((m, i) => (
                <motion.div
                  key={m.id.toString()}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <MedicineCard medicine={m} index={i + 1} />
                </motion.div>
              ))}
              {(featured ?? []).length === 0 && (
                <div
                  className="col-span-3 text-center py-12 text-muted-foreground"
                  data-ocid="medicine.empty_state"
                >
                  No featured medicines yet.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-teal-50 px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8">
              How MedInfo Works
            </h2>
            <div className="flex gap-8 flex-wrap">
              {[
                {
                  icon: Search,
                  label: "Search",
                  desc: "Type the name of any medicine to find detailed info instantly.",
                },
                {
                  icon: ScanLine,
                  label: "Scan",
                  desc: "Point your camera at a barcode to identify pills automatically.",
                },
                {
                  icon: Info,
                  label: "Information",
                  desc: "Get full details: dosage, side effects, warnings & more.",
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center flex-1 min-w-[100px]"
                >
                  <div className="w-14 h-14 rounded-full bg-teal-200 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-teal-700" />
                  </div>
                  <p className="font-bold text-sm text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Trust &amp; Safety
            </h2>
            <div className="space-y-5">
              {[
                {
                  title: "Verified Medical Data",
                  sub: "All medicine information is sourced from trusted pharmaceutical databases and regularly updated.",
                },
                {
                  title: "Privacy First",
                  sub: "Your searches and scans are processed locally. We do not store personal health queries.",
                },
              ].map(({ title, sub }) => (
                <div key={title} className="flex gap-4 items-start">
                  <CheckCircle className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
