import BarraList from "../component/barra/barraList";
import Eventos from "../component/barra/eventos";
import OrdenesBebidas from "../component/barra/ordenesBebidas";
import Qr from "../component/barra/qr";
import React from "react";
import Usuarios from "../component/usuarios/usuarios";

export const routes = [
    { path:`${process.env.PUBLIC_URL}/usuarios`, Component: <Usuarios/> },  
    { path:`${process.env.PUBLIC_URL}/bebidas`, Component: <BarraList/> }, 
    { path:`${process.env.PUBLIC_URL}/ordenes`, Component: <OrdenesBebidas/> }, 
    { path:`${process.env.PUBLIC_URL}/qr/:evento/:email`, Component: <Qr/> },
    { path:`${process.env.PUBLIC_URL}/eventos`, Component: <Eventos/> },
]

