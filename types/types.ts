export interface Token {
  creditClientId?: string
  metadata?: string
  state?: string
  tseSerialNumbers?: string[]
  productTypes?: string[]
  tseCount?: number
}


// TSE Dashboard types
export interface ProductTypeUsage {
  signatureLimit: number;
  signaturesCurrentMonth: number;
  signatureDuration: number;
  slowdownActiveSignatureDuration: number;
  slowdownInactiveSignatureDuration: number;
  billingPeriodMonths: number;
}

export interface DashboardData {
  serialNumber: string;
  certificationId: string;
  storageUsed: number;
  storageCapacity: number;
  numRegisteredClients: number;
  createdSignatures: number;
  numStartedTransactions: number;
  softwareVersion: string;
  productTypeUsage?: ProductTypeUsage;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor?: string;
}


// credit token types
export interface TSE {
  tseSerialNumber: string;
  productType: string;
  // Add more fields if applicable
}

// Enriched Token for the table
export interface EnrichedToken extends Token {
  tseCount: number;
  tseSerialNumbers: string[];
  productTypes: string[];
}