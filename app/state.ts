import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Vector3 } from 'three'
import { createJSONStorage } from 'zustand/middleware'

interface State {
    position: Vector3;
    setPosition: (position: Vector3) => void;
}

export const useStore = create<State>()(
    persist((set) => ({
        position: new Vector3(0, 0, 0),
        setPosition: (position: Vector3) => set({ position })
    }), {
        name: '3d-space',
        storage: createJSONStorage(() => localStorage)
    })
)