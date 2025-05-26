
import React, { ReactNode } from 'react';
import { Vector3, BoxGeometry, LineBasicMaterial, LineSegments, EdgesGeometry, MeshBasicMaterial, Mesh } from 'three';

export type Alignment = 'start' | 'center' | 'end';
export type Direction = 'x' | 'y' | 'z';
export type AlignObj = { x?: Alignment; y?: Alignment; z?: Alignment };
export type OffsetObj = { x?: number; y?: number; z?: number };
export type Padding = number | [number, number, number];

interface AutoLayoutProps {
  width?: number;
  height?: number;
  depth?: number;
  direction?: Direction;
  itemPadding?: Padding;
  itemAligns?: AlignObj[];
  itemOffsets?: OffsetObj[];
  itemAlignX?: Alignment; // 兼容默认
  itemAlignY?: Alignment;
  itemAlignZ?: Alignment;
  children: ReactNode;
  gap?: number;
  position?: [number, number, number];
  debug?: boolean;
}

function parsePadding(padding: Padding = 0): [number, number, number] {
  if (typeof padding === 'number') return [padding, padding, padding];
  if (Array.isArray(padding) && padding.length === 3) return [padding[0], padding[1], padding[2]];
  return [0, 0, 0];
}

// 多层级debug颜色
const DEBUG_COLORS = {
  container: '#ff0000', // 父容器 红
  item: '#ff0000',      // 子容器 绿
  usable: '#00ff00',    // 子容器内可用空间 蓝
};

/**
 * AutoLayout 3D 自动布局组件
 *
 * 支持每个子容器的padding、对齐、偏移。
 *
 * Props:
 * - width/height/depth: 主容器尺寸
 * - direction: 分割主轴（'x'|'y'|'z'）
 * - itemPadding: 子容器内边距，单值或[x, y, z]
 * - itemAligns: 每个子元素的对齐方式数组（{x, y, z}）
 * - itemOffsets: 每个子元素的偏移数组（{x, y, z}）
 * - debug: 是否显示 wireframe
 * - children: 3D 子元素
 */
const AutoLayout: React.FC<AutoLayoutProps> = ({
  width = 10,
  height = 10,
  depth = 10,
  direction = 'x',
  itemPadding = 0,
  itemAligns = [],
  itemOffsets = [],
  itemAlignX = 'center',
  itemAlignY = 'center',
  itemAlignZ = 'center',
  children,
  gap = 0,
  position = [0, 0, 0],
  debug = false,
}) => {
  const childrenArray = React.Children.toArray(children);
  const count = childrenArray.length;

  // 计算每个子容器的尺寸
  let childWidth = width, childHeight = height, childDepth = depth;
  switch (direction) {
    case 'x':
      childWidth = (width - gap * (count - 1)) / count;
      break;
    case 'y':
      childHeight = (height - gap * (count - 1)) / count;
      break;
    case 'z':
      childDepth = (depth - gap * (count - 1)) / count;
      break;
  }

  // 计算每个子容器的中心点
  const getChildCenter = (index: number) => {
    let x = 0, y = 0, z = 0;
    switch (direction) {
      case 'x':
        x = -width / 2 + childWidth / 2 + index * (childWidth + gap);
        break;
      case 'y':
        y = -height / 2 + childHeight / 2 + index * (childHeight + gap);
        break;
      case 'z':
        z = -depth / 2 + childDepth / 2 + index * (childDepth + gap);
        break;
    }
    return new Vector3(x, y, z);
  };

  // 计算元素在可用空间内的对齐偏移
  const getItemAlignOffset = (align: Alignment, size: number, pad: number) => {
    switch (align) {
      case 'start':
        return -size / 2 + pad;
      case 'end':
        return size / 2 - pad;
      default:
        return 0;
    }
  };

  // debug wireframe
  const DebugWireframe = ({ size, position, color }: { size: [number, number, number], position: Vector3, color: string }) => {
    const geometry = new BoxGeometry(...size);
    const edges = new EdgesGeometry(geometry);
    const material = new LineBasicMaterial({ color });
    const wireframe = new LineSegments(edges, material);
    return <primitive object={wireframe} position={position} />;
  };

  // 父容器透明体积
  const DebugContainerMesh = ({ size }: { size: [number, number, number] }) => {
    const geometry = new BoxGeometry(...size);
    const material = new MeshBasicMaterial({ color: '#ff0000', transparent: true, opacity: 0.05 });
    return <primitive object={new Mesh(geometry, material)} />;
  };

  return (
    <group position={position}>
      {debug && <DebugContainerMesh size={[width, height, depth]} />}
      {childrenArray.map((child, index) => {
        const alignObj = itemAligns[index] || {};
        const offsetObj = itemOffsets[index] || {};
        const alignX = alignObj.x || itemAlignX;
        const alignY = alignObj.y || itemAlignY;
        const alignZ = alignObj.z || itemAlignZ;
        // 子容器中心
        const center = getChildCenter(index);
        // 子容器可用空间
        const [itemPadX, itemPadY, itemPadZ] = parsePadding(itemPadding);
        const usableWidth = childWidth - 2 * itemPadX;
        const usableHeight = childHeight - 2 * itemPadY;
        const usableDepth = childDepth - 2 * itemPadZ;
        // 对齐偏移
        const alignOffset = new Vector3(
          getItemAlignOffset(alignX, usableWidth, 0),
          getItemAlignOffset(alignY, usableHeight, 0),
          getItemAlignOffset(alignZ, usableDepth, 0)
        );
        // 用户自定义偏移
        const userOffset = new Vector3(
          offsetObj.x || 0,
          offsetObj.y || 0,
          offsetObj.z || 0
        );
        // 最终偏移 = 对齐 + 用户自定义
        const finalOffset = alignOffset.add(userOffset);
        return (
          <group key={index} position={center}>
            {debug && (
              <DebugWireframe size={[childWidth, childHeight, childDepth]} position={new Vector3(0, 0, 0)} color={DEBUG_COLORS.item} />
            )}
            {debug && (
              <DebugWireframe size={[usableWidth, usableHeight, usableDepth]} position={new Vector3(0, 0, 0)} color={DEBUG_COLORS.usable} />
            )}
            <group position={finalOffset}>
              {child}
            </group>
          </group>
        );
      })}
    </group>
  );
};

export {AutoLayout}; 