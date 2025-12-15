// 
import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface Props {
  target: [number, number];
}

// const GAZA_CENTER: [number, number] = [31.4167, 34.3333];
const GAZA_CENTER: [number, number] = [31.4167, 34.3333];
const GAZA_ZOOM = 10; // مستوى يغطّي قطاع غزة فقط

const TARGET_ZOOM = 15;  // زووم المكان النهائي

export default function FlyToWithAnimation({ target }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!target) return;

    // المرحلة 1: Zoom out إلى فلسطين
    map.flyTo(GAZA_CENTER, GAZA_ZOOM, {
      duration: 1.5,
      easeLinearity: 0.25,
    });

    // المرحلة 2: Zoom in إلى الموقع الجديد
    const timeout = setTimeout(() => {
      map.flyTo(target, TARGET_ZOOM, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }, 1600);

    return () => clearTimeout(timeout);
  }, [target, map]);

  return null;
}
