import React, { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Physics } from "@react-three/cannon";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from "react-dom/client";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import { Selection, EffectComposer, Outline } from "@react-three/postprocessing";
import { PerspectiveCamera, Stage } from "@react-three/drei";
import { Loader } from "@react-three/drei";
import CameraControls from "camera-controls";

import Chair from "./components/Chair";
import Floor from "./components/Floor";
import Scene from "./components/Scene";
import Walls from "./components/Walls";

import "./index.css";

CameraControls.install({ THREE });
extend({ CameraControls });

function Controls() {
  const EPS = 1e-5;
  const ref = useRef();
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const state = useThree();

  useFrame((state, delta) => {
    ref.current.update(delta);
  });

  useEffect(() => {
    if (!!ref.current) {
      state.controls = ref.current;
      ref.current.minDistance = 1;
      ref.current.maxDistance = 1;
      ref.current.azimuthRotateSpeed = -0.3;
      ref.current.polarRotateSpeed = -0.3;
      ref.current.truckSpeed = 10;
      ref.current.mouseButtons.wheel = null;

      ref.current.moveTo(0, 2, EPS);
    }
  }, [ref.current, camera]);

  return <cameraControls args={[camera, gl.domElement]} ref={ref} />;
}

const App = () => {
  const EPS = 1e-5;
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Suspense fallback={null}>
        <Canvas style={{ background: "grey" }}>
          <ambientLight intensity={0.2} />

          <PerspectiveCamera makeDefault position={[0, 0, EPS]} fov={60} near={0.1} far={100} />
          <directionalLight intensity={0.5} position={[6, 3, 0]} />
          <axesHelper />
          {/* 
          <Selection>
            <EffectComposer multisampling={8} autoClear={false}>
              <Outline blur visibleEdgeColor="white" edgeStrength={100} width={3000} />
            </EffectComposer>
            <Chair />
          </Selection> */}

          <Physics>
            <Floor></Floor>
            <Scene></Scene>
            <Walls></Walls>
          </Physics>
          <Controls />
        </Canvas>
      </Suspense>
      <Loader />
    </div>
  );
};

createRoot(document.getElementById("root")).render(<App></App>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
