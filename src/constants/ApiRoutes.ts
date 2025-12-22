export const API = {
  admin: {
    auth: {
      signin: `/auth/admin/signin`,
      signup: `/auth/admin/signup`,
      changePassword: `/auth/admin/change-password`,
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

  },

  citizen: {
    auth:{
      login: `/auth/citizen/login`,
      verifyId: `/auth/citizen/verify-id`,
      verifyQuestions: `/auth/citizen/verify-questions`,
      completeSignup: `/auth/citizen/complete-signup`,
      changePassword: `/auth/citizen/change-password`,
    },
    applications: {
      list: `/citizen/applications`,
      create: `/citizen/applications`,
      details: (id: string) => `/citizen/applications/${id}`,
      track: (id: string) => `/citizen/applications/${id}/track`,
    },

    locations: {
      current: `/citizen/locations/current`,
      previous: `/citizen/locations/previous`,
    },

    bankAccounts: {
      list: `/citizen/bank-accounts`,
      create: `/citizen/bank-accounts`,
      update: (id: string) => `/citizen/bank-accounts/${id}`,
      delete: (id: string) => `/citizen/bank-accounts/${id}`,
    },
  },
  
  stats: {
    adminDashboard: `/stats/admin-dashboard`,
    supervisorDashboard: `/stats/supervisor-dashboard`,
  },
};