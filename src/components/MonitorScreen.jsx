import { useTexture } from "@react-three/drei";
import { useAtom } from "jotai";
import { projectAtom } from "./Interface";
import { config } from "../../config";

const MonitorScreen = ({ ...props }) => {
  const [project] = useAtom(projectAtom);

  const projectTexture = useTexture(project.image);
  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[1.14, 0.66]} />
        <meshBasicMaterial map={projectTexture} />
      </mesh>
      {/* Add more elements here as needed */}
    </group>
  );
};

config.projects.forEach((project) => {
  useTexture.preload(project.image);
});

export default MonitorScreen;
