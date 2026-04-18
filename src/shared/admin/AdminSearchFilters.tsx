import { useLanguage } from "../../app/providers/LanguageContext";
import { Search } from "lucide-react";

interface Filters {
  search: string;
  status: string;
  damageLevel: string;
  propertyType: string;
  dateFrom: string;
  dateTo: string;
}

interface Props {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const AdminSearchFilters = ({ filters, onFiltersChange }: Props) => {
  const { t } = useLanguage();

  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={
                t("common.search") +
                " (Tracking Number, Name, National ID, Phone)"
              }
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="input-field"
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="underReview">Under Review</option>
            <option value="verified">Verified</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <select
            value={filters.damageLevel}
            onChange={(e) => updateFilter("damageLevel", e.target.value)}
            className="input-field"
          >
            <option value="">All Damage Levels</option>
            <option value="destroyed">Completely Destroyed</option>
            <option value="severe">Severe Damage</option>
            <option value="moderate">Moderate Damage</option>
            <option value="minor">Minor Damage</option>
          </select>
        </div>

        <div>
          <select
            value={filters.propertyType}
            onChange={(e) => updateFilter("propertyType", e.target.value)}
            className="input-field"
          >
            <option value="">All Property Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="input-field"
            placeholder="From Date"
          />
        </div>

        <div>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="input-field"
            placeholder="To Date"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSearchFilters;
