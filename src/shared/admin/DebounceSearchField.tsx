import { useCallback, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { Citizen } from "../types/entities";
import { api } from "../api/api";
import { API } from "../constants/ApiRoutes";
import { Loader } from "lucide-react";
import FormTextField from "../components/FormTextField";


type Props = {
  control: any;
  label: string;
  placeholder?: string;
  onSelect: (citizenId: number) => void;
  delay?: number;
};

export default function DebounceSearchField({
  control,
  label,
  placeholder,
  onSelect,
  delay = 500,
}: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchUsers = async (query: string) => {
    setLoading(true);
    try {
      const searchQuery = Number(query)
        ? `nationalId=${query}`
        : `fullName=${query}`;

      const res = await api.get(`${API.admin.citizens.list}?${searchQuery}`);

      setUsers(res.data.data.data);
    } catch (e: any) {
      console.log(e?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (value.trim()) fetchUsers(value);
      }, delay),
    [delay],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleSelect = (citizen: Citizen) => {
    const label = `${
      citizen.full_name || citizen.first_name || ""
    } (${citizen.national_id})`;

    setSearchValue(label);
    setSelectedId(citizen.id);
    onSelect(citizen.id);
    setUsers([]); // close dropdown
  };

  return (
    <div className="relative">
      <FormTextField
        control={control}
        label={label}
        placeholder={placeholder}
        value={searchValue}
        name="name"
        onChange={onChange}
      />

      {searchValue && users.length > 0 && (
        <div className="absolute z-10 top-full left-0 w-full mt-1 bg-white rounded-lg shadow max-h-60 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-2">
              <Loader />
            </div>
          ) : (
            users.map((citizen) => {
              const text = `${
                citizen.full_name || citizen.first_name || ""
              } (${citizen.national_id})`;

              return (
                <button
                  key={citizen.id}
                  onClick={() => handleSelect(citizen)}
                  className={`w-full text-left px-3 py-2 font-bold rounded hover:bg-gray-100 ${
                    selectedId === citizen.id ? "bg-gray-100" : ""
                  }`}
                >
                  {text}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
