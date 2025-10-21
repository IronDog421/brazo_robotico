// global.d.ts
import * as THREE_NS from 'three';


declare global {
  // Declara la clase OrbitControls en el namespace THREE (tipos)
  namespace THREE {
    class OrbitControls extends THREE_NS.EventDispatcher {
      constructor(object: THREE_NS.Camera, domElement: HTMLElement);
      object: THREE_NS.Camera;
      domElement: HTMLElement;
      enabled: boolean;
      target: THREE_NS.Vector3;
      minDistance: number;
      maxDistance: number;
      maxPolarAngle: number;
      update(): void;
      dispose(): void;
    }
  }

  // Amplía el valor global `THREE` para que tenga la propiedad OrbitControls
  const THREE: typeof THREE_NS & {
    OrbitControls: typeof THREE.OrbitControls;
  };
}

export {};
