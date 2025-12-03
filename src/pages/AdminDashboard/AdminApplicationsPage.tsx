import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { adminApi, Application, Citizen, Location } from "../../services/api";
import { useAuth } from "../../contexts/AdminAuthContext";
import { Plus, Trash2, X } from "lucide-react";

const emptyForm = {
  citizenId: "",
  locationId: "",
  status: "pending" as Application["status"],
  notes: "",
};

const AdminApplicationsPage = () => {
  const { t } = useLanguage();
  const { hasRole } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [citizenResults, setCitizenResults] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [form, setForm] = useState(emptyForm);

  const canView = hasRole("admin", "supervisor");
  const canManage = hasRole("admin");

  const loadApplications = async () => {
    if (!canView) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.listApplications({ page: 1, pageSize: 100 });
      setApplications(res);
    } catch (e: any) {
      console.error(e);
      setError(t("error.loadApplications"));
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const res = await adminApi.listLocations({ page: 1, pageSize: 200 });
      setLocations(res);
    } catch (e) {
      console.error("Failed to load locations", e);
      setLocations([]);
    }
  };

  useEffect(() => {
    loadApplications();
    loadLocations();
  }, []);

  const openCreateDialog = () => {
    setEditing(null);
    setForm(emptyForm);
    setCitizenResults([]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (application: Application) => {
    setEditing(application);
    setForm({
      citizenId: String(application.citizenId),
      locationId: application.locationId ? String(application.locationId) : "",
      status: application.status,
      notes: application.notes || "",
    });
    setCitizenResults([]);
    setIsDialogOpen(true);
  };

  // Debounce helper
  let citizenSearchTimer: ReturnType<typeof setTimeout> | null = null;

  const handleCitizenSearch = async (value: string) => {
    // update the input immediately so UI reflects typing
    setForm((prev) => ({ ...prev, citizenId: value }));

    if (citizenSearchTimer) clearTimeout(citizenSearchTimer);

    // debounce network calls
    citizenSearchTimer = setTimeout(async () => {
      if (!value || value.trim().length < 1) {
        setCitizenResults([]);
        return;
      }
      try {
        // Use existing listCitizens search param to perform search
        const res = await adminApi.listCitizens({
          search: value,
          pageSize: 10,
        });
        setCitizenResults(res);
      } catch (e) {
        console.error("citizen search failed", e);
        setCitizenResults([]);
      }
    }, 350);
  };

  const handleSelectCitizen = (c: Citizen) => {
    setForm((prev) => ({ ...prev, citizenId: String(c.id) }));
    setCitizenResults([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage) return;
    const citizenId = Number(form.citizenId);
    if (Number.isNaN(citizenId)) {
      setError(t("error.invalidCitizenId"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (editing) {
        await adminApi.updateApplication(editing.id, {
          citizenId,
          status: form.status,
          notes: form.notes,
        });
      } else {
        const payload: any = {
          citizenId,
          status: form.status,
          notes: form.notes,
        };
        if (form.locationId && String(form.locationId).trim() !== "") {
          payload.locationId = Number(form.locationId);
        }

        await adminApi.createApplication(payload);
      }
      setIsDialogOpen(false);
      setEditing(null);
      setForm(emptyForm);
      loadApplications();
    } catch (e: any) {
      console.error(e);
      setError(t("error.saveApplication"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!canManage) return;
    if (
      !window.confirm(
        t("admin.applications.deleteConfirm") || "Delete application?"
      )
    )
      return;
    setLoading(true);
    setError(null);
    try {
      await adminApi.deleteApplication(id);
      loadApplications();
    } catch (e: any) {
      console.error(e);
      setError(t("error.deleteApplication"));
    } finally {
      setLoading(false);
    }
  };

  if (!canView) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{t("admin.applications")}</h1>
        <p className="text-sm text-gray-500">
          {t("admin.noApplicationsPermission") ||
            t("admin.noCitizensPermission")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t("admin.applications.title")}
          </h1>
          <p className="text-sm text-gray-500">
            {t("admin.applications.subtitle")}
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            className="btn-primary flex items-center gap-2"
            onClick={openCreateDialog}
          >
            <Plus className="w-4 h-4" />
            {t("admin.applications.create")}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-center py-3 px-2 font-semibold">
                {t("admin.applications.id")}
              </th>
              <th className="text-center py-3 px-2 font-semibold">
                {t("admin.applications.citizen")}
              </th>
              <th className="text-center py-3 px-2 font-semibold">
                {t("admin.applications.status")}
              </th>
              <th className="text-center py-3 px-2 font-semibold">
                {t("admin.applications.updated")}
              </th>
              {canManage && (
                <th className="text-center py-3 px-2 font-semibold">
                  {t("admin.actions")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {applications
              .sort((a, b) => a.id - b.id)
              .map((application) => (
                <tr key={application.id} className="border-b border-gray-100">
                  <td className="text-center py-3 px-2 font-medium">
                    #{application.id}
                  </td>
                  <td className="text-center py-3 px-2 text-gray-700">
                    {application.citizen?.first_name || "----"}
                  </td>
                  <td className="text-center py-3 px-2 capitalize">
                    {application.status}
                  </td>
                  <td className="text-center py-3 px-2 text-gray-500">
                    {new Date(application.updatedAt).toLocaleString()}
                  </td>
                  {canManage && (
                    <td className="flex justify-center py-3 px-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          onClick={() => openEditDialog(application)}
                        >
                          {t("common.edit")}
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                          onClick={() => handleDelete(application.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                          {t("common.delete")}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            {!applications.length && !loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  {t("admin.noApplicationsFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editing
                  ? t("admin.applications.update")
                  : t("admin.applications.create")}
              </h2>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("admin.applications.citizenId")}
                  </label>

                  {/* Citizen search input */}
                  <input
                    type="text"
                    className="input-field"
                    value={form.citizenId}
                    onChange={(e) => handleCitizenSearch(e.target.value)}
                    placeholder={
                      t("admin.applications.searchCitizenPlaceholder") ||
                      "Search by name or national ID"
                    }
                    required
                  />

                  {/* results dropdown */}
                  {citizenResults.length > 0 && (
                    <div className="border rounded-md mt-1 bg-white shadow-sm max-h-40 overflow-y-auto z-50">
                      {citizenResults.map((c) => (
                        <div
                          key={c.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center justify-between"
                          onClick={() => handleSelectCitizen(c)}
                        >
                          <div>
                            <div className="font-medium">
                              {c.first_name || "-"} {c.last_name || ""}
                            </div>
                            <div className="text-xs text-gray-500">
                              #{c.id} — {c.national_id}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">Select</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("admin.applications.location")}
                  </label>
                  <select
                    className="input-field"
                    value={form.locationId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        locationId: e.target.value,
                      }))
                    }
                  >
                    <option value="">
                      {t("admin.applications.noLocation")}
                    </option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={String(loc.id)}>
                        {loc.governorate || "-"} / {loc.town || "-"}{" "}
                        {loc.street ? `- ${loc.street}` : ""} (#{loc.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("admin.applications.status")}
                  </label>
                  <select
                    className="input-field capitalize"
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as Application["status"],
                      }))
                    }
                  >
                    <option value="pending">{t("status.submitted")}</option>
                    <option value="verified">{t("status.verified")}</option>
                    <option value="approved">{t("status.approved")}</option>
                    <option value="rejected">{t("status.rejected")}</option>
                    <option value="closed">
                      {t("status.closed") || "Closed"}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.applications.notes")}
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder={t("admin.applications.notesPlaceholder")}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {editing
                    ? t("admin.applications.update")
                    : t("common.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationsPage;

// === FILE: src/services/api.ts (PATCHED SNIPPET) ===
// Add this function inside the exported adminApi object (you can place it near listCitizens)

// searchCitizens is a tiny wrapper over listCitizens using the search param.
// If your backend exposes a dedicated /citizens/search endpoint you can replace the implementation.

/*
  Add inside adminApi: 

  searchCitizens: async (query: string) => {
    const res = await api.get('/citizens', { params: { search: query, pageSize: 10 } });
    return extractData<Citizen[]>(res);
  },

  But since listCitizens already supports a search param, you can use that directly from the component
*/

// No other changes required in api.ts for the frontend fixes to work.
