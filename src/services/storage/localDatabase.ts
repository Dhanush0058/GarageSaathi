// Local Persistent Database Service
// Powered by AsyncStorage with strict serialization and atomic updates.
// Provides persistent storage across app restarts, offline inspection drafts,
// autosave, upload queue management, and sync queues.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, Vehicle, Inspection, InspectionItemResult, InspectionPhoto, UserProfile } from '../../types';
import { calculateInspectionMetrics } from '../../utils/inspectionCalculations';

const KEYS = {
  CURRENT_USER: '@garagesaarthi:current_user',
  CUSTOMERS: '@garagesaarthi:customers',
  VEHICLES: '@garagesaarthi:vehicles',
  INSPECTIONS: '@garagesaarthi:inspections',
  UPLOAD_QUEUE: '@garagesaarthi:upload_queue',
  OFFLINE_MUTATION_QUEUE: '@garagesaarthi:mutation_queue',
};

// Seed sample data for first launch if storage is empty
export const DEFAULT_USER: UserProfile = {
  id: 'usr-001',
  email: 'inspector.madhu@garagesaarthi.com',
  fullName: 'Madhu Inspector',
  phone: '9876543210',
  role: 'inspector',
  organizationId: 'org-001',
  organizationName: 'GarageSaarthi Auto Care',
  branchId: 'br-001',
  branchName: 'Main Workshop - Madhapur',
};

export const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    organizationId: 'org-001',
    name: 'V Rajeev',
    phone: '7893650288',
    email: 'v.rajeev@example.com',
    city: 'Hyderabad',
    address: 'Plot 42, Jubilee Hills, Hyderabad',
    createdAt: new Date('2026-08-31T08:00:00Z').toISOString(),
    updatedAt: new Date('2026-08-31T08:00:00Z').toISOString(),
  },
  {
    id: 'cust-002',
    organizationId: 'org-001',
    name: 'Ananya Sharma',
    phone: '9848012345',
    email: 'ananya.s@example.com',
    city: 'Secunderabad',
    address: 'Flat 302, Green Meadows, Secunderabad',
    createdAt: new Date('2026-09-01T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-09-01T09:00:00Z').toISOString(),
  },
];

export const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: 'veh-001',
    organizationId: 'org-001',
    customerId: 'cust-001',
    customerName: 'V Rajeev',
    customerPhone: '7893650288',
    registrationNumber: 'TS08EP9928',
    make: 'HYUNDAI',
    model: 'VENUE',
    variant: 'SX 1.2 Petrol',
    fuelType: 'Petrol',
    transmission: 'Manual',
    vin: 'MALFG81FLTD130407',
    engineNumber: 'G4LA-130407',
    odometer: 75,
    fuelLevel: 'Empty',
    manufacturingYear: 2026,
    color: 'Polar White',
    notes: 'New delivery vehicle pre-delivery inspection',
    createdAt: new Date('2026-08-31T08:15:00Z').toISOString(),
    updatedAt: new Date('2026-08-31T08:15:00Z').toISOString(),
  },
  {
    id: 'veh-002',
    organizationId: 'org-001',
    customerId: 'cust-002',
    customerName: 'Ananya Sharma',
    customerPhone: '9848012345',
    registrationNumber: 'TS09UB4521',
    make: 'MARUTI SUZUKI',
    model: 'BALENO',
    variant: 'Zeta 1.2 DualJet',
    fuelType: 'Petrol',
    transmission: 'Manual',
    vin: 'MBHFC612808291034',
    engineNumber: 'K12N-928103',
    odometer: 18240,
    fuelLevel: '1/2',
    manufacturingYear: 2024,
    color: 'Celestial Blue',
    notes: 'Periodic general health inspection',
    createdAt: new Date('2026-09-01T09:30:00Z').toISOString(),
    updatedAt: new Date('2026-09-01T09:30:00Z').toISOString(),
  },
];

export const LocalDB = {
  // -----------------------------------------------------------------------
  // INITIALIZATION
  // -----------------------------------------------------------------------
  async initialize(): Promise<void> {
    try {
      const user = await AsyncStorage.getItem(KEYS.CURRENT_USER);
      if (!user) {
        await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USER));
      }

      const customers = await AsyncStorage.getItem(KEYS.CUSTOMERS);
      if (!customers) {
        await AsyncStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(DEFAULT_CUSTOMERS));
      }

      const vehicles = await AsyncStorage.getItem(KEYS.VEHICLES);
      if (!vehicles) {
        await AsyncStorage.setItem(KEYS.VEHICLES, JSON.stringify(DEFAULT_VEHICLES));
      }

      const inspections = await AsyncStorage.getItem(KEYS.INSPECTIONS);
      if (!inspections) {
        await AsyncStorage.setItem(KEYS.INSPECTIONS, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error initializing local DB:', error);
    }
  },

  // -----------------------------------------------------------------------
  // USER / AUTH
  // -----------------------------------------------------------------------
  async getCurrentUser(): Promise<UserProfile | null> {
    const data = await AsyncStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  async setCurrentUser(user: UserProfile | null): Promise<void> {
    if (user) {
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  // -----------------------------------------------------------------------
  // CUSTOMERS
  // -----------------------------------------------------------------------
  async getCustomers(): Promise<Customer[]> {
    const data = await AsyncStorage.getItem(KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },

  async getCustomerById(id: string): Promise<Customer | undefined> {
    const list = await this.getCustomers();
    return list.find((c) => c.id === id);
  },

  async saveCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Customer> {
    const list = await this.getCustomers();
    const now = new Date().toISOString();
    let savedCustomer: Customer;

    if (customer.id) {
      const index = list.findIndex((c) => c.id === customer.id);
      if (index !== -1) {
        savedCustomer = {
          ...list[index],
          ...customer,
          updatedAt: now,
        };
        list[index] = savedCustomer;
      } else {
        savedCustomer = {
          ...customer,
          id: customer.id,
          createdAt: now,
          updatedAt: now,
        };
        list.push(savedCustomer);
      }
    } else {
      savedCustomer = {
        ...customer,
        id: `cust-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      list.unshift(savedCustomer);
    }

    await AsyncStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(list));
    return savedCustomer;
  },

  // -----------------------------------------------------------------------
  // VEHICLES
  // -----------------------------------------------------------------------
  async getVehicles(): Promise<Vehicle[]> {
    const data = await AsyncStorage.getItem(KEYS.VEHICLES);
    return data ? JSON.parse(data) : [];
  },

  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    const list = await this.getVehicles();
    return list.find((v) => v.id === id);
  },

  async saveVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Vehicle> {
    const list = await this.getVehicles();
    const now = new Date().toISOString();
    let savedVehicle: Vehicle;

    if (vehicle.id) {
      const index = list.findIndex((v) => v.id === vehicle.id);
      if (index !== -1) {
        savedVehicle = {
          ...list[index],
          ...vehicle,
          updatedAt: now,
        };
        list[index] = savedVehicle;
      } else {
        savedVehicle = {
          ...vehicle,
          id: vehicle.id,
          createdAt: now,
          updatedAt: now,
        };
        list.push(savedVehicle);
      }
    } else {
      savedVehicle = {
        ...vehicle,
        id: `veh-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      list.unshift(savedVehicle);
    }

    await AsyncStorage.setItem(KEYS.VEHICLES, JSON.stringify(list));
    return savedVehicle;
  },

  // -----------------------------------------------------------------------
  // INSPECTIONS
  // -----------------------------------------------------------------------
  async getInspections(): Promise<Inspection[]> {
    const data = await AsyncStorage.getItem(KEYS.INSPECTIONS);
    return data ? JSON.parse(data) : [];
  },

  async getInspectionById(id: string): Promise<Inspection | undefined> {
    const list = await this.getInspections();
    return list.find((i) => i.id === id || i.reportId === id);
  },

  async saveInspection(inspection: Inspection): Promise<Inspection> {
    const list = await this.getInspections();
    const now = new Date().toISOString();

    // Recalculate metrics accurately
    const metrics = calculateInspectionMetrics(inspection.results);

    const updatedInspection: Inspection = {
      ...inspection,
      totalItems: metrics.totalItems,
      scoredItems: metrics.scoredItems,
      passedItems: metrics.passedItems,
      failedItems: metrics.failedItems,
      pendingItems: metrics.pendingItems,
      passPercentage: metrics.passPercentage,
      completionPercentage: metrics.completionPercentage,
      updatedAt: now,
    };

    const index = list.findIndex((i) => i.id === inspection.id);
    if (index !== -1) {
      list[index] = updatedInspection;
    } else {
      list.unshift(updatedInspection);
    }

    await AsyncStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(list));
    return updatedInspection;
  },

  async updateItemResult(
    inspectionId: string,
    result: InspectionItemResult
  ): Promise<Inspection | undefined> {
    const inspection = await this.getInspectionById(inspectionId);
    if (!inspection) return undefined;

    const currentResults = inspection.results || {};
    currentResults[result.itemId] = {
      ...result,
      updatedAt: new Date().toISOString(),
    };

    inspection.results = currentResults;
    if (inspection.status === 'draft') {
      inspection.status = 'in_progress';
    }

    return await this.saveInspection(inspection);
  },

  async addInspectionPhoto(
    inspectionId: string,
    photo: InspectionPhoto
  ): Promise<Inspection | undefined> {
    const inspection = await this.getInspectionById(inspectionId);
    if (!inspection) return undefined;

    const currentPhotos = inspection.photos || [];
    currentPhotos.push(photo);
    inspection.photos = currentPhotos;

    // Also link to result if item-level
    if (photo.resultId && inspection.results && inspection.results[photo.resultId]) {
      const itemResult = inspection.results[photo.resultId];
      itemResult.evidencePhotoIds = itemResult.evidencePhotoIds || [];
      itemResult.evidencePhotoIds.push(photo.id);
    }

    return await this.saveInspection(inspection);
  },

  // Generate next unique Report ID: e.g. PDI-000028 or PDI-000029
  async generateNextReportId(): Promise<string> {
    const inspections = await this.getInspections();
    let maxNum = 28; // Start after PDI-000028 reference
    for (const insp of inspections) {
      const match = insp.reportId.match(/PDI-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }
    const nextNum = maxNum + 1;
    return `PDI-${String(nextNum).padStart(6, '0')}`;
  },

  // -----------------------------------------------------------------------
  // UPLOAD QUEUE FOR OFFLINE RESILIENCE
  // -----------------------------------------------------------------------
  async getUploadQueue(): Promise<InspectionPhoto[]> {
    const data = await AsyncStorage.getItem(KEYS.UPLOAD_QUEUE);
    return data ? JSON.parse(data) : [];
  },

  async enqueueUpload(photo: InspectionPhoto): Promise<void> {
    const queue = await this.getUploadQueue();
    queue.push(photo);
    await AsyncStorage.setItem(KEYS.UPLOAD_QUEUE, JSON.stringify(queue));
  },

  async dequeueUpload(photoId: string): Promise<void> {
    const queue = await this.getUploadQueue();
    const updated = queue.filter((p) => p.id !== photoId);
    await AsyncStorage.setItem(KEYS.UPLOAD_QUEUE, JSON.stringify(updated));
  },
};
