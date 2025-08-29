import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function Box() {
  return (
    <mesh rotation={[0.4, 0.2, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box />
      <OrbitControls />
    </Canvas>
  );
}
