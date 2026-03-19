import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Camera,
  Loader2,
  RotateCcw,
  ScanLine,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useGetMedicineByBarcode } from "../hooks/useQueries";
import { useQRScanner } from "../qr-code/useQRScanner";

export default function ScannerPage() {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

  const {
    qrResults,
    isActive,
    isSupported,
    error,
    isLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    switchCamera,
    clearResults,
    videoRef,
    canvasRef,
  } = useQRScanner({
    facingMode: "environment",
    scanInterval: 150,
    maxResults: 5,
  });

  useEffect(() => {
    if (qrResults.length > 0 && !scannedBarcode) {
      const latest = qrResults[0].data;
      setScannedBarcode(latest);
      stopScanning();
    }
  }, [qrResults, scannedBarcode, stopScanning]);

  const {
    data: medicine,
    isLoading: medLoading,
    isError,
  } = useGetMedicineByBarcode(scannedBarcode);

  const handleReset = () => {
    setScannedBarcode(null);
    clearResults();
  };

  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Medicine Scanner
        </h1>
        <p className="text-muted-foreground">
          Scan a pill bottle or blister pack barcode to identify the medicine
          instantly.
        </p>
      </div>

      {isSupported === false && (
        <div
          className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center"
          data-ocid="scanner.error_state"
        >
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-semibold">
            Camera not supported on this device.
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Please use a device with a camera to use the scanner.
          </p>
        </div>
      )}

      {isSupported !== false && !scannedBarcode && (
        <div
          className="bg-card rounded-2xl shadow-card overflow-hidden"
          data-ocid="scanner.panel"
        >
          <div className="relative bg-foreground/5 aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50">
                <ScanLine className="w-16 h-16 text-white/60" />
                <p className="text-white/80 text-sm">
                  Camera preview will appear here
                </p>
              </div>
            )}

            {isActive && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-32 border-2 border-teal-400 rounded-lg opacity-80">
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-teal-400 rounded-tl" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-teal-400 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-teal-400 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-teal-400 rounded-br" />
                </div>
              </div>
            )}
          </div>

          <div className="p-5">
            {error && (
              <div
                className="flex items-center gap-2 text-destructive text-sm mb-4 bg-destructive/10 rounded-lg p-3"
                data-ocid="scanner.error_state"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error.message}</span>
              </div>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                onClick={startScanning}
                disabled={!canStartScanning || isLoading}
                className="bg-teal-700 hover:bg-teal-600 text-white rounded-full font-semibold px-6"
                data-ocid="scanner.primary_button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Starting...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" /> Start Scanning
                  </>
                )}
              </Button>

              {isActive && (
                <Button
                  variant="outline"
                  onClick={stopScanning}
                  disabled={isLoading}
                  className="rounded-full"
                  data-ocid="scanner.secondary_button"
                >
                  <X className="w-4 h-4 mr-2" /> Stop
                </Button>
              )}

              {isMobile && isActive && (
                <Button
                  variant="outline"
                  onClick={switchCamera}
                  disabled={isLoading}
                  className="rounded-full"
                  data-ocid="scanner.toggle"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Flip Camera
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Point the camera at a barcode on a medicine package.
            </p>
          </div>
        </div>
      )}

      {scannedBarcode && (
        <div className="space-y-6" data-ocid="scanner.panel">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Scanned Barcode
              </p>
              <p className="font-mono font-semibold text-teal-700">
                {scannedBarcode}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              data-ocid="scanner.secondary_button"
            >
              <RotateCcw className="w-4 h-4 mr-1" /> Scan Again
            </Button>
          </div>

          {medLoading && (
            <div
              className="flex justify-center py-10"
              data-ocid="scanner.loading_state"
            >
              <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
            </div>
          )}

          {isError && (
            <div
              className="bg-card rounded-xl shadow-card p-8 text-center"
              data-ocid="scanner.error_state"
            >
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-foreground">
                Medicine Not Found
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                No medicine was found matching barcode{" "}
                <strong>{scannedBarcode}</strong>.
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Try scanning a different barcode or search manually.
              </p>
              <Button
                className="mt-5 bg-teal-700 hover:bg-teal-600 text-white rounded-full"
                onClick={handleReset}
                data-ocid="scanner.primary_button"
              >
                Try Again
              </Button>
            </div>
          )}

          {medicine && (
            <div
              className="bg-card rounded-xl shadow-card overflow-hidden"
              data-ocid="scanner.success_state"
            >
              <div className="bg-teal-200 px-6 py-5">
                <span className="text-xs font-semibold text-teal-700 bg-white/80 px-2 py-0.5 rounded-full">
                  {medicine.category}
                </span>
                <h2 className="text-2xl font-bold text-foreground mt-2">
                  {medicine.name}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {medicine.genericName} · {medicine.manufacturer}
                </p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "Uses", value: medicine.uses },
                  { label: "Dosage", value: medicine.dosage },
                  { label: "Side Effects", value: medicine.sideEffects },
                  { label: "Warnings", value: medicine.warnings },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <Link
                  to="/medicine/$id"
                  params={{ id: medicine.id.toString() }}
                >
                  <Button
                    className="bg-teal-700 hover:bg-teal-600 text-white rounded-full font-semibold px-6"
                    data-ocid="scanner.primary_button"
                  >
                    View Full Details
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
