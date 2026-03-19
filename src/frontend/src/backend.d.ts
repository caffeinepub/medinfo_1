import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Medicine {
    id: bigint;
    featured: boolean;
    manufacturer: string;
    dosage: string;
    name: string;
    uses: string;
    warnings: string;
    barcode: string;
    genericName: string;
    category: string;
    sideEffects: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMedicine(medicine: Medicine): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMedicine(id: bigint): Promise<void>;
    getAllMedicines(): Promise<Array<Medicine>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedMedicines(): Promise<Array<Medicine>>;
    getMedicine(id: bigint): Promise<Medicine>;
    getMedicineByBarcode(barcode: string): Promise<Medicine>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasAnyAdmin(): Promise<boolean>;
    initializeSamples(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchMedicines(searchTerm: string): Promise<Array<Medicine>>;
    setFeatured(id: bigint, featured: boolean): Promise<void>;
    updateMedicine(id: bigint, updatedMedicine: Medicine): Promise<void>;
}
