import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// import app from "../data/base";

const PrivateRoute = () => {
    // eslint-disable-next-line
    const abortController = new AbortController();

    useEffect(() => {
        const color = localStorage.getItem('color')
        document.getElementById("color").setAttribute("href", `${process.env.PUBLIC_URL}/assets/css/${color}.css`);
        console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
        console.disableYellowBox = true;
        return function cleanup() {
            abortController.abort();
        }
    }, [abortController]);

    return (
       <Outlet />); 
}

export default PrivateRoute;

