interface Props {
  setCenter: (center: [number, number]) => void;
}

const locations = [
  {
    name: "المواصي الشمالي",
    coords: [31.377569, 34.28825] as [number, number],
  },
  {
    name: "المواصي الجنوبي",
    coords: [31.352236, 34.259319] as [number, number],
  },
  {
    name: "حي السلام",
    coords: [31.302883, 34.294406] as [number, number],
  },
  {
    name: "حي قيزان النجار",
    coords: [31.321494, 34.294059] as [number, number],
  },
  {
    name: "حي قيزان ابو رشوان",
    coords: [31.329003, 34.283144] as [number, number],
  },
  {
    name: "حي البطن السمين",
    coords: [31.338248, 34.294396] as [number, number],
  },
  {
    name: "حي جورت اللوت",
    coords: [31.332156, 34.303463] as [number, number],
  },
  {
    name: "حي قاع القرين",
    coords: [31.315155, 34.308796] as [number, number],
  },
];

const SelectLocations = ({ setCenter }: Props) => {
  return (
    <select
      className="border p-2 rounded"
      onChange={(e) => {
        const selected = locations.find((loc) => loc.name === e.target.value);
        if (selected) {
          setCenter(selected.coords);
        }
      }}
    >
      <option value="">اختر موقع</option>
      {locations.map((loc) => (
        <option key={loc.name} value={loc.name}>
          {loc.name}
        </option>
      ))}
    </select>
  );
};

export default SelectLocations;
