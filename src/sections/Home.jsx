import * as THREE from "three";
import { Float, Center } from "@react-three/drei";
import { Star, MacBookPro, PalmTree, SectionTitle } from "../components";
import { config } from "../../config";
import { useMobile } from "../hooks/useMobile";

const Home = () => {
  const { isMobile, scaleFactor } = useMobile();
  return (
    <group>
      <SectionTitle position-x={0.5}>HOME</SectionTitle>
      <Star position-z={isMobile ? -5 : 0} position-y={2.2} scale={0.3} />
      <Float floatIntensity={2} speed={2}>
        <MacBookPro
          position-x={isMobile ? -0.5 : -1}
          position-y={isMobile ? 1 : 0.5}
          position-z={isMobile ? -2 : 0}
          scale={0.3}
          rotation-y={Math.PI / 4}
        />
      </Float>
      <PalmTree
        scale={0.018}
        rotation-y={THREE.MathUtils.degToRad(140)}
        position={isMobile ? [1, 0, -4] : [4 * scaleFactor, 0, -5]}
      />

      <group scale={isMobile ? 0.3 : 1}>
        <Float floatIntensity={0.6} position-y={2} position-z={-3}>
          <Center disableY disableZ>
            <SectionTitle
              size={0.8}
              position-y={1.6}
              bevelEnabled
              bevelThickness={0.3}
            >
              {config.home.title}
            </SectionTitle>
          </Center>
        </Float>
        <Center disableY disableZ position-y={1} position-z={-3}>
          <SectionTitle
            size={1.2}
            position-x={-2.6}
            position-z={-3}
            bevelEnabled
            bevelThickness={0.3}
            rotation-y={Math.PI / 10}
          >
            {config.home.subtitle}
          </SectionTitle>
        </Center>
      </group>
    </group>
  );
};
export default Home;
