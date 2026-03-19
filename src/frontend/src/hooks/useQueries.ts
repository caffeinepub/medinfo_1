import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Medicine } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllMedicines() {
  const { actor, isFetching } = useActor();
  return useQuery<Medicine[]>({
    queryKey: ["medicines"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMedicines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedMedicines() {
  const { actor, isFetching } = useActor();
  return useQuery<Medicine[]>({
    queryKey: ["medicines", "featured"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedMedicines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMedicine(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Medicine>({
    queryKey: ["medicine", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) throw new Error("No actor or id");
      return actor.getMedicine(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSearchMedicines(term: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Medicine[]>({
    queryKey: ["medicines", "search", term],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchMedicines(term);
    },
    enabled: !!actor && !isFetching && term.length > 0,
  });
}

export function useGetMedicineByBarcode(barcode: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Medicine>({
    queryKey: ["medicine", "barcode", barcode],
    queryFn: async () => {
      if (!actor || !barcode) throw new Error("No actor or barcode");
      return actor.getMedicineByBarcode(barcode);
    },
    enabled: !!actor && !isFetching && !!barcode,
    retry: false,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHasAnyAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["hasAnyAdmin"],
    queryFn: async () => {
      if (!actor) return true; // default safe
      return (actor as any).hasAnyAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClaimAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await (actor as any).claimAdmin();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["hasAnyAdmin"] });
    },
  });
}

export function useInitializeSamples() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.initializeSamples();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
}

export function useAddMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (medicine: Medicine) => {
      if (!actor) throw new Error("No actor");
      await actor.addMedicine(medicine);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
}

export function useUpdateMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      medicine,
    }: { id: bigint; medicine: Medicine }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateMedicine(id, medicine);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
}

export function useDeleteMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      await actor.deleteMedicine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
}

export function useSetFeatured() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, featured }: { id: bigint; featured: boolean }) => {
      if (!actor) throw new Error("No actor");
      await actor.setFeatured(id, featured);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
}
