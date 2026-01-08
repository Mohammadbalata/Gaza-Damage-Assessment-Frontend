import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext";

interface Props {
  setCenter: (center: [number, number]) => void;
  className?: string;
  handleReset: any;
  setNeighborhood?: (name: string) => void;
  neighborhood?: string;
}

export const locations = [
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
  {
    name: "حي السطر",
    coords: [31.3634, 34.322628] as [number, number],
  },
  {
    name: "حي الكتيبة",
    coords: [31.358792, 34.308489] as [number, number],
  },
  {
    name: "حي المحطة",
    coords: [31.350086, 34.312493] as [number, number],
  },
  {
    name: "حي مركز المدينة",
    coords: [31.349013, 34.292483] as [number, number],
  },
  {
    name: "حي الجلاء",
    coords: [31.377797, 34.313481] as [number, number],
  },
  {
    name: "حي النصر",
    coords: [31.365191, 34.292242] as [number, number],
  },
  {
    name: "حي التحرير",
    coords: [31.342449, 34.271177] as [number, number],
  },
  {
    name: "حي الشيخ ناصر",
    coords: [31.355604, 34.296072] as [number, number],
  },
];

const SelectLocations = ({
  handleReset,
  setCenter,
  className,
  setNeighborhood,
  neighborhood
}: Props) => {
  const handleChange = (e: SelectChangeEvent) => {
    const selected = locations.find((loc) => loc.name === e.target.value);
    if (selected) {
      console.log('selected' , selected)
      setCenter(selected.coords);
      if (setNeighborhood) {
        setNeighborhood(selected.name);
      }
    }
    handleReset();
  };

  const { language } = useLanguage();

  return (
    <FormControl fullWidth className={className} size="small">
      <InputLabel id="select-location-label">
        {language === "ar" ? "اختر موقع" : "Select Location"}
      </InputLabel>
      <Select
        labelId="select-location-label"
        id="select-location"
        defaultValue={neighborhood || locations[11].name}
        label={language === "ar" ? "اختر موقع" : "Select Location"}
        onChange={handleChange}
      >
        {locations.map((loc) => (
          <MenuItem key={loc.name} value={loc.name}>
            {loc.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectLocations;
