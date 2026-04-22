export const API = {
  admin: {
    auth: {
      signin: `/auth/admin/signin`,
      signup: `/auth/admin/signup`,
      changePassword: `/auth/admin/change-password`,
      forgotPassword: `/auth/admin/reset-password/request`,
      resetPassword: `/auth/admin/reset-password`,
    },

    users: {
      list: `/admin/users`,
      create: `/admin/users`,
      update: (id: string) => `/admin/users/${id}`,
      delete: (id: string) => `/admin/users/${id}`,
      export: `/admin/users/export`,
    },

    citizens: {
      list: `/admin/citizens`,
      create: `/admin/citizens`,
      update: (id: string) => `/admin/citizens/${id}`,
      delete: (id: string) => `/admin/citizens/${id}`,
      export: `/admin/citizens/export`,
    },

    applications: {
      create: `/admin/applications`,
      list: `/admin/applications`,
      update: (id: string) => `/admin/applications/${id}`,
      delete: (id: string) => `/admin/applications/${id}`,
      export: `/admin/applications/export`,
    },

    locations: {
      list: `/admin/locations`,
      create: `/admin/locations`,
      update: (id: string) => `/admin/locations/${id}`,
      delete: (id: string) => `/admin/locations/${id}`,
    },

    bankAccounts: {
      list: `/admin/bank-accounts`,
      create: `/admin/bank-accounts`,
      update: (id: string) => `/admin/bank-accounts/${id}`,
      delete: (id: string) => `/admin/bank-accounts/${id}`,
      export: `/admin/bank-accounts/export`,
    },

    roles: {
      list: `/admin/roles`,
      create: `/admin/roles`,
      update: (id: string) => `/admin/roles/${id}`,
      delete: (id: string) => `/admin/roles/${id}`,
      assignPermissions: (id: string) => `/admin/roles/${id}/permissions`,
    },

    permissions: {
      list: `/admin/permissions`,
      create: `/admin/permissions`,
      update: (id: string) => `/admin/permissions/${id}`,
      delete: (id: string) => `/admin/permissions/${id}`,
    },
  },

  citizen: {
    profile: `/me`,
    auth: {
      login: `/auth/login`,
      verifyId: `/auth/verification/national-id`,
      verifyQuestions: `/auth/verification/security-questions`,
      completeSignup: `/auth/complete-signup`,
      changePassword: `/auth/citizen/change-password`,
      forgotPassword: `/password/forgot`,
      resetPassword: `/auth/citizen/reset-password`,
    },
    applications: {
      notes: (id: string) => `/notes/${id}/reply`,
      list: `/damage-reports`,
      create: `/damage-reports`,
      update: (id: string) => `/citizen/applications/${id}`,
      details: (id: string) => `/citizen/applications/${id}`,
      track: (id: string) => `/citizen/applications/${id}/track`,
    },

    locations: {
      current: `/current-location`,
      previous: `/citizen/locations/previous`,
    },
    damageReports: {
      list: `/damage-reports`,
      create: `/damage-reports`,
      update: (id: string) => `/damage-reports/${id}`,
      details: (id: string) => `/damage-reports/${id}`,
      track: (id: string) => `/damage-reports/${id}/track`,
    },

    bankAccounts: {
      list: `/citizen/bank-accounts`,
      create: `/citizen/bank-accounts`,
      update: (id: string) => `/citizen/bank-accounts/${id}`,
      delete: (id: string) => `/citizen/bank-accounts/${id}`,
    },
    complaints: {
      list: `/complaints`,
      create: `/complaints`,
      details: (id: string) => `/complaints/${id}`,
      close: (id: string) => `/complaints/${id}/close`,
    },
  },

  stats: {
    adminDashboard: `/stats/admin-dashboard`,
    supervisorDashboard: `/stats/supervisor-dashboard`,
  },

  banks: {
    list: `banks`,
  },
  locations: {
    governorates: `/locations/governorates`,
    municipalities: `/locations/municipalities`,
    neighborhoods: `/locations/neighborhoods`,
    landmarks: `/locations/landmarks`,
  },
};
