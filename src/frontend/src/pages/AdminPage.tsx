import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lock, Plus, ShieldCheck, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Medicine } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddMedicine,
  useClaimAdmin,
  useDeleteMedicine,
  useGetAllMedicines,
  useHasAnyAdmin,
  useIsCallerAdmin,
  useSetFeatured,
} from "../hooks/useQueries";

const emptyForm = (): Omit<Medicine, "id"> => ({
  name: "",
  genericName: "",
  category: "",
  manufacturer: "",
  barcode: "",
  uses: "",
  dosage: "",
  sideEffects: "",
  warnings: "",
  featured: false,
});

export default function AdminPage() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: hasAnyAdmin, isLoading: hasAnyAdminLoading } = useHasAnyAdmin();
  const { data: medicines, isLoading: medsLoading } = useGetAllMedicines();
  const addMedicine = useAddMedicine();
  const deleteMedicine = useDeleteMedicine();
  const setFeatured = useSetFeatured();
  const claimAdmin = useClaimAdmin();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Omit<Medicine, "id">>(emptyForm());

  if (!isAuthenticated) {
    return (
      <div
        className="max-w-lg mx-auto px-6 py-20 text-center"
        data-ocid="admin.panel"
      >
        <Lock className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Admin Access Required
        </h2>
        <p className="text-muted-foreground mb-6">
          Please sign in to access the admin panel.
        </p>
        <Button
          onClick={login}
          className="bg-teal-700 hover:bg-teal-600 text-white rounded-full px-8"
          data-ocid="admin.primary_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (adminLoading || hasAnyAdminLoading) {
    return (
      <div
        className="flex justify-center items-center min-h-[50vh]"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-10 h-10 animate-spin text-teal-700" />
      </div>
    );
  }

  if (!isAdmin) {
    // No admin has been set up yet — allow first user to claim admin
    if (!hasAnyAdmin) {
      return (
        <div
          className="max-w-lg mx-auto px-6 py-20 flex flex-col items-center"
          data-ocid="admin.panel"
        >
          <Card className="w-full border-teal-200 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-teal-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Become Admin</CardTitle>
              <CardDescription className="text-base mt-1">
                No admin has been set up yet. As the first user, you can claim
                admin access.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4">
              <Button
                onClick={async () => {
                  try {
                    await claimAdmin.mutateAsync();
                    toast.success("You are now admin!");
                  } catch {
                    toast.error("Failed to claim admin. Please try again.");
                  }
                }}
                disabled={claimAdmin.isPending}
                className="bg-teal-700 hover:bg-teal-600 text-white rounded-full px-10 py-5 text-base font-semibold"
                data-ocid="admin.primary_button"
              >
                {claimAdmin.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <ShieldCheck className="w-5 h-5 mr-2" />
                )}
                Claim Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div
        className="max-w-lg mx-auto px-6 py-20 text-center"
        data-ocid="admin.error_state"
      >
        <Lock className="w-14 h-14 text-destructive mx-auto mb-4 opacity-60" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Access Denied
        </h2>
        <p className="text-muted-foreground">
          You do not have admin privileges to view this page.
        </p>
      </div>
    );
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMedicine.mutateAsync({ ...form, id: BigInt(0) });
      toast.success("Medicine added successfully!");
      setForm(emptyForm());
      setDialogOpen(false);
    } catch {
      toast.error("Failed to add medicine.");
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm("Delete this medicine?")) return;
    try {
      await deleteMedicine.mutateAsync(id);
      toast.success("Medicine deleted.");
    } catch {
      toast.error("Failed to delete medicine.");
    }
  };

  const handleToggleFeatured = async (id: bigint, current: boolean) => {
    try {
      await setFeatured.mutateAsync({ id, featured: !current });
      toast.success(`Medicine ${!current ? "featured" : "unfeatured"}.`);
    } catch {
      toast.error("Failed to update featured status.");
    }
  };

  const fields: Array<{
    key: keyof Omit<Medicine, "id" | "featured">;
    label: string;
    multi?: boolean;
  }> = [
    { key: "name", label: "Medicine Name" },
    { key: "genericName", label: "Generic Name" },
    { key: "category", label: "Category" },
    { key: "manufacturer", label: "Manufacturer" },
    { key: "barcode", label: "Barcode" },
    { key: "uses", label: "Uses", multi: true },
    { key: "dosage", label: "Dosage", multi: true },
    { key: "sideEffects", label: "Side Effects", multi: true },
    { key: "warnings", label: "Warnings", multi: true },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10" data-ocid="admin.panel">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage medicines in the database.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-teal-700 hover:bg-teal-600 text-white rounded-full font-semibold"
              data-ocid="admin.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-2xl max-h-[80vh] overflow-y-auto"
            data-ocid="admin.dialog"
          >
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
              {fields.map(({ key, label, multi }) => (
                <div key={key}>
                  <Label
                    htmlFor={key}
                    className="text-sm font-medium mb-1 block"
                  >
                    {label}
                  </Label>
                  {multi ? (
                    <Textarea
                      id={key}
                      value={form[key] as string}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      rows={2}
                      required
                      data-ocid="admin.textarea"
                    />
                  ) : (
                    <Input
                      id={key}
                      value={form[key] as string}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      required
                      data-ocid="admin.input"
                    />
                  )}
                </div>
              ))}
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) =>
                    setForm((prev) => ({ ...prev, featured: v }))
                  }
                  id="featured"
                  data-ocid="admin.switch"
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-600 text-white rounded-full flex-1"
                  disabled={addMedicine.isPending}
                  data-ocid="admin.submit_button"
                >
                  {addMedicine.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Add Medicine
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="rounded-full"
                  data-ocid="admin.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {medsLoading ? (
        <div
          className="flex justify-center py-16"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
        </div>
      ) : (
        <div
          className="bg-card rounded-xl shadow-card overflow-hidden"
          data-ocid="admin.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Manufacturer</TableHead>
                <TableHead className="font-semibold">Barcode</TableHead>
                <TableHead className="font-semibold text-center">
                  Featured
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(medicines ?? []).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.empty_state"
                  >
                    No medicines in the database yet.
                  </TableCell>
                </TableRow>
              ) : (
                (medicines ?? []).map((m, i) => (
                  <TableRow
                    key={m.id.toString()}
                    data-ocid={`admin.row.${i + 1}`}
                  >
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>
                      <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {m.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {m.manufacturer}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-mono">
                      {m.barcode}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(m.id, m.featured)}
                        aria-label={m.featured ? "Unfeature" : "Feature"}
                        className="hover:opacity-70 transition-opacity"
                        data-ocid={`admin.toggle.${i + 1}`}
                      >
                        <Star
                          className={`w-5 h-5 ${m.featured ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`}
                        />
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(m.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        data-ocid={`admin.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
