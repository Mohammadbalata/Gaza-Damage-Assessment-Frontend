import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Container,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Stack,
  MenuItem,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Plus, Trash2, Edit2, Search, Import } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { bankAccountSchema } from "../../services/validation";
import FormTextField from "../../components/Shared/FormTextField";
import ErrorAlert from "../../components/Shared/ErrorAlert";
import ConfirmDialog from "../../components/Shared/ConfirmDialog";
import { useNotification } from "../../hooks/useNotifications";
import { useDelete, useGet, usePatch, usePost } from "../../hooks/api/useApi";
import {
  BankAccount,
  Citizen,
  Bank,
  AccountType,
  AccountStatus,
} from "../../types/entities";
import { titleCase } from "../../utils/helpers";
import { API } from "../../constants/ApiRoutes";
import { permissions } from "../../constants/permissions";

interface BankAccountFormData {
  bankId: string;
  accountHolderName: string;
  accountNumber: string;
  iban?: string;
  accountType: AccountType;
  currency: string;
  isPrimary?: boolean;
  status?: AccountStatus;
}

// Status color mapping
const statusColors: Record<string, any> = {
  ACTIVE: "success",
  INACTIVE: "warning",
  SUSPENDED: "error",
  CLOSED: "default",
};

// Account type translations
const accountTypeTranslations: Record<string, { en: string; ar: string }> = {
  SAVINGS: { en: "Savings", ar: "توفير" },
  CURRENT: { en: "Current", ar: "جاري" },
  WALLET: { en: "Wallet", ar: "محفظة" },
};

// Status translations
const statusTranslations: Record<string, { en: string; ar: string }> = {
  ACTIVE: { en: "Active", ar: "نشط" },
  SUSPENDED: { en: "Suspended", ar: "معلق" },
  CLOSED: { en: "Closed", ar: "مغلق" },
};

// Currency translations
const currencyTranslations: Record<string, { en: string; ar: string }> = {
  ILS: { en: "ILS (₪)", ar: "شيكل (₪)" },
  USD: { en: "USD ($)", ar: "دولار ($)" },
  EUR: { en: "EUR (€)", ar: "يورو (€)" },
  JOD: { en: "JOD (JD)", ar: "دينار (JD)" },
};

export function AdminBankingPage() {
  const { t, language } = useLanguage();
  const { hasPermission } = useAuth();
  const { showSuccess, showError } = useNotification();

  const canManage = hasPermission(permissions.bank_account.create);
  const canView = hasPermission(permissions.bank_account.view);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BankAccount | null>(null);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    citizenId: number | null;
    accountId: string | null;
  }>({ open: false, citizenId: null, accountId: null });

  // Citizen search
  const [citizenSearch, setCitizenSearch] = useState("");
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);

  // Form
  const {
    control,
    handleSubmit,
    reset,
    // setValue,
    formState: { isSubmitting },
  } = useForm<BankAccountFormData>({
    resolver: yupResolver(bankAccountSchema) as any,
    defaultValues: {
      bankId: "",
      accountHolderName: "",
      accountNumber: "",
      iban: "",
      accountType: AccountType.SAVINGS,
      currency: "ILS",
      isPrimary: false,
      status: AccountStatus.ACTIVE,
    },
  });

  const {
    loading,
    data: bankAccounts,
    setData,
  } = useGet<BankAccount[]>(API.admin.bankAccounts.list, {
    immediate: true,
  });

  const { data: banks } = useGet<Bank[]>(API.banks.list, {
    immediate: true,
  });

  const { data: options, loading: citizenLoading } = useGet<any>(
    API.admin.citizens.list,
    { immediate: true }
  );
  const citizenOptions = options?.data

  const { loading: loadingDeleteAccount, execute } = useDelete({
    onSuccess: () => {
      showSuccess(t("success.bankAccountDeleted"));
      setData((prev) =>
        prev
          ? prev.filter(
              (a) =>
                !(
                  a.citizenId === deleteConfirm.citizenId &&
                  a.id === deleteConfirm.accountId
                )
            )
          : prev
      );
      setDeleteConfirm({ open: false, citizenId: null, accountId: null });
    },
    onError: (error) => {
      showError(error || t("error.deleteBankAccount"));
    },
  });

  const { loading: loadingCreateAccount, execute: executeCreateAccount } =
    usePost(API.admin.bankAccounts.create, {
      onSuccess: (data) => {
        setData((prev) => (prev ? [data, ...prev] : [data]));
        showSuccess(t("success.bankAccountCreated"));
        setIsDialogOpen(false);
        reset();
        setSelectedCitizen(null);
        setCitizenSearch("");
      },
      onError: (error) => {
        showError(error || t("error.createBankAccount"));
      },
    });

  const { loading: loadingUpdateAccount, execute: executeUpdateAccount } =
    usePatch({
      onSuccess: (data) => {
        setData(
          (prev) =>
            prev?.map((a) =>
              a.citizenId === data.citizenId && a.id === data.id ? data : a
            ) || prev
        );
        showSuccess(t("success.bankAccountUpdated"));
        setIsDialogOpen(false);
        reset();
        setSelectedCitizen(null);
        setCitizenSearch("");
      },
      onError: (error) => {
        showError(error || t("error.updateBankAccount"));
      },
    });

  // Open create dialog
  const openCreateDialog = () => {
    setEditing(null);
    reset({
      bankId: "",
      accountHolderName: "",
      accountNumber: "",
      iban: "",
      accountType: AccountType.SAVINGS,
      currency: "ILS",
      isPrimary: false,
      status: AccountStatus.ACTIVE,
    });
    setSelectedCitizen(null);
    setCitizenSearch("");
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (account: BankAccount) => {
    setEditing(account);
    reset({
      bankId: account.bankId,
      accountHolderName: account.accountHolderName,
      accountNumber: account.accountNumber,
      iban: account.iban || "",
      accountType: account.accountType,
      currency: account.currency,
      isPrimary: account.isPrimary,
      status: account.status,
    });
    setSelectedCitizen(account.citizen || null);
    setCitizenSearch(account.citizen?.full_name || "");
    setIsDialogOpen(true);
  };

  // Handle submit
  const onSubmit = async (data: BankAccountFormData) => {
    if (editing) {
      executeUpdateAccount(
        API.admin.bankAccounts.update(editing.id.toString()),
        { ...data, citizenId: editing.citizenId }
      );
    } else {
      if (selectedCitizen) {
        executeCreateAccount({ ...data, citizenId: selectedCitizen.id });
      }
    }
  };

  // Handle export
  const handleExportData = () => {
    fetch(
      `https://backend-5549.onrender.com/api${API.admin.bankAccounts.export}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server error while downloading Excel");
        }
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "bank-accounts.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to download Excel file");
      });
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm.citizenId || !deleteConfirm.accountId) return;
    execute(API.admin.bankAccounts.delete(deleteConfirm.accountId));
  };

  const filteredAccounts = bankAccounts?.filter(
    (account) =>
      account.accountNumber.includes(search) ||
      account.accountHolderName.toLowerCase().includes(search.toLowerCase()) ||
      account.citizen?.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      account.citizen?.national_id?.includes(search)
  );

  if (!canView) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorAlert
          message={t("admin.noBankingPermission")}
          severity="warning"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t("admin.banking.title")}
          </Typography>
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            {t("admin.banking.subtitle")}
          </Typography>
        </Box>
        {hasPermission(permissions.bank_account.export) && (
          <span className="flex justify-center items-center gap-3">
            <Button
              variant="contained"
              color="inherit"
              startIcon={
                <Import
                  className={`${language == "ar" ? "ml-2" : ""}`}
                  size={20}
                />
              }
              onClick={handleExportData}
            >
              {t("admin.banking.export")}
            </Button>
            <Button
              variant="contained"
              startIcon={
                <Plus
                  className={`${language == "ar" ? "ml-2" : ""}`}
                  size={20}
                />
              }
              onClick={openCreateDialog}
            >
              {t("admin.banking.create")}
            </Button>
          </span>
        )}
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder={t("common.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} style={{ marginRight: 8 }} />,
          }}
          size="small"
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : filteredAccounts?.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "textSecondary" }}>
            <Typography>{t("admin.noBankAccountsFound")}</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell align="center">
                  {t("admin.banking.citizen")}
                </TableCell>
                <TableCell align="center">
                  {t("admin.banking.accountHolder")}
                </TableCell>
                <TableCell align="center">
                  {t("admin.banking.accountNumber")}
                </TableCell>
                <TableCell align="center">{t("admin.banking.bank")}</TableCell>
                <TableCell align="center">{t("admin.banking.type")}</TableCell>
                <TableCell align="center">
                  {t("admin.banking.currency")}
                </TableCell>
                <TableCell align="center">
                  {t("admin.banking.status")}
                </TableCell>
                {canManage && (
                  <TableCell align="center">{t("admin.actions")}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccounts?.map((account: BankAccount) => (
                <TableRow
                  key={`${account.citizenId}-${account.id}`}
                  hover
                  sx={{ "&:last-child td": { border: 0 } }}
                >
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="medium">
                      {account.citizen?.full_name || "----"}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {account.citizen?.national_id}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {account.accountHolderName}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {account.accountNumber}
                    </Typography>
                    {account.iban && (
                      <Typography variant="caption" color="textSecondary">
                        {account.iban}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {language == "ar"
                      ? account?.bank?.arName
                      : titleCase(account?.bank?.enName || "----")}
                  </TableCell>
                  <TableCell align="center">
                    {accountTypeTranslations[account.accountType]?.[language] ||
                      account.accountType}
                  </TableCell>
                  <TableCell align="center">
                    {currencyTranslations[account.currency]?.[language] ||
                      account.currency}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={
                        statusTranslations[account.status]?.[language] ||
                        account.status
                      }
                      size="small"
                      color={statusColors[account.status]}
                    />
                  </TableCell>

                  {canManage && (
                    <TableCell align="center">
                      <Box>
                        <Button
                          size="small"
                          startIcon={
                            <Edit2
                              className={`${language == "ar" ? "ml-2" : ""}`}
                              size={16}
                            />
                          }
                          onClick={() => openEditDialog(account)}
                        >
                          {t("common.edit")}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={
                            <Trash2
                              className={`${language == "ar" ? "ml-2" : ""}`}
                              size={16}
                            />
                          }
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              citizenId: account.citizenId,
                              accountId: account.id,
                            })
                          }
                        >
                          {t("common.delete")}
                        </Button>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editing ? t("admin.banking.update") : t("admin.banking.create")}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            {/* Citizen Search Autocomplete */}
            {editing ? (
              <TextField
                label={t("admin.banking.citizen")}
                value={`${selectedCitizen?.full_name} (${selectedCitizen?.national_id})`}
                disabled
                fullWidth
              />
            ) : (
              <Autocomplete
                options={citizenOptions || []}
                getOptionLabel={(option) =>
                  `${option.full_name || option.first_name || ""} (${
                    option.national_id
                  })`
                }
                loading={citizenLoading}
                value={selectedCitizen}
                onChange={(_, newValue) => {
                  setSelectedCitizen(newValue);
                }}
                inputValue={citizenSearch}
                onInputChange={(_, newInputValue) => {
                  setCitizenSearch(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("admin.banking.citizen")}
                    placeholder={
                      t("admin.banking.searchCitizenPlaceholder") ||
                      "Search by name or national ID"
                    }
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {citizenLoading && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}

            <FormTextField
              control={control}
              name="bankId"
              label={t("admin.banking.bank")}
              select
            >
              {banks?.map((bank) => (
                <MenuItem key={bank.id} value={bank.id}>
                  {language == "ar"
                    ? bank.arName
                    : bank.enName.toLocaleLowerCase()}
                </MenuItem>
              ))}
            </FormTextField>

            <FormTextField
              control={control}
              name="accountHolderName"
              label={t("admin.banking.accountHolder")}
            />

            <FormTextField
              control={control}
              name="accountNumber"
              label={t("admin.banking.accountNumber")}
            />

            <FormTextField
              control={control}
              name="iban"
              label={t("admin.banking.iban")}
            />

            <FormTextField
              control={control}
              name="accountType"
              label={t("admin.banking.type")}
              select
            >
              {Object.entries(accountTypeTranslations).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value[language]}
                </MenuItem>
              ))}
            </FormTextField>

            <FormTextField
              control={control}
              name="currency"
              label={t("admin.banking.currency")}
              select
            >
              {Object.entries(currencyTranslations).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value[language]}
                </MenuItem>
              ))}
            </FormTextField>

            {editing && (
              <FormTextField
                control={control}
                name="status"
                label={t("admin.banking.status")}
                select
              >
                {Object.entries(statusTranslations).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value[language]}
                  </MenuItem>
                ))}
              </FormTextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit as any)}
            variant="contained"
            disabled={
              isSubmitting || loadingCreateAccount || loadingUpdateAccount
            }
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : editing ? (
              t("admin.banking.update")
            ) : (
              t("common.submit")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title={t("admin.banking.deleteConfirm")}
        message={""}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isLoading={loadingDeleteAccount}
        isDangerous
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteConfirm({ open: false, citizenId: null, accountId: null })
        }
      />
    </Container>
  );
}

export default AdminBankingPage;
