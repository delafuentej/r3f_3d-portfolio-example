import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useGraph, useFrame } from "@react-three/fiber";
import { useGLTF, useFBX, useAnimations, useScroll } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useAtom } from "jotai";
import { sectionsAtom } from "./Experience";
import { useMobile } from "../hooks/useMobile";
import gsap from "gsap";

export function Avatar(props) {
  const { isMobile } = useMobile();
  const [section] = useAtom(sectionsAtom);

  const { scene } = useGLTF("/models/Me2.glb");
  const idle = useFBX("/animations/Idle.fbx");
  const walking = useFBX("/animations/Walking.fbx");
  const greeting = useFBX("/animations/Greeting.fbx");
  const dancing = useFBX("/animations/Dancing.fbx");
  const stop = useFBX("/animations/Stop Walking.fbx");

  // aseguramos nombres claros
  idle.animations[0].name = "Idle";
  walking.animations[0].name = "Walking";
  greeting.animations[0].name = "Greeting";
  dancing.animations[0].name = "Dancing";
  stop.animations[0].name = "Stop Walking";

  const group = useRef(null);
  const lastScroll = useRef(0);
  const isSpecialAnimRef = useRef(false); // bloquea la lógica de scroll mientras dura animación especial
  const prevActionRef = useRef(null);

  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  const { actions } = useAnimations(
    [
      ...idle.animations,
      ...walking.animations,
      ...greeting.animations,
      ...dancing.animations,
      ...stop.animations,
    ],
    group
  );

  const [animation, setAnimation] = useState("Idle");
  const scrollData = useScroll();

  // ====== useFrame: solo controla Walking / Idle y rotación (no interfiere con animaciones especiales) ======
  useFrame(() => {
    if (!group.current) return;

    // Si hay animación especial en curso, mantenemos rotación hacia el frente
    if (isSpecialAnimRef.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        0, // siempre mirar al frente mientras dura la animación especial
        0.1
      );
      lastScroll.current = scrollData.offset;
      return;
    }

    const scrollDelta = scrollData.offset - lastScroll.current;

    // Si hay scroll -> Walking
    if (Math.abs(scrollDelta) > 0.00001) {
      if (animation !== "Walking") setAnimation("Walking");

      const rotationTarget =
        scrollDelta > 0
          ? isMobile
            ? Math.PI / 2
            : 0
          : isMobile
          ? -Math.PI / 2
          : Math.PI;

      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        rotationTarget,
        0.1
      );
    } else {
      // Sin scroll -> Idle (mirando al frente)
      if (animation !== "Idle") setAnimation("Idle");

      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        0, // front
        0.1
      );
    }

    lastScroll.current = scrollData.offset;
  });

  // ====== reaccionar a cambios de sección: disparar animaciones especiales y fijar rotación al frente ======
  useEffect(() => {
    // Esperamos a que actions esté listo
    if (!actions || Object.keys(actions).length === 0) return;

    // Cuando entramos a home/contact debemos reproducir la animación especial y bloquear scroll-rotación
    if (section === "home") {
      isSpecialAnimRef.current = true;
      if (group.current) {
        gsap.killTweensOf(group.current.rotation);
        gsap.to(group.current.rotation, {
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }
      setAnimation("Greeting");
      return;
    }

    if (section === "contact") {
      isSpecialAnimRef.current = true;
      if (group.current) {
        gsap.killTweensOf(group.current.rotation);
        gsap.to(group.current.rotation, {
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }
      setAnimation("Dancing");
      return;
    }

    // Otras secciones -> permitir control normal (Idle/Walking)
    // Si no hay una animación especial en curso, forzamos Idle para que useFrame controle luego
    if (!isSpecialAnimRef.current) {
      setAnimation("Idle");
    }
  }, [section, actions, isMobile]);

  // ====== reproducción centralizada de actions + listener finished para animaciones especiales ======
  useEffect(() => {
    if (!actions || !actions[animation]) return;
    const action = actions[animation];
    const mixer = action.getMixer();

    const isSpecial = animation === "Greeting" || animation === "Dancing";

    // configuraciones de loop/clamp
    if (isSpecial) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    } else {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
    }

    // fade out acción previa (si existe y es distinta)
    if (prevActionRef.current && prevActionRef.current !== action) {
      try {
        prevActionRef.current.fadeOut(0.2);
      } catch (e) {}
    }

    // reproducir la acción actual
    action.reset();
    action.fadeIn(0.2).play();
    prevActionRef.current = action;

    // handler finished (solo atendemos si el action terminado es el mismo que estamos reproduciendo)
    const onFinished = (e) => {
      if (e.action !== action) return;
      if (isSpecial) {
        isSpecialAnimRef.current = false;
        setAnimation("Idle");
      }
    };

    mixer.addEventListener("finished", onFinished);

    return () => {
      mixer.removeEventListener("finished", onFinished);
      // limpiar fadeOut
      try {
        action.fadeOut(0.2);
      } catch (err) {}
    };
  }, [animation, actions]);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="Wolf3D_Hair"
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Glasses"
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Top"
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Bottom"
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Outfit_Footwear"
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        name="Wolf3D_Body"
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/Me2.glb");
useFBX.preload("/animations/Idle.fbx");
useFBX.preload("/animations/Walking.fbx");
useFBX.preload("/animations/Greeting.fbx");
useFBX.preload("/animations/Dancing.fbx");
useFBX.preload("/animations/Stop Walking.fbx");
