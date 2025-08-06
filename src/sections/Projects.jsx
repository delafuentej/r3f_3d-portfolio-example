import { SectionTitle, Monitor, MonitorScreen } from "../components";
import { RoundedBox } from "@react-three/drei";
import { useMobile } from "../hooks/useMobile";

const Projects = () => {
  const { isMobile } = useMobile();
  return (
    <group position-x={isMobile ? -0.25 : 1}>
      <SectionTitle position-x={-0.5} position-z={0} rotation-y={-Math.PI / 6}>
        PROJECTS
      </SectionTitle>

      <group
        position-x={0.5}
        position-z={0}
        rotation-y={-Math.PI / 6}
        scale={0.8}
      >
        <MonitorScreen
          rotation-x={-0.18}
          position-z={-0.895}
          position-y={1.74}
        />
        <Monitor
          scale={0.02}
          position-y={1}
          rotation-y={-Math.PI / 2}
          position-z={-1}
        />
        <RoundedBox scale-x={2} position-y={0.5} position-z={-1}>
          <meshStandardMaterial color="white" />
        </RoundedBox>
      </group>
    </group>
  );
};

export default Projects;
