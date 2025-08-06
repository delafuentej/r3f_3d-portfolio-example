import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Environment,
  useScroll,
  MeshDistortMaterial,
  ContactShadows,
} from "@react-three/drei";
import { Avatar } from "./Avatar";
import { Home, Skills, Projects, Contact } from "../sections";
import { config } from "../../config";
import { useMobile } from "../hooks/useMobile";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const SECTIONS_DISTANCE = 10;

const Experience = () => {
  const { isMobile, scaleFactor } = useMobile();

  const sceneContainer = useRef();
  const scrollData = useScroll();

  const homeRef = useRef();
  const skillsRef = useRef();
  const projectsRef = useRef();
  const contactRef = useRef();

  const sectionRefs = {
    home: homeRef,
    skills: skillsRef,
    projects: projectsRef,
    contact: contactRef,
  };

  const [section, setSection] = useState(config.sections[0]);
  const [previousSection, setPreviousSection] = useState(null);

  useFrame(() => {
    // scroll logic
    const currentOffset = scrollData.offset;
    const currentIndex = Math.round(currentOffset * (scrollData.pages - 1));
    const sectionKey = config.sections[currentIndex];

    if (sectionKey !== section) {
      setPreviousSection(section);
      setSection(sectionKey);
    }

    if (isMobile) {
      sceneContainer.current.position.x =
        -currentOffset * SECTIONS_DISTANCE * (scrollData.pages - 1);

      sceneContainer.current.position.z = 0;
    } else {
      sceneContainer.current.position.z =
        -currentOffset * SECTIONS_DISTANCE * (scrollData.pages - 1);
      sceneContainer.current.position.x = 0;
    }
  });

  useEffect(() => {
    if (previousSection && section !== previousSection) {
      const prevRef = sectionRefs[previousSection];
      const newRef = sectionRefs[section];

      // Oculta sección anterior
      if (prevRef.current) {
        gsap.to(prevRef.current.position, {
          y: -5,
          duration: 1,
          ease: "power2.inOut",
        });
        gsap.to(prevRef.current, {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            if (prevRef.current) {
              prevRef.current.visible = false;
            }
          },
        });
      }

      // Muestra nueva sección
      if (newRef.current) {
        newRef.current.visible = true;
        gsap.set(newRef.current.position, { y: -5 });
        gsap.set(newRef.current, { opacity: 0 });

        gsap.to(newRef.current.position, {
          y: 0,
          duration: 1.2,
          ease: "power2.out",
        });
        gsap.to(newRef.current, {
          opacity: 1,
          duration: 1.2,
        });
      }
    }
  }, [section, previousSection]);

  useGSAP(() => {
    gsap.from([".skills", ".projects"], {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: ".element",
        start: isMobile ? "top 130%" : "top 90%",
        toggleActions: "play none none none",
      },
    });
  });

  useEffect(() => {
    const handleHashChange = () => {
      const sectionIndex = config.sections.indexOf(
        window.location.hash.replace("#", "")
      );
      if (sectionIndex >= 0) {
        scrollData.el.scrollTo(
          0,
          (sectionIndex / (config.sections.length - 1)) *
            (scrollData.el.scrollHeight - scrollData.el.clientHeight)
        );
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      <Environment preset="sunset" />
      <Avatar position-z={isMobile ? -5 : 0} />
      <ContactShadows opacity={0.5} scale={[30, 30]} color="#9c8e66" />

      {/* Piso */}
      <mesh position-y={-0.001} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#46625F" />
      </mesh>

      <group ref={sceneContainer}>
        {/* HOME */}
        <group
          ref={homeRef}
          position-y={0}
          visible={section === "home"}
          renderOrder={1}
        >
          <Home />
        </group>

        {/* SKILLS */}
        <group
          ref={skillsRef}
          position-x={isMobile ? SECTIONS_DISTANCE : 0}
          position-z={isMobile ? -4 : SECTIONS_DISTANCE}
          visible={false}
          renderOrder={2}
        >
          <Skills />
          <mesh position-y={2} position-z={-4} position-x={2}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshDistortMaterial
              opacity={0.8}
              transparent
              distort={1}
              speed={5}
              color="yellow"
            />
          </mesh>
        </group>

        {/* PROJECTS */}
        <group
          ref={projectsRef}
          position-x={isMobile ? 2 * SECTIONS_DISTANCE : 0}
          position-z={isMobile ? -3 : SECTIONS_DISTANCE * 2}
          visible={false}
          renderOrder={3}
        >
          <Projects />
        </group>

        {/* CONTACT */}
        <group
          ref={contactRef}
          position-x={isMobile ? 3 * SECTIONS_DISTANCE : 0}
          position-z={isMobile ? -4 : SECTIONS_DISTANCE * 3}
          visible={false}
          renderOrder={4}
        >
          <Contact />
        </group>
      </group>
    </>
  );
};

export default Experience;
