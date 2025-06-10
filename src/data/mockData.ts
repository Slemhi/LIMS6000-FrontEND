// Updated mock data to include RSA test type in sample required tests
import { Sample, Assay, PrepBatch, AnalyticalBatch, InventoryItem, SOP, User, RoleDefinition, Permission } from '../types';

// Helper function to generate random samples
const generateRandomSamples = (): Sample[] => {
  const sampleTypes = ['Flower', 'Concentrate', 'Edible', 'Pre-Roll', 'Other'];
  const categories = ['Adult Use', 'Medical', 'Research'];
  const statuses = ['Received', 'Batched', 'In Prep', 'Ready for Analysis', 'In Analysis', 'Complete', 'Reported'];
  const testTypes = ['POT', 'PES', 'HMT', 'SOL', 'RSA', 'NUT', 'MIC']; // Added RSA

  const clientNames = [
    'Green Valley Farms', 'Premium Extracts', 'Tasty Treats Co', 'Mountain High Cannabis',
    'Coastal Cultivation', 'Desert Bloom', 'Pacific Cannabis Co', 'Northern Lights Farm',
    'Golden State Extracts', 'Emerald Triangle', 'Sunset Cannabis', 'Alpine Organics',
    'Redwood Remedies', 'Valley Verde', 'Ocean Breeze Cannabis', 'Sierra Nevada Farms',
    'Bay Area Botanicals', 'Central Valley Cannabis', 'Humboldt Heritage', 'Mendocino Magic',
    'Santa Barbara Strains', 'Orange County Organics', 'San Diego Selections', 'Riverside Remedies',
    'Ventura Valley', 'Monterey Meds', 'Fresno Farms', 'Sacramento Selections', 'Stockton Strains',
    'Modesto Meds', 'Bakersfield Botanicals', 'Visalia Verde', 'Salinas Selections', 'Napa Naturals'
  ];

  const strainNames = [
    'Blue Dream', 'OG Kush', 'Girl Scout Cookies', 'Sour Diesel', 'White Widow',
    'Purple Haze', 'Jack Herer', 'Granddaddy Purple', 'AK-47', 'Northern Lights',
    'Pineapple Express', 'Bubba Kush', 'Trainwreck', 'Lemon Haze', 'Strawberry Cough',
    'Cheese', 'Skunk #1', 'Amnesia Haze', 'Super Silver Haze', 'Durban Poison',
    'Green Crack', 'Gorilla Glue #4', 'Wedding Cake', 'Gelato', 'Zkittlez',
    'Runtz', 'Sunset Sherbet', 'Do-Si-Dos', 'Cookies and Cream', 'Banana Kush',
    'Mango Kush', 'Blueberry', 'Cherry Pie', 'Tangie', 'Headband',
    'Bruce Banner', 'Death Star', 'Platinum OG', 'Fire OG', 'Tahoe OG'
  ];

  const concentrateTypes = [
    'Live Resin', 'Shatter', 'Wax', 'Rosin', 'Distillate', 'Hash Oil', 'Budder', 'Crumble'
  ];

  const edibleTypes = [
    'Gummies', 'Chocolate', 'Cookies', 'Brownies', 'Hard Candy', 'Mints', 'Beverages', 'Capsules'
  ];

  const samples: Sample[] = [];

  for (let i = 4; i <= 203; i++) {
    const sampleType = sampleTypes[Math.floor(Math.random() * sampleTypes.length)] as any;
    const category = categories[Math.floor(Math.random() * categories.length)] as any;
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
    const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
    
    // Generate sample name based on type
    let sampleName = '';
    if (sampleType === 'Flower') {
      sampleName = `${strainNames[Math.floor(Math.random() * strainNames.length)]} - Flower`;
    } else if (sampleType === 'Concentrate') {
      sampleName = `${strainNames[Math.floor(Math.random() * strainNames.length)]} ${concentrateTypes[Math.floor(Math.random() * concentrateTypes.length)]}`;
    } else if (sampleType === 'Edible') {
      sampleName = `${strainNames[Math.floor(Math.random() * strainNames.length)]} ${edibleTypes[Math.floor(Math.random() * edibleTypes.length)]}`;
    } else if (sampleType === 'Pre-Roll') {
      sampleName = `${strainNames[Math.floor(Math.random() * strainNames.length)]} Pre-Roll`;
    } else {
      sampleName = `${strainNames[Math.floor(Math.random() * strainNames.length)]} Product`;
    }

    // Generate random test combinations - now includes RSA
    const numTests = Math.floor(Math.random() * 4) + 1; // 1-4 tests
    const requiredTests: string[] = [];
    const shuffledTests = [...testTypes].sort(() => 0.5 - Math.random());
    
    for (let j = 0; j < numTests; j++) {
      if (!requiredTests.includes(shuffledTests[j])) {
        requiredTests.push(shuffledTests[j]);
      }
    }

    // Generate random dates within the last 30 days
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const receivedDate = new Date();
    receivedDate.setDate(receivedDate.getDate() - randomDaysAgo);
    const formattedDate = receivedDate.toISOString().split('T')[0];

    // Generate METRC ID for some samples
    const hasMetrcId = Math.random() > 0.3; // 70% chance of having METRC ID
    const metrcId = hasMetrcId ? `1A4FF010000022000001${String(i).padStart(4, '0')}` : undefined;

    // Generate target potency based on sample type
    let targetPotency: number | undefined;
    if (requiredTests.includes('POT')) {
      if (sampleType === 'Flower') {
        targetPotency = Math.random() * 25 + 10; // 10-35%
      } else if (sampleType === 'Concentrate') {
        targetPotency = Math.random() * 40 + 50; // 50-90%
      } else if (sampleType === 'Edible') {
        targetPotency = Math.random() * 20 + 5; // 5-25%
      } else {
        targetPotency = Math.random() * 30 + 15; // 15-45%
      }
      targetPotency = Math.round(targetPotency * 10) / 10; // Round to 1 decimal
    }

    // Generate weight based on sample type
    let weight: number;
    if (sampleType === 'Flower') {
      weight = Math.random() * 5 + 1; // 1-6g
    } else if (sampleType === 'Concentrate') {
      weight = Math.random() * 2 + 0.5; // 0.5-2.5g
    } else if (sampleType === 'Edible') {
      weight = Math.random() * 10 + 2; // 2-12g
    } else {
      weight = Math.random() * 3 + 1; // 1-4g
    }
    weight = Math.round(weight * 10) / 10; // Round to 1 decimal

    // Generate notes for some samples
    const notes = Math.random() > 0.7 ? [
      'High priority sample',
      'Rush analysis requested',
      'Client VIP',
      'Retest required',
      'Special handling needed',
      'Temperature sensitive',
      'Limited sample volume',
      'Quality control check'
    ][Math.floor(Math.random() * 8)] : undefined;

    // Assign batch IDs based on status
    let prepBatchId: string | undefined;
    let analyticalBatchId: string | undefined;
    
    if (status === 'Batched' || status === 'In Prep') {
      prepBatchId = `PB${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`;
    } else if (status === 'Ready for Analysis' || status === 'In Analysis' || status === 'Complete' || status === 'Reported') {
      prepBatchId = `PB${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}`;
      analyticalBatchId = `AB${String(Math.floor(Math.random() * 25) + 1).padStart(3, '0')}`;
    }

    samples.push({
      id: `S${String(i).padStart(3, '0')}`,
      metrcId,
      sampleName,
      clientName,
      receivedDate: formattedDate,
      sampleType,
      category,
      targetPotency,
      requiredTests,
      status,
      weight,
      notes,
      prepBatchId,
      analyticalBatchId
    });
  }

  return samples;
};

export const mockSamples: Sample[] = [
  {
    id: 'S001',
    metrcId: '1A4FF0100000220000010801',
    sampleName: 'Blue Dream - Flower',
    clientName: 'Green Valley Farms',
    receivedDate: '2024-01-15',
    sampleType: 'Flower',
    category: 'Adult Use',
    targetPotency: 22.5,
    requiredTests: ['POT', 'PES', 'HMT'],
    status: 'Received',
    weight: 3.5,
    notes: 'High priority sample'
  },
  {
    id: 'S002',
    sampleName: 'OG Kush Concentrate',
    clientName: 'Premium Extracts',
    receivedDate: '2024-01-16',
    sampleType: 'Concentrate',
    category: 'Medical',
    targetPotency: 78.2,
    requiredTests: ['POT', 'SOL', 'PES'],
    status: 'Batched',
    weight: 1.0,
    prepBatchId: 'PB001'
  },
  {
    id: 'S003',
    sampleName: 'Mixed Berry Gummies',
    clientName: 'Tasty Treats Co',
    receivedDate: '2024-01-17',
    sampleType: 'Edible',
    category: 'Adult Use',
    requiredTests: ['POT', 'HMT', 'NUT'],
    status: 'In Analysis',
    weight: 5.2,
    analyticalBatchId: 'AB001'
  },
  // Add some samples specifically with RSA testing
  {
    id: 'S008',
    sampleName: 'Live Resin Cartridge',
    clientName: 'Premium Extracts',
    receivedDate: '2024-01-20',
    sampleType: 'Concentrate',
    category: 'Adult Use',
    requiredTests: ['POT', 'RSA', 'PES'],
    status: 'Received',
    weight: 0.8,
    notes: 'RSA testing required for cartridge'
  },
  {
    id: 'S009',
    sampleName: 'Shatter Extract',
    clientName: 'Golden State Extracts',
    receivedDate: '2024-01-21',
    sampleType: 'Concentrate',
    category: 'Medical',
    requiredTests: ['POT', 'RSA', 'HMT'],
    status: 'Received',
    weight: 1.2,
    notes: 'High priority RSA analysis'
  },
  ...generateRandomSamples()
];

// Define system permissions
export const mockPermissions: Permission[] = [
  // Sample Management
  { id: 'sample-create', name: 'Create Samples', description: 'Add new samples to the system', category: 'Sample Management', action: 'create', resource: 'samples' },
  { id: 'sample-read', name: 'View Samples', description: 'View sample information', category: 'Sample Management', action: 'read', resource: 'samples' },
  { id: 'sample-update', name: 'Edit Samples', description: 'Modify sample information', category: 'Sample Management', action: 'update', resource: 'samples' },
  { id: 'sample-delete', name: 'Delete Samples', description: 'Remove samples from the system', category: 'Sample Management', action: 'delete', resource: 'samples' },
  
  // Batch Management
  { id: 'batch-create', name: 'Create Batches', description: 'Create prep and analytical batches', category: 'Batch Management', action: 'create', resource: 'batches' },
  { id: 'batch-read', name: 'View Batches', description: 'View batch information', category: 'Batch Management', action: 'read', resource: 'batches' },
  { id: 'batch-update', name: 'Edit Batches', description: 'Modify batch information', category: 'Batch Management', action: 'update', resource: 'batches' },
  { id: 'batch-execute', name: 'Execute Batches', description: 'Perform batch operations', category: 'Batch Management', action: 'execute', resource: 'batches' },
  
  // Analysis
  { id: 'analysis-create', name: 'Create Analysis', description: 'Set up analytical runs', category: 'Analysis', action: 'create', resource: 'analysis' },
  { id: 'analysis-read', name: 'View Analysis', description: 'View analytical data', category: 'Analysis', action: 'read', resource: 'analysis' },
  { id: 'analysis-update', name: 'Edit Analysis', description: 'Modify analytical data', category: 'Analysis', action: 'update', resource: 'analysis' },
  { id: 'analysis-execute', name: 'Execute Analysis', description: 'Run analytical instruments', category: 'Analysis', action: 'execute', resource: 'analysis' },
  
  // QC
  { id: 'qc-read', name: 'View QC Data', description: 'View quality control information', category: 'QC', action: 'read', resource: 'qc' },
  { id: 'qc-approve', name: 'Approve QC', description: 'Approve quality control results', category: 'QC', action: 'approve', resource: 'qc' },
  { id: 'qc-update', name: 'Edit QC Data', description: 'Modify QC information', category: 'QC', action: 'update', resource: 'qc' },
  
  // Administration
  { id: 'admin-users', name: 'Manage Users', description: 'Create, edit, and delete user accounts', category: 'Administration', action: 'update', resource: 'users' },
  { id: 'admin-roles', name: 'Manage Roles', description: 'Create and modify user roles', category: 'Administration', action: 'update', resource: 'roles' },
  { id: 'admin-assays', name: 'Manage Assays', description: 'Create and modify assay configurations', category: 'Administration', action: 'update', resource: 'assays' },
  { id: 'admin-system', name: 'System Settings', description: 'Modify system configuration', category: 'Administration', action: 'update', resource: 'system' },
  
  // Reporting
  { id: 'report-create', name: 'Generate Reports', description: 'Create and generate reports', category: 'Reporting', action: 'create', resource: 'reports' },
  { id: 'report-read', name: 'View Reports', description: 'View generated reports', category: 'Reporting', action: 'read', resource: 'reports' },
  { id: 'coa-create', name: 'Generate CoA', description: 'Create certificates of analysis', category: 'Reporting', action: 'create', resource: 'coa' },
  { id: 'coa-approve', name: 'Approve CoA', description: 'Approve certificates of analysis', category: 'Reporting', action: 'approve', resource: 'coa' }
];

// Define role definitions with permissions
export const mockRoleDefinitions: RoleDefinition[] = [
  // System Admin Role
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access and administration',
    permissions: mockPermissions, // All permissions
    isSystemRole: true,
    createdDate: '2024-01-01'
  },
  
  // General Roles
  {
    id: 'receiving',
    name: 'Sample Receiving',
    description: 'Sample intake and manifest processing',
    permissions: mockPermissions.filter(p => 
      p.id.includes('sample-') || p.id === 'report-read'
    ),
    isSystemRole: true,
    createdDate: '2024-01-01'
  },
  
  {
    id: 'qc-manager',
    name: 'QC Manager',
    description: 'Quality control oversight and approval',
    permissions: mockPermissions.filter(p => 
      p.category === 'QC' || p.id.includes('read') || p.id.includes('coa-')
    ),
    isSystemRole: true,
    createdDate: '2024-01-01'
  },
  
  // Auto-generated assay-specific roles
  {
    id: 'pot-prep',
    name: 'POT - Sample Preparation',
    description: 'Potency analysis sample preparation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('sample-read') || p.id.includes('batch-') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'POT',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'pot-analysis',
    name: 'POT - Analysis',
    description: 'Potency analysis instrument operation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('analysis-') || p.id.includes('batch-read') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'POT',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'pes-prep',
    name: 'PES - Sample Preparation',
    description: 'Pesticide analysis sample preparation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('sample-read') || p.id.includes('batch-') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'PES',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'pes-analysis',
    name: 'PES - Analysis',
    description: 'Pesticide analysis instrument operation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('analysis-') || p.id.includes('batch-read') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'PES',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'hmt-prep',
    name: 'HMT - Sample Preparation',
    description: 'Heavy metals analysis sample preparation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('sample-read') || p.id.includes('batch-') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'HMT',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'hmt-analysis',
    name: 'HMT - Analysis',
    description: 'Heavy metals analysis instrument operation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('analysis-') || p.id.includes('batch-read') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'HMT',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'sol-prep',
    name: 'SOL - Sample Preparation',
    description: 'Solvents analysis sample preparation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('sample-read') || p.id.includes('batch-') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'SOL',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'sol-analysis',
    name: 'SOL - Analysis',
    description: 'Solvents analysis instrument operation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('analysis-') || p.id.includes('batch-read') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'SOL',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'rsa-prep',
    name: 'RSA - Sample Preparation',
    description: 'Residual solvents analysis sample preparation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('sample-read') || p.id.includes('batch-') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'RSA',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'rsa-analysis',
    name: 'RSA - Analysis',
    description: 'Residual solvents analysis instrument operation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('analysis-') || p.id.includes('batch-read') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'RSA',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'nut-prep',
    name: 'NUT - Sample Preparation',
    description: 'Nutrients analysis sample preparation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('sample-read') || p.id.includes('batch-') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'NUT',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'nut-analysis',
    name: 'NUT - Analysis',
    description: 'Nutrients analysis instrument operation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('analysis-') || p.id.includes('batch-read') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'NUT',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'mic-prep',
    name: 'MIC - Sample Preparation',
    description: 'Microbials analysis sample preparation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('sample-read') || p.id.includes('batch-') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'MIC',
    createdDate: '2024-01-01'
  },
  
  {
    id: 'mic-analysis',
    name: 'MIC - Analysis',
    description: 'Microbials analysis instrument operation',
    permissions: mockPermissions.filter(p => 
      p.id.includes('analysis-') || p.id.includes('batch-read') || p.id.includes('qc-read')
    ),
    isSystemRole: true,
    assayType: 'MIC',
    createdDate: '2024-01-01'
  }
];

export const mockAssays: Assay[] = [
  {
    id: 'POT',
    name: 'Potency',
    code: 'POT',
    description: 'Cannabinoid potency analysis via HPLC',
    isActive: true,
    createdDate: '2024-01-01',
    analytes: [
      { id: 'THC', name: 'THC', unit: 'mg/g', reportingLimit: 0.1, actionLimit: 30, warningLimit: 25, effectiveDate: '2024-01-01' },
      { id: 'CBD', name: 'CBD', unit: 'mg/g', reportingLimit: 0.1, actionLimit: 30, warningLimit: 25, effectiveDate: '2024-01-01' },
      { id: 'CBG', name: 'CBG', unit: 'mg/g', reportingLimit: 0.1, actionLimit: 10, warningLimit: 8, effectiveDate: '2024-01-01' },
      { id: 'THCA', name: 'THCA', unit: 'mg/g', reportingLimit: 0.1, actionLimit: 30, warningLimit: 25, effectiveDate: '2024-01-01' },
      { id: 'CBDA', name: 'CBDA', unit: 'mg/g', reportingLimit: 0.1, actionLimit: 30, warningLimit: 25, effectiveDate: '2024-01-01' },
      { id: 'CBN', name: 'CBN', unit: 'mg/g', reportingLimit: 0.1, actionLimit: 10, warningLimit: 8, effectiveDate: '2024-01-01' },
      { id: 'CBC', name: 'CBC', unit: 'mg/g', reportingLimit: 0.1, actionLimit: 10, warningLimit: 8, effectiveDate: '2024-01-01' },
      { id: 'CBGA', name: 'CBGA', unit: 'mg/g', reportingLimit: 0.1, actionLimit: 10, warningLimit: 8, effectiveDate: '2024-10-10' },
      { id: 'THCV', name: 'THCV', unit: 'mg/g', reportingLimit: 0.1, actionLimit: 10, warningLimit: 8, effectiveDate: '2024-10-10' },
      { id: 'CBDV', name: 'CBDV', unit: 'mg/g', reportingLimit: 0.1, actionLimit: 10, warningLimit: 8, effectiveDate: '2024-10-10' }
    ],
    qcTypes: [
      { id: 'CCV', name: 'Continuing Calibration Verification', description: 'Daily calibration check', frequency: 1, limits: { lower: 85, upper: 115 } },
      { id: 'MRL', name: 'Method Reporting Limit', description: 'Detection limit verification', frequency: 10, limits: { lower: 80, upper: 120 } },
      { id: 'HCV', name: 'High Calibration Verification', description: 'High-level calibration check', frequency: 20, limits: { lower: 85, upper: 115 } },
      { id: 'LCV', name: 'Low Calibration Verification', description: 'Low-level calibration check', frequency: 20, limits: { lower: 80, upper: 120 } }
    ],
    version: '2.1',
    revisionHistory: []
  },
  {
    id: 'PES',
    name: 'Pesticides',
    code: 'PES',
    description: 'Pesticide residue analysis via LC-MS/MS',
    isActive: true,
    createdDate: '2024-01-01',
    analytes: [
      { id: 'ABAM', name: 'Abamectin', unit: 'mg/kg', reportingLimit: 0.01, actionLimit: 0.1, warningLimit: 0.08, effectiveDate: '2024-01-01' },
      { id: 'ACAR', name: 'Acephate', unit: 'mg/kg', reportingLimit: 0.01, actionLimit: 0.1, warningLimit: 0.08, effectiveDate: '2024-01-01' },
      { id: 'ACET', name: 'Acetamiprid', unit: 'mg/kg', reportingLimit: 0.01, actionLimit: 0.1, warningLimit: 0.08, effectiveDate: '2024-01-01' },
      { id: 'ALDI', name: 'Aldicarb', unit: 'mg/kg', reportingLimit: 0.01, actionLimit: 0.1, warningLimit: 0.08, effectiveDate: '2024-01-01' },
      { id: 'AZOX', name: 'Azoxystrobin', unit: 'mg/kg', reportingLimit: 0.01, actionLimit: 0.1, warningLimit: 0.08, effectiveDate: '2024-01-01' },
      { id: 'BIFE', name: 'Bifenazate', unit: 'mg/kg', reportingLimit: 0.01, actionLimit: 0.1, warningLimit: 0.08, effectiveDate: '2024-01-01' },
      { id: 'BIFEN', name: 'Bifenthrin', unit: 'mg/kg', reportingLimit: 0.01, actionLimit: 0.1, warningLimit: 0.08, effectiveDate: '2024-01-01' },
      { id: 'CARB', name: 'Carbaryl', unit: 'mg/kg', reportingLimit: 0.01, actionLimit: 0.5, warningLimit: 0.4, effectiveDate: '2024-01-01' },
      { id: 'CARBO', name: 'Carbofuran', unit: 'mg/kg', reportingLimit: 0.01, actionLimit: 0.1, warningLimit: 0.08, effectiveDate: '2024-01-01' },
      { id: 'CHLOR', name: 'Chlorantraniliprole', unit: 'mg/kg', reportingLimit: 0.01, actionLimit: 0.1, warningLimit: 0.08, effectiveDate: '2024-01-01' }
    ],
    qcTypes: [
      { id: 'MS', name: 'Matrix Spike', description: 'Matrix interference check', frequency: 20, limits: { lower: 70, upper: 130 } },
      { id: 'MSD', name: 'Matrix Spike Duplicate', description: 'Precision check', frequency: 20, limits: { lower: 70, upper: 130 } },
      { id: 'CCV', name: 'Continuing Calibration Verification', description: 'Daily calibration check', frequency: 1, limits: { lower: 85, upper: 115 } }
    ],
    version: '1.0',
    revisionHistory: []
  },
  {
    id: 'HMT',
    name: 'Heavy Metals',
    code: 'HMT',
    description: 'Heavy metals analysis via ICP-MS',
    isActive: true,
    createdDate: '2024-01-01',
    analytes: [
      { id: 'AS', name: 'Arsenic', unit: 'mg/kg', reportingLimit: 0.02, actionLimit: 0.2, warningLimit: 0.15, effectiveDate: '2024-01-01' },
      { id: 'CD', name: 'Cadmium', unit: 'mg/kg', reportingLimit: 0.02, actionLimit: 0.2, warningLimit: 0.15, effectiveDate: '2024-01-01' },
      { id: 'PB', name: 'Lead', unit: 'mg/kg', reportingLimit: 0.02, actionLimit: 0.5, warningLimit: 0.4, effectiveDate: '2024-01-01' },
      { id: 'HG', name: 'Mercury', unit: 'mg/kg', reportingLimit: 0.01, actionLimit: 0.1, warningLimit: 0.08, effectiveDate: '2024-01-01' }
    ],
    qcTypes: [
      { id: 'CCV', name: 'Continuing Calibration Verification', description: 'Daily calibration check', frequency: 1, limits: { lower: 85, upper: 115 } },
      { id: 'CRM', name: 'Certified Reference Material', description: 'Accuracy verification', frequency: 20, limits: { lower: 80, upper: 120 } }
    ],
    version: '1.0',
    revisionHistory: []
  },
  {
    id: 'SOL',
    name: 'Solvents',
    code: 'SOL',
    description: 'Residual solvents analysis via GC-MS',
    isActive: true,
    createdDate: '2024-01-01',
    analytes: [
      { id: 'BUT', name: 'Butane', unit: 'mg/kg', reportingLimit: 1.0, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'ETH', name: 'Ethanol', unit: 'mg/kg', reportingLimit: 10.0, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'ISO', name: 'Isopropanol', unit: 'mg/kg', reportingLimit: 1.0, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'HEP', name: 'Heptane', unit: 'mg/kg', reportingLimit: 1.0, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'HEX', name: 'Hexane', unit: 'mg/kg', reportingLimit: 1.0, actionLimit: 290, warningLimit: 250, effectiveDate: '2024-01-01' },
      { id: 'PEN', name: 'Pentane', unit: 'mg/kg', reportingLimit: 1.0, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'PRO', name: 'Propane', unit: 'mg/kg', reportingLimit: 1.0, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'TOL', name: 'Toluene', unit: 'mg/kg', reportingLimit: 1.0, actionLimit: 890, warningLimit: 750, effectiveDate: '2024-01-01' },
      { id: 'XYL', name: 'Xylene', unit: 'mg/kg', reportingLimit: 1.0, actionLimit: 2170, warningLimit: 1800, effectiveDate: '2024-01-01' },
      { id: 'BEN', name: 'Benzene', unit: 'mg/kg', reportingLimit: 0.1, actionLimit: 2, warningLimit: 1.5, effectiveDate: '2024-01-01' }
    ],
    qcTypes: [
      { id: 'CCV', name: 'Continuing Calibration Verification', description: 'Daily calibration check', frequency: 1, limits: { lower: 85, upper: 115 } },
      { id: 'MS', name: 'Matrix Spike', description: 'Matrix interference check', frequency: 20, limits: { lower: 70, upper: 130 } }
    ],
    version: '1.0',
    revisionHistory: []
  },
  // NEW RSA Assay
  {
    id: 'RSA',
    name: 'Residual Solvents Analysis',
    code: 'RSA',
    description: 'Advanced residual solvents analysis via GC-MS with enhanced detection',
    isActive: true,
    createdDate: '2024-01-01',
    analytes: [
      { id: 'BUT', name: 'Butane', unit: 'ppm', reportingLimit: 0.5, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'ETH', name: 'Ethanol', unit: 'ppm', reportingLimit: 5.0, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'ISO', name: 'Isopropanol', unit: 'ppm', reportingLimit: 0.5, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'HEP', name: 'Heptane', unit: 'ppm', reportingLimit: 0.5, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'HEX', name: 'Hexane', unit: 'ppm', reportingLimit: 0.5, actionLimit: 290, warningLimit: 250, effectiveDate: '2024-01-01' },
      { id: 'PEN', name: 'Pentane', unit: 'ppm', reportingLimit: 0.5, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'PRO', name: 'Propane', unit: 'ppm', reportingLimit: 0.5, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'TOL', name: 'Toluene', unit: 'ppm', reportingLimit: 0.5, actionLimit: 890, warningLimit: 750, effectiveDate: '2024-01-01' },
      { id: 'XYL', name: 'Xylene', unit: 'ppm', reportingLimit: 0.5, actionLimit: 2170, warningLimit: 1800, effectiveDate: '2024-01-01' },
      { id: 'BEN', name: 'Benzene', unit: 'ppm', reportingLimit: 0.05, actionLimit: 2, warningLimit: 1.5, effectiveDate: '2024-01-01' },
      { id: 'ACE', name: 'Acetone', unit: 'ppm', reportingLimit: 0.5, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' },
      { id: 'MEK', name: 'Methyl Ethyl Ketone', unit: 'ppm', reportingLimit: 0.5, actionLimit: 5000, warningLimit: 4000, effectiveDate: '2024-01-01' }
    ],
    qcTypes: [
      { id: 'CCV', name: 'Continuing Calibration Verification', description: 'Daily calibration check', frequency: 1, limits: { lower: 85, upper: 115 } },
      { id: 'MS', name: 'Matrix Spike', description: 'Matrix interference check', frequency: 20, limits: { lower: 70, upper: 130 } },
      { id: 'MSD', name: 'Matrix Spike Duplicate', description: 'Precision check', frequency: 20, limits: { lower: 70, upper: 130 } },
      { id: 'LCS', name: 'Laboratory Control Sample', description: 'Method accuracy check', frequency: 20, limits: { lower: 80, upper: 120 } }
    ],
    version: '1.0',
    revisionHistory: []
  },
  {
    id: 'NUT',
    name: 'Nutrients',
    code: 'NUT',
    description: 'Nutrient analysis via ICP-OES',
    isActive: true,
    createdDate: '2024-01-01',
    analytes: [
      { id: 'CA', name: 'Calcium', unit: 'mg/kg', reportingLimit: 1.0, effectiveDate: '2024-01-01' },
      { id: 'MG', name: 'Magnesium', unit: 'mg/kg', reportingLimit: 1.0, effectiveDate: '2024-01-01' },
      { id: 'K', name: 'Potassium', unit: 'mg/kg', reportingLimit: 1.0, effectiveDate: '2024-01-01' },
      { id: 'P', name: 'Phosphorus', unit: 'mg/kg', reportingLimit: 1.0, effectiveDate: '2024-01-01' },
      { id: 'S', name: 'Sulfur', unit: 'mg/kg', reportingLimit: 1.0, effectiveDate: '2024-01-01' },
      { id: 'FE', name: 'Iron', unit: 'mg/kg', reportingLimit: 0.5, effectiveDate: '2024-01-01' },
      { id: 'MN', name: 'Manganese', unit: 'mg/kg', reportingLimit: 0.1, effectiveDate: '2024-01-01' },
      { id: 'ZN', name: 'Zinc', unit: 'mg/kg', reportingLimit: 0.1, effectiveDate: '2024-01-01' },
      { id: 'CU', name: 'Copper', unit: 'mg/kg', reportingLimit: 0.1, effectiveDate: '2024-01-01' },
      { id: 'B', name: 'Boron', unit: 'mg/kg', reportingLimit: 0.1, effectiveDate: '2024-01-01' }
    ],
    qcTypes: [
      { id: 'CCV', name: 'Continuing Calibration Verification', description: 'Daily calibration check', frequency: 1, limits: { lower: 85, upper: 115 } },
      { id: 'CRM', name: 'Certified Reference Material', description: 'Accuracy verification', frequency: 20, limits: { lower: 80, upper: 120 } }
    ],
    version: '1.0',
    revisionHistory: []
  },
  {
    id: 'MIC',
    name: 'Microbials',
    code: 'MIC',
    description: 'Microbial contamination analysis via qPCR',
    isActive: true,
    createdDate: '2024-01-01',
    analytes: [
      { id: 'ECOLI', name: 'E. coli', unit: 'CFU/g', reportingLimit: 1, actionLimit: 100, warningLimit: 80, effectiveDate: '2024-01-01' },
      { id: 'SALM', name: 'Salmonella', unit: 'CFU/g', reportingLimit: 1, actionLimit: 0, warningLimit: 0, effectiveDate: '2024-01-01' },
      { id: 'STAPH', name: 'Staphylococcus aureus', unit: 'CFU/g', reportingLimit: 1, actionLimit: 1000, warningLimit: 800, effectiveDate: '2024-01-01' },
      { id: 'PSEUDO', name: 'Pseudomonas aeruginosa', unit: 'CFU/g', reportingLimit: 1, actionLimit: 1000, warningLimit: 800, effectiveDate: '2024-01-01' },
      { id: 'ASPERG', name: 'Aspergillus', unit: 'CFU/g', reportingLimit: 1, actionLimit: 1000, warningLimit: 800, effectiveDate: '2024-01-01' },
      { id: 'YEAST', name: 'Yeast and Mold', unit: 'CFU/g', reportingLimit: 10, actionLimit: 10000, warningLimit: 8000, effectiveDate: '2024-01-01' }
    ],
    qcTypes: [
      { id: 'PC', name: 'Positive Control', description: 'Known positive sample', frequency: 1, limits: { lower: 50, upper: 200 } },
      { id: 'NC', name: 'Negative Control', description: 'Sterile control', frequency: 1, limits: { lower: 0, upper: 10 } }
    ],
    version: '1.0',
    revisionHistory: []
  }
];

export const mockPrepBatches: PrepBatch[] = [
  {
    id: 'PB001',
    samples: ['S002', 'S004', 'S005'],
    assayType: 'POT',
    status: 'Ready for Analysis',
    analyst: 'Jane Smith',
    createdDate: '2024-01-16',
    metadata: {
      reagents: [
        { reagentId: 'R001', lotNumber: 'L2024001', expirationDate: '2024-06-01', volumeUsed: 50 }
      ],
      equipment: ['HPLC-01', 'SCALE-01'],
      extractionDate: '2024-01-16',
      notes: 'Standard extraction protocol followed'
    }
  },
  {
    id: 'PR117906',
    samples: ['S010', 'S011', 'S012', 'S013', 'S014'],
    assayType: 'SOL',
    status: 'In Progress',
    analyst: 'Nadia Sherman',
    createdDate: '2024-06-06',
    metadata: {
      reagents: [
        { reagentId: 'NCTL-2024-001', lotNumber: 'RSA-250523-ISES-1', expirationDate: '2025-05-23', volumeUsed: 2.5 },
        { reagentId: 'NCTL-2024-002', lotNumber: 'RSA-250522-CS2B-1', expirationDate: '2025-05-22', volumeUsed: 2.5 }
      ],
      equipment: ['BT-Disp', 'Balance'],
      extractionDate: '2024-06-06',
      notes: 'RSA prep batch for residual solvents analysis'
    }
  },
  // Add RSA prep batch
  {
    id: 'PB003',
    samples: ['S008', 'S009'],
    assayType: 'RSA',
    status: 'In Progress',
    analyst: 'Nadia Sherman',
    createdDate: '2024-01-22',
    metadata: {
      reagents: [
        { reagentId: 'NCTL-2024-006', lotNumber: 'BCCL2559', expirationDate: '2028-05-17', volumeUsed: 2.5 },
        { reagentId: 'NCTL-2024-007', lotNumber: '071872568B', expirationDate: '2025-07-17', volumeUsed: 2.5 }
      ],
      equipment: ['GC-MS-01', 'Balance', 'Vortex'],
      extractionDate: '2024-01-22',
      notes: 'RSA prep batch for enhanced residual solvents analysis'
    }
  }
];

export const mockAnalyticalBatches: AnalyticalBatch[] = [
  {
    id: 'AB001',
    prepBatches: ['PB001'],
    assayType: 'POT',
    status: 'Data Entry',
    analyst: 'Dr. Michael Johnson',
    instrument: 'HPLC-Agilent-1260',
    calibrationData: {
      curves: [
        {
          analyte: 'THC',
          points: [
            { concentration: 0, response: 0 },
            { concentration: 10, response: 1000 },
            { concentration: 50, response: 5200 },
            { concentration: 100, response: 10500 }
          ],
          rSquared: 0.9985
        }
      ],
      blanks: [0, 0.02, 0.01],
      ccv: 98.5,
      createdDate: '2024-01-17'
    },
    qcSamples: [
      { id: 'QC001', type: 'CCV', analyte: 'THC', expectedValue: 25.0, actualValue: 24.6, result: 'Pass' },
      { id: 'QC002', type: 'Blank', analyte: 'THC', actualValue: 0.02, result: 'Pass' }
    ],
    results: [],
    createdDate: '2024-01-17'
  },
  {
    id: 'AN117948',
    prepBatches: ['PR117906'],
    assayType: 'SOL',
    status: 'QC Review',
    analyst: 'Dr. Michael Johnson',
    instrument: 'GC-MS-Agilent-7890',
    calibrationData: {
      curves: [
        {
          analyte: 'Butane',
          points: [
            { concentration: 0, response: 0 },
            { concentration: 10, response: 950 },
            { concentration: 50, response: 4800 },
            { concentration: 100, response: 9750 }
          ],
          rSquared: 0.9992
        }
      ],
      blanks: [0, 0.1, 0.05],
      ccv: 97.8,
      createdDate: '2024-06-06'
    },
    qcSamples: [
      { id: 'QC003', type: 'CCV', analyte: 'Butane', expectedValue: 50.0, actualValue: 48.9, result: 'Pass' },
      { id: 'QC004', type: 'Blank', analyte: 'Butane', actualValue: 0.05, result: 'Pass' },
      { id: 'QC005', type: 'MS', analyte: 'Ethanol', expectedValue: 25.0, actualValue: 24.2, result: 'Pass' }
    ],
    results: [],
    createdDate: '2024-06-06'
  },
  // Add RSA analytical batch
  {
    id: 'AB003',
    prepBatches: ['PB003'],
    assayType: 'RSA',
    status: 'In Progress',
    analyst: 'Dr. Michael Johnson',
    instrument: 'GC-MS-Agilent-7890B',
    calibrationData: {
      curves: [
        {
          analyte: 'Butane',
          points: [
            { concentration: 0, response: 0 },
            { concentration: 5, response: 480 },
            { concentration: 25, response: 2400 },
            { concentration: 50, response: 4850 },
            { concentration: 100, response: 9700 }
          ],
          rSquared: 0.9995
        }
      ],
      blanks: [0, 0.02, 0.01],
      ccv: 99.2,
      createdDate: '2024-01-22'
    },
    qcSamples: [
      { id: 'QC006', type: 'CCV', analyte: 'Butane', expectedValue: 50.0, actualValue: 49.6, result: 'Pass' },
      { id: 'QC007', type: 'Blank', analyte: 'Butane', actualValue: 0.02, result: 'Pass' },
      { id: 'QC008', type: 'MS', analyte: 'Ethanol', expectedValue: 25.0, actualValue: 24.8, result: 'Pass' },
      { id: 'QC009', type: 'LCS', analyte: 'Benzene', expectedValue: 2.0, actualValue: 1.95, result: 'Pass' }
    ],
    results: [],
    createdDate: '2024-01-22'
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'INV001',
    nctlId: 'NCTL-2024-001',
    name: 'Methanol HPLC Grade',
    manufacturer: 'Fisher Scientific',
    lotNumber: 'FS2024001',
    vendor: 'Fisher Scientific',
    receivedDate: '2024-01-10',
    expirationDate: '2025-01-10',
    quantity: 4,
    packagesReceived: 1,
    itemsPerPackage: 4,
    category: 'Chemical',
    documents: [
      { id: 'DOC001', name: 'Methanol SDS', type: 'SDS', url: '/documents/methanol-sds.pdf' }
    ],
    status: 'Active'
  },
  {
    id: 'INV002',
    nctlId: 'NCTL-2024-002',
    name: 'THC Reference Standard',
    manufacturer: 'Cerilliant',
    lotNumber: 'CER2024THC',
    vendor: 'Sigma-Aldrich',
    receivedDate: '2024-01-12',
    expirationDate: '2025-06-12',
    quantity: 1,
    packagesReceived: 1,
    itemsPerPackage: 1,
    category: 'Standard',
    documents: [
      { id: 'DOC002', name: 'THC Standard COA', type: 'COA', url: '/documents/thc-standard-coa.pdf' }
    ],
    status: 'Active'
  },
  {
    id: 'INV003',
    nctlId: 'NCTL-2024-003',
    name: 'Acetonitrile HPLC Grade',
    manufacturer: 'Fisher Scientific',
    lotNumber: 'FS2024002',
    vendor: 'Fisher Scientific',
    receivedDate: '2024-01-10',
    expirationDate: '2025-01-10',
    quantity: 4,
    packagesReceived: 1,
    itemsPerPackage: 4,
    category: 'Chemical',
    documents: [
      { id: 'DOC003', name: 'Acetonitrile SDS', type: 'SDS', url: '/documents/acetonitrile-sds.pdf' }
    ],
    status: 'Active'
  },
  {
    id: 'INV004',
    nctlId: 'NCTL-2024-004',
    name: 'CBD Reference Standard',
    manufacturer: 'Cerilliant',
    lotNumber: 'CER2024CBD',
    vendor: 'Sigma-Aldrich',
    receivedDate: '2024-01-12',
    expirationDate: '2025-06-12',
    quantity: 1,
    packagesReceived: 1,
    itemsPerPackage: 1,
    category: 'Standard',
    documents: [
      { id: 'DOC004', name: 'CBD Standard COA', type: 'COA', url: '/documents/cbd-standard-coa.pdf' }
    ],
    status: 'Active'
  },
  {
    id: 'INV005',
    nctlId: 'NCTL-2024-005',
    name: 'Formic Acid',
    manufacturer: 'Sigma-Aldrich',
    lotNumber: 'SA2024001',
    vendor: 'Sigma-Aldrich',
    receivedDate: '2024-01-15',
    expirationDate: '2025-12-15',
    quantity: 1,
    packagesReceived: 1,
    itemsPerPackage: 1,
    category: 'Chemical',
    documents: [
      { id: 'DOC005', name: 'Formic Acid SDS', type: 'SDS', url: '/documents/formic-acid-sds.pdf' }
    ],
    status: 'Active'
  },
  {
    id: 'INV006',
    nctlId: 'NCTL-2024-006',
    name: 'DMAC (Dimethylacetamide)',
    manufacturer: 'Sigma-Aldrich',
    lotNumber: 'BCCL2559',
    vendor: 'Sigma-Aldrich',
    receivedDate: '2024-05-17',
    expirationDate: '2028-05-17',
    quantity: 1,
    packagesReceived: 1,
    itemsPerPackage: 1,
    category: 'Chemical',
    documents: [
      { id: 'DOC006', name: 'DMAC SDS', type: 'SDS', url: '/documents/dmac-sds.pdf' }
    ],
    status: 'Active'
  },
  {
    id: 'INV007',
    nctlId: 'NCTL-2024-007',
    name: 'MCT Oil (Medium Chain Triglycerides)',
    manufacturer: 'Better Body Foods',
    lotNumber: '071872568B',
    vendor: 'Better Body Foods',
    receivedDate: '2024-07-17',
    expirationDate: '2025-07-17',
    quantity: 1,
    packagesReceived: 1,
    itemsPerPackage: 1,
    category: 'Reagent',
    documents: [
      { id: 'DOC007', name: 'MCT Oil COA', type: 'COA', url: '/documents/mct-oil-coa.pdf' }
    ],
    status: 'Active'
  },
  // Add RSA-specific reagents
  {
    id: 'INV008',
    nctlId: 'NCTL-2024-008',
    name: 'Butane Reference Standard',
    manufacturer: 'Restek',
    lotNumber: 'RST2024BUT',
    vendor: 'Restek Corporation',
    receivedDate: '2024-01-20',
    expirationDate: '2025-01-20',
    quantity: 1,
    packagesReceived: 1,
    itemsPerPackage: 1,
    category: 'Standard',
    documents: [
      { id: 'DOC008', name: 'Butane Standard COA', type: 'COA', url: '/documents/butane-standard-coa.pdf' }
    ],
    status: 'Active'
  },
  {
    id: 'INV009',
    nctlId: 'NCTL-2024-009',
    name: 'Solvent Mix Standard (12 compounds)',
    manufacturer: 'Restek',
    lotNumber: 'RST2024MIX',
    vendor: 'Restek Corporation',
    receivedDate: '2024-01-20',
    expirationDate: '2025-01-20',
    quantity: 1,
    packagesReceived: 1,
    itemsPerPackage: 1,
    category: 'Standard',
    documents: [
      { id: 'DOC009', name: 'Solvent Mix COA', type: 'COA', url: '/documents/solvent-mix-coa.pdf' }
    ],
    status: 'Active'
  }
];

export const mockUsers: User[] = [
  {
    id: 'U001',
    username: 'admin',
    email: 'admin@nctl.com',
    firstName: 'Admin',
    lastName: 'User',
    roles: [
      { assayType: 'ALL', role: 'Admin' }
    ],
    isActive: true
  },
  {
    id: 'U002',
    username: 'jsmith',
    email: 'jane.smith@nctl.com',
    firstName: 'Jane',
    lastName: 'Smith',
    roles: [
      { assayType: 'POT', role: 'Prep' },
      { assayType: 'PES', role: 'Prep' }
    ],
    isActive: true
  },
  {
    id: 'U003',
    username: 'mjohnson',
    email: 'michael.johnson@nctl.com',
    firstName: 'Michael',
    lastName: 'Johnson',
    roles: [
      { assayType: 'POT', role: 'Analysis' },
      { assayType: 'HMT', role: 'Analysis' }
    ],
    isActive: true
  },
  {
    id: 'U004',
    username: 'swilson',
    email: 'sarah.wilson@nctl.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    roles: [
      { assayType: 'ALL', role: 'QC Manager' }
    ],
    isActive: true
  },
  {
    id: 'U005',
    username: 'rbrown',
    email: 'robert.brown@nctl.com',
    firstName: 'Robert',
    lastName: 'Brown',
    roles: [
      { assayType: 'PES', role: 'Analysis' },
      { assayType: 'SOL', role: 'Analysis' }
    ],
    isActive: true
  },
  {
    id: 'U006',
    username: 'lgarcia',
    email: 'lisa.garcia@nctl.com',
    firstName: 'Lisa',
    lastName: 'Garcia',
    roles: [
      { assayType: 'ALL', role: 'Receiving' }
    ],
    isActive: true
  },
  {
    id: 'U007',
    username: 'dlee',
    email: 'david.lee@nctl.com',
    firstName: 'David',
    lastName: 'Lee',
    roles: [
      { assayType: 'MIC', role: 'Prep' },
      { assayType: 'MIC', role: 'Analysis' }
    ],
    isActive: true
  },
  {
    id: 'U008',
    username: 'amartinez',
    email: 'anna.martinez@nctl.com',
    firstName: 'Anna',
    lastName: 'Martinez',
    roles: [
      { assayType: 'NUT', role: 'Prep' },
      { assayType: 'HMT', role: 'Prep' }
    ],
    isActive: true
  },
  {
    id: 'U009',
    username: 'nsherman',
    email: 'nadia.sherman@nctl.com',
    firstName: 'Nadia',
    lastName: 'Sherman',
    roles: [
      { assayType: 'SOL', role: 'Prep' },
      { assayType: 'SOL', role: 'Analysis' },
      { assayType: 'RSA', role: 'Prep' },
      { assayType: 'RSA', role: 'Analysis' }
    ],
    isActive: true
  }
];