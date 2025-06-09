export interface Sample {
  id: string;
  metrcId?: string;
  sampleName: string;
  clientName: string;
  receivedDate: string;
  sampleType: 'Flower' | 'Concentrate' | 'Edible' | 'Pre-Roll' | 'Other';
  category: 'Adult Use' | 'Medical' | 'Research';
  targetPotency?: number;
  requiredTests: string[];
  status: 'Received' | 'Batched' | 'In Prep' | 'Ready for Analysis' | 'In Analysis' | 'Complete' | 'Reported';
  weight?: number;
  notes?: string;
  prepBatchId?: string;
  analyticalBatchId?: string;
  results?: SampleResult[];
  qcStatus?: 'Pass' | 'Fail' | 'Pending';
}

export interface Assay {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  sopId?: string;
  analytes: Analyte[];
  qcTypes: QCType[];
  maxSamplesPerBatch?: number;
  minSamplesPerBatch?: number;
  version: string;
  revisionHistory: SOPRevision[];
}

export interface SOPRevision {
  id: string;
  version: string;
  effectiveDate: string;
  changes: string[];
  author: string;
  approvedBy?: string;
  approvalDate?: string;
  status: 'Draft' | 'Pending' | 'Active' | 'Superseded';
}

export interface Analyte {
  id: string;
  name: string;
  unit: string;
  reportingLimit: number;
  actionLimit?: number;
  warningLimit?: number;
  effectiveDate: string;
}

export interface QCType {
  id: string;
  name: string;
  description: string;
  frequency: number;
  limits: {
    lower: number;
    upper: number;
  };
}

export interface PrepBatch {
  id: string;
  samples: string[];
  assayType: string;
  status: 'In Progress' | 'Ready for Analysis' | 'Complete';
  analyst: string;
  createdDate: string;
  metadata: {
    reagents: ReagentUsage[];
    equipment: string[];
    extractionDate?: string;
    notes?: string;
  };
}

export interface AnalyticalBatch {
  id: string;
  prepBatches: string[];
  assayType: string;
  status: 'In Progress' | 'Data Entry' | 'QC Review' | 'Approved';
  analyst: string;
  instrument: string;
  calibrationData: CalibrationData;
  qcSamples: QCSample[];
  results: SampleResult[];
  createdDate: string;
  sequenceGenerated?: boolean;
  dataFilesUploaded?: boolean;
}

export interface ReagentUsage {
  reagentId: string;
  lotNumber: string;
  expirationDate: string;
  volumeUsed: number;
}

export interface InventoryItem {
  id: string;
  nctlId: string;
  name: string;
  manufacturer: string;
  lotNumber: string;
  vendor: string;
  receivedDate: string;
  expirationDate: string;
  quantity: number;
  packagesReceived: number;
  itemsPerPackage: number;
  category: 'Chemical' | 'Reagent' | 'Standard' | 'Equipment' | 'Consumable';
  documents: Document[];
  status: 'Active' | 'Expired' | 'Low Stock' | 'Out of Stock';
}

export interface Document {
  id: string;
  name: string;
  type: 'SDS' | 'COA' | 'Manual' | 'Other';
  url: string;
}

export interface SOP {
  id: string;
  title: string;
  version: string;
  assayType: string;
  effectiveDate: string;
  content: SOPContent;
  isActive: boolean;
  revisionHistory: SOPRevision[];
  author: string;
  approvedBy?: string;
  approvalDate?: string;
}

export interface SOPContent {
  analytes: Analyte[];
  qcRequirements: QCType[];
  procedures: string[];
  metadata: MetadataField[];
  batchSizeRequirements: {
    min: number;
    max: number;
    optimal: number;
  };
}

export interface MetadataField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  options?: string[];
}

export interface CalibrationData {
  curves: CalibrationCurve[];
  blanks: number[];
  ccv: number;
  createdDate: string;
}

export interface CalibrationCurve {
  analyte: string;
  points: { concentration: number; response: number }[];
  rSquared: number;
}

export interface QCSample {
  id: string;
  type: 'CCV' | 'MRL' | 'HCV' | 'LCV' | 'Blank' | 'Spike';
  analyte: string;
  expectedValue?: number;
  actualValue?: number;
  result?: 'Pass' | 'Fail' | 'Warning';
  runDate?: string;
  batchId?: string;
}

export interface SampleResult {
  sampleId: string;
  analyte: string;
  result: number;
  unit: string;
  dilutionFactor: number;
  finalResult: number;
  uncertainty?: number;
  flag?: string;
  excluded?: boolean;
  excludeReason?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  isActive: boolean;
}

export interface UserRole {
  assayType: string;
  role: 'Prep' | 'Analysis' | 'Admin' | 'Receiving' | 'QC Manager';
}

export interface CoA {
  id: string;
  sampleId: string;
  clientInfo: ClientInfo;
  results: CoAResult[];
  qcData: QCData;
  generatedDate: string;
  signedBy: string;
  labInfo: LabInfo;
}

export interface LabInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
  scientificDirector: string;
  certifications: string[];
}

export interface ClientInfo {
  name: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface CoAResult {
  analyte: string;
  result: number;
  unit: string;
  limit?: number;
  status: 'Pass' | 'Fail';
  method: string;
  uncertainty?: number;
}

export interface QCData {
  methodBlank: boolean;
  matrixSpike: boolean;
  duplicateAnalysis: boolean;
  referenceStandard: boolean;
  ccvResult?: number;
  batchQuality: 'Pass' | 'Fail';
}

export interface QCChart {
  analyte: string;
  qcType: string;
  data: QCDataPoint[];
  controlLimits: {
    mean: number;
    upperControl: number;
    lowerControl: number;
    upperWarning: number;
    lowerWarning: number;
    upperAction: number;
    lowerAction: number;
  };
}

export interface QCDataPoint {
  date: string;
  value: number;
  batchId: string;
  status: 'Pass' | 'Warning' | 'Fail';
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  location: string;
  status: 'Active' | 'Maintenance' | 'Out of Service';
  lastCalibration?: string;
  nextCalibration?: string;
  maintenanceHistory: MaintenanceRecord[];
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'Calibration' | 'Maintenance' | 'Repair';
  description: string;
  technician: string;
  cost?: number;
  documents?: string[];
}

export interface Reagent {
  id: string;
  name: string;
  manufacturer: string;
  catalogNumber: string;
  currentLots: ReagentLot[];
  storageConditions: string;
  hazardClass?: string;
  sdsDocument?: string;
}

export interface ReagentLot {
  lotNumber: string;
  receivedDate: string;
  expirationDate: string;
  quantity: number;
  unit: string;
  status: 'Active' | 'Expired' | 'Low' | 'Empty';
  location: string;
}