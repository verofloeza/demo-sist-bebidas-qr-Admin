import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Outlet, useLocation } from "react-router-dom";
import React, { Fragment, useEffect } from "react";

import ConfigDB from "./data/customizer/config";
import Header from "./component/common/header/header";
import Loader from "./component/common/loader/loader";
import Rightsidebar from "./component/common/sidebar/rightsidebar";
import { ToastContainer } from "react-toastify";

const App = () => {
  const animation = localStorage.getItem("animation") || ConfigDB.data.router_animation || 'fade'
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);


  return (
    <Fragment>
      <Loader />
      <div className="page-wrapper">
        <div className="page-body-wrapper">
          <Header />
          <Rightsidebar />
          <div className="page-body" style={{marginLeft: 0}}>
            <TransitionGroup>
              <CSSTransition
                key={location.key}
                timeout={100}
                classNames={animation}
                unmountOnExit
              >
                <div>
                  <Outlet />
                </div>
              </CSSTransition>
            </TransitionGroup>
          </div>
        </div>
      </div>
      <ToastContainer />
      
    </Fragment>
  );
};

export default App;
