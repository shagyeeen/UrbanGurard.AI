export type AssetType = 'Road' | 'Bridge' | 'Drainage' | 'Traffic Signal' | 'Pipeline';
export type HealthStatus = 'Healthy' | 'Warning' | 'Critical';
export type DamageSeverity = 'Low' | 'Medium' | 'High';

export interface VisualAnalysis {
    id: string;
    timestamp: string;
    imageUrl: string;
    videoUrl?: string;
    detectedIssue: string;
    severity: DamageSeverity;
    confidence: number; // percentage
    recommendations: string[];
}

export interface DamageDetection {
    id: string;
    timestamp: string;
    assetId: string;
    severity: HealthStatus;
    description: string;
    issue: string;
}

export type City = 'Chennai' | 'Coimbatore';

export interface Asset {
    id: string;
    name: string;
    location: string;
    city: City;
    coordinates: { lat: number; lng: number };
    type: AssetType;
    analysis: VisualAnalysis[];
    healthScore: number;
    status: HealthStatus;
    lastInspection: string;
    trend: 'improving' | 'declining' | 'stable';
    detections: DamageDetection[];
}

export interface AppState {
    assets: Asset[];
    selectedCity: City;
    overallHealth: number;
    notifications: DamageDetection[];
    isLoading: boolean;
    updateVisuals: () => void;
    getAssetById: (id: string) => Asset | undefined;
    setSelectedCity: (city: City) => void;
}
