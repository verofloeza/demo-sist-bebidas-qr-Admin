import React from "react";
export const MENUITEMS = [
  // {
  //   title: "General",
  //   icon: <i className="pe-7s-home pe-lg"></i>,
  //   path: "/poco/default/sample-page",
  //   type: "sub",
  //   active: true,
  //   bookmark: true,
  //   children: [
  //     { title: "Dashboard", type: "sub" },
  //     { title: "Default", type: "link", path: "/poco/default/sample-page" },
  //   ],
  // },
  // {
  //   title: "Starter kit",
  //   icon: <i className="pe-7s-edit"></i>,
  //   path: "/poco/starter-kit/sample-page",
  //   type: "sub",
  //   active: false,
  //   children: [
  //     { title: "Sample Page", type: "sub" },
  //     { title: "Sample Page", type: "link", path: "/poco/starter-kit/sample-page" },
  //   ],
  // },
  // {
  //   title: "Support",
  //   icon: <i className="pe-7s-note2"></i>,
  //   path: "/poco/support/raise-ticket",
  //   type: "sub",
  //   active: false,
  //   children: [
  //     { title: "Ticket", type: "sub" },
  //     { title: "Raise Ticket", type: "exteral_link", path: "http://support.pixelstrap.com/help-center" },
  //   ],
  // },
  {
    title: "Usuarios",
    icon: <i className="pe-7s-note2"></i>,
    path: "/usuarios/usuarios",
    type: "sub",
    active: true,
    bookmark: true,
    children: [
      { title: "Usuarios", type: "sub" },
      { title: "Listado de usuarios", type: "link", path: "/usuarios/usuarios" },
    ],
  },
  {
    title: "Barra",
    icon: <i className="pe-7s-note2"></i>,
    path: "/barra/listado",
    type: "sub",
    active: false,
    children: [
      { title: "Barra", type: "sub" },
      { title: "Listado de Bebidas", type: "link", path: "/barra/listado" },
      { title: "Ordenes de Bebidas", type: "link", path: "/barra/ordenes" },
    ],
  },
];
