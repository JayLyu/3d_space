"use client";

import React, { Suspense, useRef, useState } from "react";
import style from "./page.module.css";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Html,
  Lightformer,
  MeshDistortMaterial,
  Plane,
  Sphere,
  useCubeTexture,
  useTexture,
} from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { Mesh, Material, MathUtils } from "three";

interface MainSphereProps {
  material: Material;
}

function MainSphere({ material }: MainSphereProps) {
  const main = useRef<Mesh>(null);
  
  useFrame(({ clock, mouse }) => {
    if (main.current) {
      main.current.rotation.z = clock.getElapsedTime();
      main.current.rotation.y = MathUtils.lerp(
        main.current.rotation.y,
        mouse.x * Math.PI,
        0.1
      );
      main.current.rotation.x = MathUtils.lerp(
        main.current.rotation.x,
        mouse.y * Math.PI,
        0.1
      );
    }
  });

  return (
    <Sphere
      castShadow
      ref={main}
      args={[1, 32, 32]}
      position={[0, 0, 0]}
      material={material}
    />
  );
}

interface InstancesProps {
  material: Material;
}

function Instances({ material }: InstancesProps) {
  const sphereRefs = useRef<(Mesh | null)[]>([]);
  const initialPositions: [number, number, number][] = [
    [-4, 20, -12],
    [-10, 12, -4],
    [-11, -12, -23],
    [-16, -6, -10],
    [12, -2, -3],
    [13, 4, -12],
    [14, -2, -23],
    [8, 10, -20],
  ];

  useFrame(() => {
    sphereRefs.current.forEach((el) => {
      if (el) {
        el.position.y += 0.02;
        if (el.position.y > 19) el.position.y = -18;
        el.rotation.x += 0.06;
        el.rotation.y += 0.06;
        el.rotation.z += 0.02;
      }
    });
  });

  return (
    <>
      <MainSphere material={material} />
      {initialPositions.map((position, index) => (
        <Sphere
          key={index}
          args={[1, 4]}
          position={position}
          material={material}
          ref={(ref) => {
            sphereRefs.current[index] = ref;
          }}
        />
      ))}
    </>
  );
}

function Scene() {
  const [material, setMaterial] = useState<Material | null>(null);
  const bumpMap = useTexture("/bump.jpg");
  const envMap = useCubeTexture(
    ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
    { path: "/cube/" }
  );

  return (
    <>
      <MeshDistortMaterial
        ref={setMaterial}
        envMap={envMap}
        bumpMap={bumpMap}
        color={"#010101"}
        roughness={0.1}
        metalness={1}
        bumpScale={0.005}
        clearcoat={1}
        clearcoatRoughness={1}
        radius={1}
        distort={0.4}
      />
      {material && <Instances material={material} />}
    </>
  );
}

export default function Home() {
  return (
    <Canvas
      className={style.canvas}
      dpr={[1, 2]}
      shadows
      camera={{
        position: [0, 0, 10],
        fov: 45,
        near: 0.1,
        far: 1000,
      }}
    >
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        castShadow
        intensity={2}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <Suspense fallback={<Html center>Loading.</Html>}>
        <Scene />
        <Plane
          receiveShadow
          args={[10, 10]}
          position={[0, -2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#353535" roughness={0.5} metalness={0.5} />
        </Plane>
      </Suspense>
      <Environment>
        <Lightformer intensity={10} position={[5, 10, 0]} />
        <Lightformer intensity={10} position={[0, 10, 5]} />
        <Lightformer intensity={10} position={[5, 10, 5]} />
        <Lightformer intensity={10} position={[0, 10, 0]} />
      </Environment>
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
    </Canvas>
  );
}
