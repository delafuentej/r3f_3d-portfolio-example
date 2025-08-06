import { SectionTitle, CouchSmall, Lamp, BookCase } from "../components";
import { useMobile } from "../hooks/useMobile";

const Skills = () => {
  const { isMobile } = useMobile();
  return (
    <group position-x={isMobile ? 0 : -2}>
      <SectionTitle position-z={1.5} rotation-y={Math.PI / 6}>
        SKILLS
      </SectionTitle>
      <BookCase position-z={-2} />
      <CouchSmall
        scale={0.4}
        position-z={0}
        position-x={-0.2}
        rotation-y={Math.PI / 3}
      />
      <Lamp
        position-z={0.6}
        position-x={-0.4}
        position-y={-0.8}
        rotation-y={-Math.PI}
      />
    </group>
  );
};

export default Skills;
