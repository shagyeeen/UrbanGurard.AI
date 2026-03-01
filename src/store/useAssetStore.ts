import { create } from 'zustand';
import { Asset, AppState, AssetType, HealthStatus, DamageDetection, VisualAnalysis, DamageSeverity } from '../types';

const ASSET_TYPES: AssetType[] = ['Road', 'Bridge', 'Drainage', 'Traffic Signal', 'Pipeline'];

const ISSUES_BY_TYPE: Record<AssetType, { issue: string; recommendations: string[] }[]> = {
    'Road': [
        { issue: 'Large pothole detected', recommendations: ['Immediate asphalt resurfacing', 'Temporary traffic diversion'] },
        { issue: 'Severe road segments cracks', recommendations: ['Structural layer reinforcement', 'Waterproofing sealant application'] },
        { issue: 'Damaged pavement blocks', recommendations: ['Pedestrian zone reconstruction', 'Tactile paving replacement'] },
        { issue: 'Surface flooding', recommendations: ['Drainage clearance', 'Anti-skid coating'] }
    ],
    'Bridge': [
        { issue: 'Structural bridge cracks', recommendations: ['Immediate structural integrity check', 'Load restriction implementation'] },
        { issue: 'Reinforcement corrosion', recommendations: ['Sandblasting and anti-corrosive coating', 'Member reinforcement'] },
        { issue: 'Expansion joint failure', recommendations: ['Joint replacement', 'Periodic mobility check'] }
    ],
    'Drainage': [
        { issue: 'Severe drainage blockage', recommendations: ['High-pressure jetting', 'Trash rack cleaning'] },
        { issue: 'Segmental collapse', recommendations: ['Trenchless repair', 'Bypass pumping'] },
        { issue: 'Silt accumulation', recommendations: ['Mechanical desilting', 'Visual Flow Audit'] }
    ],
    'Traffic Signal': [
        { issue: 'Signal lamp failure', recommendations: ['LED module replacement', 'Controller synchronization'] },
        { issue: 'Casing structural damage', recommendations: ['Pole alignment correction', 'Component replacement'] }
    ],
    'Pipeline': [
        { issue: 'High-pressure leakage', recommendations: ['Pipeline pressure inspection', 'Rapid clamp deployment'] },
        { issue: 'External rust buildup', recommendations: ['Fiberglass wrapping', 'Cathodic protection check'] }
    ]
};

const CCTV_VIDEOS = [
    'https://assets.mixkit.co/videos/preview/mixkit-urban-traffic-in-the-city-at-night-4221-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-cars-on-a-highway-3437-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-night-city-traffic-in-a-busy-avenue-4223-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-cars-crossing-an-avenue-in-a-city-4222-large.mp4'
];

const CHENNAI_ASSETS_DATA = [
    { name: 'Kathipara Flyover Alpha', type: 'Bridge', location: 'Guindy' },
    { name: 'Anna Salai Sector 4', type: 'Road', location: 'Teynampet' },
    { name: 'Koyambedu Drainage Node', type: 'Drainage', location: 'Koyambedu' },
    { name: 'Taramani Smart Grid Signal', type: 'Traffic Signal', location: 'Taramani' },
    { name: 'Chembarambakkam Main Pipeline', type: 'Pipeline', location: 'Poonamallee' },
    { name: 'Marina Beach Road Stretch', type: 'Road', location: 'Marina' },
    { name: 'Napier structural Bridge', type: 'Bridge', location: 'Fort St. George' },
    { name: 'Velachery Drainage System', type: 'Drainage', location: 'Velachery' },
    { name: 'OMR Hub Signal', type: 'Traffic Signal', location: 'Sholinganallur' },
    { name: 'Adyar Industrial Pipeline', type: 'Pipeline', location: 'Adyar' },
    { name: 'Mount Road Highway', type: 'Road', location: 'Little Mount' },
    { name: 'IT Expressway Bridge', type: 'Bridge', location: 'OMR' },
    { name: 'Egmore Drainage Grid', type: 'Drainage', location: 'Egmore' },
    { name: 'Guindy Junction Signal', type: 'Traffic Signal', location: 'Guindy' },
    { name: 'Porur Supply Pipeline', type: 'Pipeline', location: 'Porur' }
];

const COIMBATORE_ASSETS_DATA = [
    { name: 'Gandhipuram Bridge', type: 'Bridge', location: 'Gandhipuram' },
    { name: 'Avinashi Road Highway', type: 'Road', location: 'Peelamedu' },
    { name: 'Ukkadam Junction Drainage', type: 'Drainage', location: 'Ukkadam' },
    { name: 'RS Puram Smart Signal', type: 'Traffic Signal', location: 'RS Puram' },
    { name: 'Siruvani Main Intake Pipe', type: 'Pipeline', location: 'Alandurai' },
    { name: 'Race Course Roadway', type: 'Road', location: 'Race Course' },
    { name: 'North CBE Bypass Bridge', type: 'Bridge', location: 'North CBE' },
    { name: 'Saravanampatti Drainage Alpha', type: 'Drainage', location: 'Saravanampatti' },
    { name: 'Singanallur Grid Signal', type: 'Traffic Signal', location: 'Singanallur' },
    { name: 'Ganapathy Supply Pipeline', type: 'Pipeline', location: 'Ganapathy' }
];

const generateInitialAssets = (data: any[], city: 'Chennai' | 'Coimbatore') => {
    return data.map((item, i) => {
        const type = item.type as AssetType;
        let healthScore = 95 - (i % 5) * 5;
        let status: HealthStatus = 'Healthy';

        if (healthScore < 60) status = 'Critical';
        else if (healthScore < 85) status = 'Warning';

        const issues = ISSUES_BY_TYPE[type];
        const randomIssue = issues[i % issues.length];

        const visualAnalysis: VisualAnalysis[] = [
            {
                id: `VIS-${city.toLowerCase()}-${i}-1`,
                timestamp: new Date().toISOString(),
                imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=800`,
                videoUrl: CCTV_VIDEOS[i % CCTV_VIDEOS.length],
                detectedIssue: status === 'Healthy' ? 'No major issues detected' : randomIssue.issue,
                severity: status === 'Critical' ? 'High' : status === 'Warning' ? 'Medium' : 'Low',
                confidence: 85 + (i % 15),
                recommendations: status === 'Healthy' ? ['Routine visual monitoring'] : randomIssue.recommendations
            }
        ];

        const detections: DamageDetection[] = [];
        if (status !== 'Healthy') {
            detections.push({
                id: `DET-${city.toLowerCase()}-${i}`,
                timestamp: new Date().toISOString(),
                assetId: `ASSET-${city === 'Chennai' ? 'CH' : 'CBE'}-${3000 + i}`,
                severity: status,
                description: `Visual AI detected ${randomIssue.issue.toLowerCase()} via CCTV feed.`,
                issue: randomIssue.issue
            });
        }

        const center = city === 'Chennai' ? { lat: 13.0827, lng: 80.2707 } : { lat: 11.0168, lng: 76.9558 };
        const latOffset = ((i * 17) % 100) / 1000 - 0.05;
        const lngOffset = ((i * 23) % 100) / 1000 - 0.05;

        return {
            id: `ASSET-${city === 'Chennai' ? 'CH' : 'CBE'}-${3000 + i}`,
            name: item.name,
            location: item.location,
            city,
            coordinates: {
                lat: center.lat + latOffset * (city === 'Chennai' ? 1.5 : 1.2),
                lng: center.lng + lngOffset * (city === 'Chennai' ? 1.8 : 1.4)
            },
            type,
            analysis: visualAnalysis,
            healthScore,
            status,
            lastInspection: new Date().toISOString().split('T')[0],
            trend: (i % 3 === 0 ? 'improving' : i % 3 === 1 ? 'declining' : 'stable') as 'improving' | 'declining' | 'stable',
            detections,
        };
    });
};

const INITIAL_ASSETS: Asset[] = [
    ...generateInitialAssets(CHENNAI_ASSETS_DATA, 'Chennai'),
    ...generateInitialAssets(COIMBATORE_ASSETS_DATA, 'Coimbatore')
];

export const useAssetStore = create<AppState>((set, get) => ({
    assets: INITIAL_ASSETS,
    selectedCity: 'Chennai',
    overallHealth: 88,
    notifications: INITIAL_ASSETS.flatMap(a => a.detections).slice(0, 5),
    isLoading: false,

    setSelectedCity: (city) => set({ selectedCity: city }),
    getAssetById: (id: string) => get().assets.find(a => a.id === id),

    updateVisuals: () => {
        set((state) => {
            const updatedAssets = state.assets.map((asset) => {
                // Occasional health fluctuation based on new "simulated" visuals
                if (Math.random() > 0.85) {
                    const healthChange = (Math.random() > 0.5 ? 1 : -1) * 5;
                    const newHealth = Math.max(0, Math.min(100, asset.healthScore + healthChange));
                    const newStatus: HealthStatus = newHealth > 85 ? 'Healthy' : newHealth > 60 ? 'Warning' : 'Critical';

                    if (newStatus !== asset.status && newStatus !== 'Healthy') {
                        const issues = ISSUES_BY_TYPE[asset.type];
                        const randomIssue = issues[Math.floor(Math.random() * issues.length)];

                        const newDetection: DamageDetection = {
                            id: `DET-${asset.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                            timestamp: new Date().toISOString(),
                            assetId: asset.id,
                            severity: newStatus,
                            description: `CCTV Analysis: New ${randomIssue.issue.toLowerCase()} identified.`,
                            issue: randomIssue.issue
                        };

                        const newAnalysis: VisualAnalysis = {
                            id: `VIS-${asset.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                            timestamp: new Date().toISOString(),
                            imageUrl: asset.analysis[0].imageUrl,
                            videoUrl: asset.analysis[0].videoUrl,
                            detectedIssue: randomIssue.issue,
                            severity: newStatus === 'Critical' ? 'High' : 'Medium',
                            confidence: 88 + Math.floor(Math.random() * 10),
                            recommendations: randomIssue.recommendations
                        };

                        return {
                            ...asset,
                            healthScore: newHealth,
                            status: newStatus,
                            analysis: [newAnalysis, ...asset.analysis],
                            detections: [newDetection, ...asset.detections].slice(0, 10),
                            trend: (healthChange > 0 ? 'improving' : 'declining') as 'improving' | 'declining'
                        };
                    }
                    return { ...asset, healthScore: newHealth, status: newStatus };
                }
                return asset;
            });

            const avgHealth = Math.round(updatedAssets.reduce((acc, a) => acc + a.healthScore, 0) / updatedAssets.length);
            const criticalDetections = updatedAssets.flatMap(a => a.detections).filter(d => d.severity === 'Critical');

            return {
                assets: updatedAssets,
                overallHealth: avgHealth,
                notifications: criticalDetections.slice(0, 5)
            };
        });
    },
}));
