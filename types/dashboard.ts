export interface Token {
  creditClientId: string | null;
  state: "active" | "terminated";
}

export interface TSEDetail {
  storageCapacity: number | null;
  storageUsed: number | null;
}

export interface TSEData {
  tseSerialNumber: string;
  creditClientId: string;
  detail: TSEDetail;
}

export interface StorageMetrics {
  totalCapacity: number;
  totalUsed: number;
  devicesWithStorageData: number;
  totalDevices: number;
}

export interface Stat {
  title: string;
  value: number;
  description: string;
}