'use client'

import { useEffect, useRef } from 'react'
import { useAssetStore } from '@/store/useAssetStore'

export const IntervalProvider = ({ children }: { children: React.ReactNode }) => {
    const updateVisuals = useAssetStore((state) => state.updateVisuals)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        updateVisuals() // Initial update
        intervalRef.current = setInterval(() => {
            updateVisuals()
        }, 3000)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [updateVisuals])

    return <>{children}</>
}
