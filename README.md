# 3D AutoLayout 组件

一个适用于 React + three.js 场景的 3D 自动布局组件，支持空间均分、子容器内边距、对齐、偏移、可视化调试等高级功能。

## 功能简介
- 支持在 3D 空间中自动均分布局多个子元素
- 每个子容器支持独立的 padding、对齐方式、偏移量
- 支持 Leva 面板实时调节布局参数
- debug 模式下可视化父容器、子容器、可用空间

## 主要特性
- `direction` 支持 'x' | 'y' | 'z'，直观控制主轴
- `itemPadding` 控制每个子容器的内边距
- `itemAligns` 支持每个子元素独立对齐（x/y/z）
- `itemOffsets` 支持每个子元素独立偏移（x/y/z）
- debug 模式下父容器为半透明体积，子容器/可用空间为彩色线框

## 安装依赖

```bash
npm install three leva @react-three/fiber @react-three/drei
```

## 用法示例

```tsx
import AutoLayout from './components/AutoLayout';

<AutoLayout
  width={10}
  height={6}
  depth={4}
  direction="x"
  itemPadding={[0.5, 1.5, 0]}
  itemAligns={[
    { x: 'start', y: 'center', z: 'center' },
    { x: 'end', y: 'end', z: 'center' }
  ]}
  itemOffsets={[
    { x: 0.2, y: 0, z: 0 },
    { x: -0.2, y: 0.1, z: 0 }
  ]}
  debug
>
  <Box />
  <Box />
</AutoLayout>
```

## Leva 控制面板集成

可通过 `useControls` 实现参数的实时调节：

```tsx
const { direction, itemPadding, align0x, align0y, align0z, align1x, align1y, align1z, offset0, offset1 } = useControls({
  direction: { options: ['x', 'y', 'z'], value: 'x' },
  itemPadding: { value: [0.5, 1.5, 0] },
  align0x: { options: ['start', 'center', 'end'], value: 'start' },
  align0y: { options: ['start', 'center', 'end'], value: 'center' },
  align0z: { options: ['start', 'center', 'end'], value: 'center' },
  align1x: { options: ['start', 'center', 'end'], value: 'end' },
  align1y: { options: ['start', 'center', 'end'], value: 'end' },
  align1z: { options: ['start', 'center', 'end'], value: 'center' },
  offset0: { value: { x: 0.2, y: 0, z: 0 } },
  offset1: { value: { x: -0.2, y: 0.1, z: 0 } }
});

const itemAligns = [
  { x: align0x, y: align0y, z: align0z },
  { x: align1x, y: align1y, z: align1z }
];
const itemOffsets = [offset0, offset1];

<AutoLayout
  direction={direction}
  itemPadding={itemPadding}
  itemAligns={itemAligns}
  itemOffsets={itemOffsets}
  ...
>
  <Box />
  <Box />
</AutoLayout>
```

## API 文档

| 属性         | 类型                                   | 说明                         |
|--------------|----------------------------------------|------------------------------|
| width        | number                                 | 父容器宽度                   |
| height       | number                                 | 父容器高度                   |
| depth        | number                                 | 父容器深度                   |
| direction    | 'x' \| 'y' \| 'z'                      | 主轴方向                     |
| itemPadding  | number \| [number, number, number]      | 子容器内边距                 |
| itemAligns   | Array<{x,y,z}>                         | 每个子元素的对齐方式         |
| itemOffsets  | Array<{x,y,z}>                         | 每个子元素的偏移             |
| gap          | number                                 | 子容器间距                   |
| position     | [number, number, number]                | 父容器在场景中的位置         |
| debug        | boolean                                | 是否显示调试辅助线           |
| children     | ReactNode                              | 3D 子元素                    |

### 对齐方式说明
- 'start'：靠近子容器负方向
- 'center'：居中
- 'end'：靠近子容器正方向

## 调试与可视化
- debug 模式下，父容器为半透明红色体积
- 子容器为红色线框，可用空间为绿色线框
- 可通过 Leva 面板实时调整所有参数，观察布局变化

## 适用场景
- 3D UI 自动布局
- 3D 场景中物体阵列、分布、对齐
- 交互式 3D 编辑器、可视化工具

---

如有问题或建议，欢迎提 issue 或联系作者！
