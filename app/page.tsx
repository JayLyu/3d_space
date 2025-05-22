"use client";

import React, { Suspense } from "react";
import style from "./page.module.css";
import {
  DepthOfField,
  EffectComposer,
  Noise,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import { Canvas } from "@react-three/fiber";
import {
  Html,
  Environment,
  Plane,
  Box,
  Center,
} from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { Room } from "./components/Room";
import { folder, useControls } from "leva";

export default function Home() {

  const { effect, rotation } = useControls({
    effect: false,
    camera: folder({
      rotation: false
    })
  })
  // 创建自定义材质
  const roomMaterial = new MeshStandardMaterial({
    color: '#fff',
    roughness: 0.8,
    metalness: 0.2,
    // envMap: useCubeTexture(
    //   ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
    //   { path: "/cube/" }
    // ),
    // envMapIntensity: 0.5
  });

  return (
    <Canvas
      className={style.canvas}
      dpr={[1, 2]}
      shadows
      camera={{
        position: [10, 10, 10],
        fov: 45,
        near: 0.1,
        far: 1000,
      }}
    >
      <OrbitControls 
        enableRotate={rotation}
      />
      <color attach="background" args={['skyblue']} />
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[15, 15, 15]}
        castShadow
        intensity={0.3}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <Suspense fallback={<Html center>Loading.</Html>}>
        <Center>
          <Room 
            material={roomMaterial}
            width={10}
            height={4}
            depth={10}
            wallThickness={0.1}
            doorWidth={5}
            doorHeight={3}
            // position={[0, 2, 0]}
          />
          <Box position={[2, 2, 2]}>
            <meshStandardMaterial color="#000" />
          </Box>
          <Plane
            receiveShadow
            args={[20, 20]}
            position={[0, -2, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial color="#999999" roughness={0.5} metalness={0.5} />
          </Plane>
        </Center>
      </Suspense>
      <axesHelper args={[10]} />
      <Environment 
        files="/studio.hdr"
        environmentIntensity={0.2}
        background={false}
      />
      {effect && (
        <EffectComposer>
          <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={2}
            height={480}
          />
          <Bloom 
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
            height={300}
          />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
