import {Link, useNavigate} from 'react-router-dom'
import {LogOut, Menu} from 'react-feather'
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../data/firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

import SweetAlert from "sweetalert2";
import { signOut } from 'firebase/auth';

const Header = (props) => {
    // eslint-disable-next-line
    const history = useNavigate();
    const [navmenu,setNavmenu] = useState(false)
    const [ user, setUser ] = useState(null)

    useEffect(()=>{
      const checkFirebaseAuth = () => {
          const unsubscribe = auth.onAuthStateChanged( async(user) => {
  
              if (!user) {
                  history(`./`);
              }else{
                setUser(user)
                const userRef = collection(db, 'Users');
                const q = query(userRef, where('email', '==', user.email));
        
                try {
                  const querySnapshot = await getDocs(q);
                  if (!querySnapshot.empty) {
                    const datos = querySnapshot.docs[0]
                    if(datos.data().role !== 'Admin' && datos.data().role !== 'Organizador'){
                      Displayalert();
                      await auth.signOut();
                      history(`./`);
                    } 
                    
                  }else{
                    console.log(user)
                  }
                } catch (error) {
                console.error('Error al consultar los documentos:', error);
                }
              }
          });
          
          return () => unsubscribe();
          };
          
          checkFirebaseAuth();
      }, [])

    
    function handleSignOut() {
      signOut(auth)
        .then(() => {
          history(`./`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    const Displayalert = () => {
      SweetAlert.fire({
        title: "Login",
        text: "No tiene permisos para operar",
        icon: "error",
      });
      history(`./`);
    }

    const Navmenuhideandshow = () => {
      if(navmenu){
        setNavmenu(!navmenu)
        document.querySelector('.nav-menus').classList.add('open')
      }
      else{
        setNavmenu(!navmenu)
        document.querySelector('.nav-menus').classList.remove('open')
      }
    }

    return (
        <div className="page-main-header">
        <div className="main-header-right">
          <div className="main-header-left text-center">
            <div className="logo-wrapper"><Link to="/usuarios"><img src={require("../../../assets/images/logo/logo-sist-bebidas.png")} alt="Club Masiva" width='50'/></Link></div>
          </div>
          <div className="nav-right col pull-right right-menu">
            <ul className="nav-menus">
              <li></li>
              <li> <Link to={'/usuarios'} style={{color: 'white'}}><i className="fa fa-group"></i> Usuarios</Link> </li>
              <li> <Link to={'/bebidas'} style={{color: 'white'}}><i className="fa fa-list-alt"></i> Bebidas</Link> </li>
              <li> <Link to={'/ordenes'} style={{color: 'white'}}><i className="fa fa-check-square-o"></i> Ordenes</Link> </li>
              <li> <Link to={'/eventos'} style={{color: 'white'}}><i className="fa fa-calendar"></i> Eventos</Link> </li>
              <li> <span className="media user-header">{ user ? user.email : ''}</span></li>
              <li onClick={handleSignOut}><LogOut/>Logout</li>
            </ul>
            <div className="d-lg-none mobile-toggle pull-right" onClick={Navmenuhideandshow}><Menu/> MENU</div>
          </div>
          <script id="result-template" type="text/x-handlebars-template">
            <div className="ProfileCard u-cf">                        
            <div className="ProfileCard-avatar"><i className="pe-7s-home"></i></div>
            <div className="ProfileCard-details">
            <div className="ProfileCard-realName"></div>
            </div>
            </div>
          </script>
          <script id="empty-template" type="text/x-handlebars-template"><div className="EmptyMessage">Your search turned up 0 results. This most likely means the backend is down, yikes!</div></script>
        </div>
      </div>
    );
}

export default Header;