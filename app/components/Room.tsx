import { useRef } from "react";
import {
  Material,
} from "three";
import { Geometry, Base, Subtraction } from "@react-three/csg";
import { PivotControls } from "@react-three/drei";
import * as THREE from "three";

interface RoomProps {
  width?: number; // 房间宽度
  height?: number; // 房间高度
  depth?: number; // 房间深度
  wallThickness?: number; // 墙壁厚度
  doorWidth?: number; // 门的宽度
  doorHeight?: number; // 门的高度
}

const box = new THREE.BoxGeometry();

const Door = (props) => (
  <Subtraction {...props}>
    <Geometry>
      <Base geometry={box} scale={[1, 2, 1]} />
    </Geometry>
  </Subtraction>
)
export function Room({
  width = 10,
  height = 5,
  depth = 10,
  wallThickness = 0.2,
  doorWidth = 2,
  doorHeight = 3,
  ...props
}: RoomProps) {
  const csgRef = useRef<any>(null);


  return (
    <mesh
      castShadow
      receiveShadow
      position={[0, height / 2, 0]}
      {...props}
    >
      <Geometry ref={csgRef} computeVertexNormals>
        {/* 外部盒子 */}
        <Base name="wall" geometry={box} scale={[width, height, depth]} />
        <Subtraction
          name="cavity"
          geometry={box}
          position={[0, wallThickness / 2, 0]}
          scale={[
            width - wallThickness * 2,
            height - wallThickness,
            depth - wallThickness * 2,
          ]}
        />

        <PivotControls 
        activeAxes={[false, false, false]} 
        disableRotations
        disableScaling
        scale={1} 
        annotations
        anchor={[0, 0, 0]} 
        onDrag={() => csgRef.current.update()}>
          <Door 
          rotation={[0, 0, 0]} 
          position={[0, -height / 2 + doorHeight / 2, depth / 2]}
          scale={[doorWidth, doorHeight, wallThickness * 2]} 
          />
        </PivotControls>
      </Geometry>
      <meshStandardMaterial envMapIntensity={0.25} />
    </mesh>
  );
}
