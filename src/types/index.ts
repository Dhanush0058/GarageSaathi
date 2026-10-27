// TypeScript Domain Interfaces for GarageSaarthi Vehicle Inspection

export type UserRole = 'admin' | 'owner' | 'manager' | 'inspector' | 'reviewer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  branchId?: string;
  branchName?: string;
}

export interface Customer {
  id: string;
  organizationId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  organizationId: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  registrationNumber: string;
  make: string;
  model: string;
  variant?: string;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  vin?: string;
  engineNumber?: string;
  odometer: number;
  fuelLevel: 'Empty' | '1/4' | '1/2' | '3/4' | 'Full';
  manufacturingYear?: number;
  color?: string;
  photoUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type InspectionStatusType = 'draft' | 'in_progress' | 'completed' | 'approved';

export type CheckResultStatus = 'PASS' | 'FAIL' | 'PENDING';

export interface InspectionItemResult {
  id: string;
  inspectionId: string;
  itemId: string;
  categoryName: string;
  categoryCode: string;
  subsectionName: string;
  itemName: string;
  itemOrder: number;
  status: CheckResultStatus;
  remarks?: string;
  isMandatory?: boolean;
  referenceValue?: string;
  evidencePhotoIds?: string[];
  updatedAt: string;
}

export interface InspectionPhoto {
  id: string;
  inspectionId: string;
  resultId?: string;
  categoryCode?: string;
  localUri?: string;
  storagePath?: string;
  fileName: string;
  fileSize?: number;
  mimeType: string;
  caption?: string;
  photoType: 'vehicle_front' | 'vehicle_rear' | 'vehicle_odometer' | 'evidence_fail' | 'supporting_doc' | 'general';
  syncStatus: 'synced' | 'pending_upload' | 'failed';
  uploadedBy?: string;
  createdAt: string;
}

export interface Inspection {
  id: string;
  organizationId: string;
  branchId?: string;
  reportId: string; // e.g. PDI-000028
  customerId: string;
  customer?: Customer;
  vehicleId: string;
  vehicle?: Vehicle;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string; // ISO string
  status: InspectionStatusType;
  odometer: number;
  fuelLevel: 'Empty' | '1/4' | '1/2' | '3/4' | 'Full';
  dealerSource?: string;
  inspectionType: 'PDI' | 'General Inspection' | 'Pre-Purchase Inspection' | 'Insurance Verification';
  notes?: string;
  
  // Calculated Score Metrics
  totalItems: number;
  scoredItems: number;
  passedItems: number;
  failedItems: number;
  pendingItems: number;
  passPercentage: number;
  completionPercentage: number;
  
  // Results and Evidence
  results?: Record<string, InspectionItemResult>; // keyed by itemId
  photos?: InspectionPhoto[];
  
  completedAt?: string;
  certifiedBy?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  isOfflineDraft?: boolean;
}

export interface CategorySummary {
  code: string;
  name: string;
  shortLabel: string;
  total: number;
  passed: number;
  failed: number;
  pending: number;
  passPercentage: number;
  completionPercentage: number;
}
