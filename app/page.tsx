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
import { Html, Environment, Plane, Box, Center } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { MeshStandardMaterial } from "three";
import { Room } from "./components/Room";
import { folder, useControls } from "leva";
import AutoLayout from "./components/AutoLayout";

export default function Home() {
  const {
    effect,
    rotation,
    debug,
    direction,
    gap,
    itemPadding,
    align0x,
    align0y,
    align0z,
    align1x,
    align1y,
    align1z,
    offset0,
    offset1,
  } = useControls({
    camera: folder({
      effect: false,
      rotation: false,
    }, { collapsed: true}),
    layout: folder({
      gap: 0,
      debug: true,
      direction: { options: ["x", "y", "z"], value: "x" },
      itemPadding: { value: [0.5, 1.5, 0] },
      align0x: { options: ["start", "center", "end"], value: "start" },
      align0y: { options: ["start", "center", "end"], value: "center" },
      align0z: { options: ["start", "center", "end"], value: "center" },
      align1x: { options: ["start", "center", "end"], value: "end" },
      align1y: { options: ["start", "center", "end"], value: "end" },
      align1z: { options: ["start", "center", "end"], value: "center" },
      offset0: { value: { x: 0.2, y: 0, z: 0 } },
      offset1: { value: { x: -0.2, y: 0.1, z: 0 } },
    }),
  });

  const itemAligns = [
    { x: align0x, y: align0y, z: align0z },
    { x: align1x, y: align1y, z: align1z },
  ];
  const itemOffsets = [offset0, offset1];

  // 创建自定义材质
  const roomMaterial = new MeshStandardMaterial({
    color: "#fff",
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
      <OrbitControls enableRotate={rotation} />
      <color attach="background" args={["#fff"]} />
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
      <AutoLayout
        width={10}
        height={6}
        depth={4}
        gap={gap}
        direction={direction}
        itemPadding={itemPadding}
        itemAligns={itemAligns}
        itemOffsets={itemOffsets}
        debug={debug}
      >
        <Box />
        <Box />
      </AutoLayout>
      {/* <Suspense fallback={<Html center>Loading.</Html>}>
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
      </Suspense> */}
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
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
