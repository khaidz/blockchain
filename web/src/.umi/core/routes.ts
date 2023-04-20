// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/home/khaibq/blockchain/web/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": require('/home/khaibq/blockchain/web/src/layouts/AuthLayout').default,
    "routes": [
      {
        "exact": true,
        "name": "landing",
        "path": "/index",
        "wrappers": [require('@/wrappers/LandingWrappers').default],
        "component": require('/home/khaibq/blockchain/web/src/pages/Landing').default
      },
      {
        "exact": true,
        "name": "landing",
        "path": "/index2",
        "component": require('/home/khaibq/blockchain/web/src/pages/LandingAdmin').default
      },
      {
        "path": "/receptionist",
        "component": require('/home/khaibq/blockchain/web/src/layouts/BasicLayout').default,
        "wrappers": [require('@/wrappers/Receptionist').default],
        "routes": [
          {
            "path": "/receptionist",
            "redirect": "/receptionist/manage-patient",
            "exact": true
          },
          {
            "exact": true,
            "name": "manage-patient",
            "icon": "FormOutlined",
            "path": "/receptionist/manage-patient",
            "component": require('/home/khaibq/blockchain/web/src/pages/ManagePatient').default
          },
          {
            "exact": true,
            "name": "profile",
            "icon": "UserOutlined",
            "path": "/receptionist/profile",
            "component": require('/home/khaibq/blockchain/web/src/pages/Profile').default
          },
          {
            "component": require('/home/khaibq/blockchain/web/src/pages/404').default,
            "exact": true
          }
        ]
      },
      {
        "path": "/physician",
        "component": require('/home/khaibq/blockchain/web/src/layouts/BasicLayout').default,
        "wrappers": [require('@/wrappers/Physician').default],
        "routes": [
          {
            "path": "/physician",
            "redirect": "/physician/manage-health-record",
            "exact": true
          },
          {
            "exact": true,
            "path": "/physician/manage-health-record",
            "component": require('/home/khaibq/blockchain/web/src/pages/ManageHealthRecord').default,
            "icon": "TeamOutlined",
            "name": "manage-health-record"
          },
          {
            "exact": true,
            "name": "profile",
            "icon": "UserOutlined",
            "path": "/physician/profile",
            "component": require('/home/khaibq/blockchain/web/src/pages/Profile').default
          }
        ]
      },
      {
        "path": "/admin",
        "component": require('/home/khaibq/blockchain/web/src/layouts/BasicLayout').default,
        "wrappers": [require('@/wrappers/Admin').default],
        "routes": [
          {
            "path": "/admin",
            "redirect": "/admin/manager-staff",
            "exact": true
          },
          {
            "exact": true,
            "path": "/admin/manager-staff",
            "icon": "TeamOutlined",
            "component": require('/home/khaibq/blockchain/web/src/pages/ManageStaff').default,
            "name": "manage-staff"
          },
          {
            "exact": true,
            "path": "/admin/manager-department",
            "component": require('/home/khaibq/blockchain/web/src/pages/ManageDepartment').default,
            "icon": "BankOutlined",
            "name": "manage-department"
          },
          {
            "exact": true,
            "path": "/admin/manager-room",
            "component": require('/home/khaibq/blockchain/web/src/pages/ManageRoom').default,
            "icon": "HomeOutlined",
            "name": "manage-room"
          },
          {
            "exact": true,
            "path": "/admin/manager-drug",
            "component": require('/home/khaibq/blockchain/web/src/pages/ManageDrug').default,
            "icon": "ExperimentOutlined",
            "name": "manage-drug"
          },
          {
            "exact": true,
            "path": "/admin/manager-subclinical",
            "component": require('/home/khaibq/blockchain/web/src/pages/ManageSubclinical').default,
            "icon": "ThunderboltOutlined",
            "name": "manage-subclinical"
          },
          {
            "exact": true,
            "path": "/admin/analysis",
            "icon": "BarChartOutlined",
            "component": require('/home/khaibq/blockchain/web/src/pages/Analysis').default,
            "name": "analysis"
          },
          {
            "exact": true,
            "path": "/admin/profile",
            "icon": "UserOutlined",
            "component": require('/home/khaibq/blockchain/web/src/pages/Profile').default,
            "name": "profile"
          }
        ]
      },
      {
        "path": "/404",
        "component": require('/home/khaibq/blockchain/web/src/pages/404').default,
        "exact": true
      }
    ]
  },
  {
    "component": require('/home/khaibq/blockchain/web/src/pages/404').default,
    "exact": true
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
