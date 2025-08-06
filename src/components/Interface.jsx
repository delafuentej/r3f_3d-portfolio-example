import React, { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { atom, useAtom } from "jotai";
import { config } from "../../config";
import { useMobile } from "../hooks/useMobile";

export const projectAtom = atom(config.projects[0]);

const Interface = () => {
  const { isMobile } = useMobile();
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollData = useScroll();
  const [_project, setProject] = useAtom(projectAtom);

  // Refs para cada barra de habilidad
  const skillBarsRef = useRef([]);

  console.log("hasScrolled", hasScrolled);
  useFrame(() => {
    setHasScrolled(scrollData.offset > 0);
  });
  useEffect(() => {
    gsap.to(".scroll-down", { opacity: hasScrolled ? 0.1 : 1, duration: 0.5 });
    gsap.fromTo(
      ".scroll-down-wheel",
      { translateY: 0 },
      {
        translateY: 4,
        duration: 0.4,
        repeat: -1,
        repeatDelay: 0.5,
        ease: "power2.inOut",
      }
    );
    gsap.fromTo(
      [".skills", ".skill"],
      { opacity: 0 },

      { opacity: 1, duration: 1.5 }
    );
    skillBarsRef.current.forEach((bar, index) => {
      const level = config.skills[index]?.level || 0;
      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: `${level}%`,
          duration: 1,
          delay: isMobile ? 0 : index * 0.4,
          ease: "power2.out",
        }
      );
    });
  }, [hasScrolled]);
  return (
    <div className="interface">
      <div className="sections">
        {/* home */}
        <section className="section section-bottom">
          <div className="scroll-down">
            {/* animation init: opacity: 0 ; hasScrolled ? 0 : 1 */}
            <div className="scroll-down-wheel">
              {/* animation translateY: 0 ; translateY: 4,  duration: 0.4, repeatDelay: 0.5,  repeatType: "reverse, repeat:-1" */}
            </div>
          </div>
        </section>
        {/* skills*/}
        <section className="section section-right mobile-section-left mobile-section-bottom">
          <div className="skills">
            {/* init= opacity: 0 to opacity: 1 */}

            {config.skills.map((skill, index) => (
              <div key={skill.name} className="skill">
                {/* initial opacity  to opacity: 1* duration: 1; delay: index * 0.62 */}
                <div className="skill-label">
                  <img
                    className="skill-label-img"
                    src={skill.icon}
                    alt={skill.name}
                  />
                  <h2 className="skill-label-name">{skill.name}</h2>
                </div>
                <div className="skill-level">
                  <div
                    className="skill-level-bar"
                    ref={(el) => (skillBarsRef.current[index] = el)}
                  >
                    {/* initial width: 0 to width: ${skill.level}% duration: 1 delay: index * 0.62 */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* projects */}
        <section className="section section-left mobile-section-bottom">
          <div className="projects">
            {/* opacity:0  to opacity:1 */}

            {config.projects.map((project, index) => (
              <div
                key={project.name}
                className="project"
                onMouseEnter={() => setProject(project)}
              >
                {/* opacity:0  to opacity:1  duration: 1 delay index* 0.5*/}
                <a href={project.link} target="_blank">
                  <img
                    className="project-image"
                    src={project.image}
                    alt={project.name}
                  />
                  <div className="project-details">
                    <h2 className="project-details-name">{project.name}</h2>
                    <p className="project-details-description">
                      {project.description}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
        {/* contact */}
        <section className="section section-left mobile-section-bottom">
          <div className="contact">
            {/* opacity:0  to opacity:1 */}
            <h1 className="contact-name">{config.contact.name}</h1>
            <div className="contact-address">{config.contact.address}</div>
            <div className="contact-socials">
              {config.contact.socials.map((social) => (
                <a
                  key={social.name}
                  href={
                    social.name === "mail"
                      ? `mailto:${social.link}`
                      : social.link
                  }
                  target="_blank"
                  className="contact-socials-link"
                >
                  <img
                    className="contact-socials-image"
                    src={social.image}
                    alt={social.name}
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Interface;
