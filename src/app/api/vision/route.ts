import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image data provided.' }, { status: 400 });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an expert urban infrastructure inspector. Analyze the provided image and return a structural report in STRICT JSON format.
                    
                    REQUIRED KEYS:
                    - assetType: (e.g., Road, Bridge, Drainage, Pipeline)
                    - detectedIssue: (Detailed description of visual hazards like "Structural pothole clusters", "Severe surface erosion", etc.)
                    - severity: (Low, Medium, High)
                    - confidence: (Integer 0-100)
                    - recommendations: (Array of short preventive actions)
                    
                    Return ONLY the JSON object.`
                },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Generate a structural health report for this infrastructure frame.' },
                        {
                            type: 'image_url',
                            image_url: {
                                url: image,
                            },
                        },
                    ],
                },
            ],
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            response_format: { type: 'json_object' },
            temperature: 0.1,
        });

        const rawData = JSON.parse(completion.choices[0]?.message?.content || '{}');

        // Normalize keys to ensure frontend mapping works regardless of model variation
        const normalized = {
            assetType: rawData.assetType || rawData.asset_type || 'Unknown Infrastructure',
            detectedIssue: rawData.detectedIssue || rawData.detected_issue || 'General structural anomaly',
            severity: rawData.severity || 'Medium',
            confidence: rawData.confidence || 85,
            recommendations: rawData.recommendations || ['Manual inspection required']
        };

        return NextResponse.json(normalized);
    } catch (error: any) {
        console.error('Groq Vision Error:', error);
        return NextResponse.json({
            detectedIssue: 'Neural Uplink Timeout',
            severity: 'High',
            assetType: 'Unknown',
            confidence: 0,
            recommendations: ['Check API credentials', 'Retry uplink synchronization']
        }, { status: 500 });
    }
}
