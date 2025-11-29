export interface ILocationMarkerProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}