import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { config } from "../config";
import { Experience, Interface, TopbarMenu, LoadingScreen } from "./components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <>
      <LoadingScreen />
      <Canvas camera={{ position: [0, 0.5, 5], fov: 42 }}>
        <color attach="background" args={["#1d1d1d"]} />
        <fog attach="fog" args={["#1d1d1d", 10, 50]} />
        <ScrollControls
          pages={config.sections.length}
          damping={0.1}
          maxSpeed={0.2}
        >
          <group position-y={-1}>
            <Suspense>
              <Experience />
            </Suspense>
          </group>
          <Scroll html>
            <Interface />
          </Scroll>
        </ScrollControls>
      </Canvas>
      <TopbarMenu />
    </>
  );
}

export default App;
