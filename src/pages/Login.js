import {
    Button,
    CardBody,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import React, { useState } from "react";
import { auth, db } from "../data/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
      const history = useNavigate();
      const [ email, setEmail ] = useState(null)
      const [ pass, setPass ] = useState(null)
      const [ message, setMessage ] = useState(null)
  
      useEffect(()=>{
          const checkFirebaseAuth = () => {
              const unsubscribe = auth.onAuthStateChanged((user) => {
  
                  if (user) {
                      history(`/usuarios`);
                  }
              });
              
              return () => unsubscribe();
              };
              
              checkFirebaseAuth();
      }, [])
      const login = async () => {
          const userRef = collection(db, 'Users');
          const q = query(userRef, where('email', '==', email), where('pass', '==', pass), where('isActive', '==', true));
  
          try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
  
              onAuthStateChanged(auth, (user) => {
                  if (user) {
                    // El usuario está autenticado
                    console.log('Usuario autenticado:', user);
                    history(`/usuarios`);
                  } else {
                    // No hay usuario autenticado
                    // Crea una nueva autenticación o inicia sesión
              
                
                    signInWithEmailAndPassword(auth, email, pass)
                      .then((userCredential) => {
                        // Autenticación exitosa
                        const user = userCredential.user;
                        console.log('Usuario autenticado:', user);
                        history(`/usuarios`);
                      })
                      .catch((error) => {
                        if (error.code === 'auth/user-not-found') {
                          // El usuario no existe, crear una nueva autenticación
                          createUserWithEmailAndPassword(auth, email, pass)
                            .then((userCredential) => {
                              // Autenticación exitosa
                              const user = userCredential.user;
                              console.log('Usuario autenticado:', user);
                              history(`/usuarios`);
                            })
                            .catch((error) => {
                              // Error en la creación de la autenticación
                              console.error('Error en la creación de la autenticación:', error);
                            });
                        } else {
                          // Error en la autenticación
                          console.error('Error en la autenticación:', error);
                        }
                      });
                  }
                });
          } else {
              setMessage('No existe el usuario o no está activo')
              
          }
          } catch (error) {
          console.error('Error al consultar los documentos:', error);
          }
      }
  
    return (
      <div className="page-wrapper">
        <Container fluid={true} className="p-0">
          {/*  <!-- login page start--> */}
          <div className="authentication-main m-0">
            <Row>
              <Col md="12">
                <div className="auth-innerright">
                  <div className="authentication-box">
                    <CardBody className="d-flex h-100">
                      
                      <div className="cont text-center b-light" style={{width: '400px'}}>
                        <div>
                          <Form className="theme-form" style={{width: '100%'}}>
                            <h4>LOGIN ADMIN TIENDA BEBIDAS</h4>
                            {
                                  message
                                  ? <p className="text-danger">{message}</p>
                                  : <p></p>
                              }
                            <FormGroup>
                              <Label className="col-form-label pt-0">
                                Email
                              </Label>
                              <Input
                                className="btn-pill"
                                type="text"
                                required=""
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </FormGroup>
                            <FormGroup>
                              <Label className="col-form-label">Contraseña</Label>
                              <Input
                                className="btn-pill"
                                type="password"
                                required=""
                                onChange={(e) => setPass(e.target.value)}
                              />
                            </FormGroup>
                            <FormGroup className="d-flex flex-wrap mt-3 mb-0">
                              <Button color="primary d-block w-100" type="button" onClick={login}>LOGIN</Button>
                            </FormGroup>
                          </Form>
                        </div>
                        
                      </div>
                    </CardBody>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          {/* <!-- login page end--> */}
        </Container>
      </div>
    );
  };
  
  export default Login;
  