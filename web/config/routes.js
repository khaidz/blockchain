export default [
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      {
        exact: true,
        name: 'landing',
        path: '/index',
        wrappers: ['@/wrappers/LandingWrappers'],
        component: './Landing'
      },
      {
        exact: true,
        name: 'landing',
        path: '/index2',
        component: './LandingAdmin'
      },
      {
        path: '/receptionist',
        component: '../layouts/BasicLayout',
        wrappers: ['@/wrappers/Receptionist'],
        routes: [
          {
            path: '/receptionist',
            redirect: '/receptionist/manage-patient'
          },
          {
            exact: true,
            name: 'manage-patient',
            icon: 'FormOutlined',
            path: '/receptionist/manage-patient',
            component: './ManagePatient'
          },
          {
            exact: true, 
            name: "profile",
            icon: 'UserOutlined',
            path: '/receptionist/profile',
            component: './Profile'
          },
          {
            component: './404',
          },
        ],
      },
      {
        path: '/physician',
        component: '../layouts/BasicLayout',
        wrappers: ['@/wrappers/Physician'],
        routes: [
          {
            path: '/physician',
            redirect: '/physician/manage-health-record'
          },
          {
            exact: true,
            path: '/physician/manage-health-record',
            component: './ManageHealthRecord',
            icon: 'TeamOutlined',
            name: "manage-health-record"
          },
          // {
          //   exact: true,
          //   path: '/physician/manage-medical-bill',
          //   component: './ManageMedicalBill',
          //   icon: 'TeamOutlined',
          //   name: "manage-medical-bill"
          // },
          {
            exact: true, 
            name: "profile",
            icon: 'UserOutlined',
            path: '/physician/profile',
            component: './Profile'
          },
        ]
      },{
        path: '/admin',
        component: '../layouts/BasicLayout',
        wrappers: ['@/wrappers/Admin'],
        routes: [
          {
            path: '/admin',
            redirect: '/admin/manager-staff'
          },
          {
            exact: true,
            path: '/admin/manager-staff',
            icon: 'TeamOutlined',
            component: './ManageStaff',
            name: 'manage-staff'
          },
          {
            exact: true,
            path: '/admin/manager-department',
            component: './ManageDepartment',
            icon: 'BankOutlined',
            name: 'manage-department'
          },
          {
            exact: true,
            path: '/admin/manager-room',
            component: './ManageRoom',
            icon: 'HomeOutlined',
            name: 'manage-room'
          },
          {
            exact: true,
            path: '/admin/manager-drug',
            component: './ManageDrug',
            icon: 'ExperimentOutlined',
            name: 'manage-drug'
          },
          {
            exact: true,
            path: '/admin/manager-subclinical',
            component: './ManageSubclinical',
            icon: 'ThunderboltOutlined',
            name: 'manage-subclinical'
          },
          {
            exact: true,
            path: '/admin/analysis',
            icon: 'BarChartOutlined',
            component: './Analysis',
            name: 'analysis'
          },
          {
            exact: true,
            path: '/admin/profile',
            icon: 'UserOutlined',
            component: './Profile',
            name: 'profile'
          }
        ]
      },
      {
        path: '/404',
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },

];
