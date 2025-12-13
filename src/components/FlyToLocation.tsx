import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface FlyToLocationProps {
  target: [number, number];
}

const FlyToLocation: React.FC<FlyToLocationProps> = ({ target }) => {
  const map = useMap();

  useEffect(() => {
    if (!target) return;

    const currentCenter = map.getCenter();

    // 1️⃣ Zoom out (كأنه طالع من المكان)
    map.flyTo(currentCenter, 3, {
      duration: 1.5,
    });

    // 2️⃣ بعد الزووم أوت → انتقل للمكان الجديد (لسا بعيد)
    setTimeout(() => {
      map.flyTo(target, 3, {
        duration: 2,
      });
    }, 1500);

    // 3️⃣ Zoom in على المكان الجديد
    setTimeout(() => {
      map.flyTo(target, 16, {
        duration: 2,
      });
    }, 3500);

  }, [target, map]);

  return null;
};

export default FlyToLocation;
