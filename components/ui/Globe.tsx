"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, ThreeElement, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElement<typeof ThreeGlobe>;
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

type GlobePoint = {
  size: number;
  order: number;
  color: (t: number) => string;
  lat: number;
  lng: number;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  // Tracks whether the ThreeGlobe instance is attached, without reading
  // globeRef.current during render or putting it in a dependency array
  // (refs shouldn't be read during render — see react-hooks/refs).
  const [globeReady, setGlobeReady] = useState(false);

  const setGlobeRef = useCallback((node: ThreeGlobe | null) => {
    globeRef.current = node;
    setGlobeReady(!!node);
  }, []);

  const pointSize = globeConfig.pointSize ?? 1;
  const showAtmosphere = globeConfig.showAtmosphere ?? true;
  const atmosphereColor = globeConfig.atmosphereColor ?? "#ffffff";
  const atmosphereAltitude = globeConfig.atmosphereAltitude ?? 0.1;
  const polygonColor = globeConfig.polygonColor ?? "rgba(255,255,255,0.7)";
  const arcTime = globeConfig.arcTime ?? 2000;
  const arcLength = globeConfig.arcLength ?? 0.9;
  const rings = globeConfig.rings ?? 1;
  const maxRings = globeConfig.maxRings ?? 3;

  // Pure derived data — computed with useMemo instead of useEffect+setState,
  // since it only depends on props and doesn't touch any external system.
  const globeData = useMemo<GlobePoint[] | null>(() => {
    if (!data || data.length === 0) return null;

    const points: GlobePoint[] = [];
    for (let i = 0; i < data.length; i++) {
      const arc = data[i];
      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
      points.push({
        size: pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    // remove duplicates for same lat and lng
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"],
          ),
        ) === i,
    );

    return filteredPoints;
  }, [data, pointSize]);

  // Side effect on the external three.js object — legitimate use of useEffect.
  useEffect(() => {
    if (!globeReady || !globeRef.current) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity ?? 0.1;
    globeMaterial.shininess = globeConfig.shininess ?? 0.9;
  }, [
    globeReady,
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ]);

  useEffect(() => {
    if (!globeReady || !globeData || !globeRef.current) return;

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(showAtmosphere)
      .atmosphereColor(atmosphereColor)
      .atmosphereAltitude(atmosphereAltitude)
      .hexPolygonColor(() => polygonColor);

    globeRef.current
      .arcsData(data)
      .arcStartLat((d: object) => (d as Position).startLat)
      .arcStartLng((d: object) => (d as Position).startLng)
      .arcEndLat((d: object) => (d as Position).endLat)
      .arcEndLng((d: object) => (d as Position).endLng)
      .arcColor((d: object) => (d as Position).color)
      .arcAltitude((d: object) => (d as Position).arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(arcLength)
      .arcDashInitialGap((d: object) => (d as Position).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => arcTime);

    globeRef.current
      .pointsData(data)
      .pointColor((d: object) => (d as Position).color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor((d: object) => {
        const point = d as GlobePoint;
        return (t: number) => point.color(t);
      })
      .ringMaxRadius(maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((arcTime * arcLength) / rings);
  }, [
    globeReady,
    globeData,
    data,
    showAtmosphere,
    atmosphereColor,
    atmosphereAltitude,
    polygonColor,
    arcLength,
    arcTime,
    maxRings,
    rings,
  ]);

  useEffect(() => {
    if (!globeReady || !globeData || globeData.length === 0) return;

    const interval = setInterval(() => {
      if (!globeRef.current || globeData.length === 0) return;
      const numbersOfRings = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * 4) / 5),
      );

      const ringsToShow = globeData.filter((_d, i) =>
        numbersOfRings.includes(i),
      );
      if (ringsToShow.length > 0) {
        globeRef.current.ringsData(ringsToShow);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [globeReady, globeData, data.length]);

  return (
    <>
      <threeGlobe ref={setGlobeRef} />
    </>
  );
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, [gl, size.width, size.height]);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
