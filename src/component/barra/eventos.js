import { Button, Card, CardHeader, Col, Container, Row, Table } from 'reactstrap'
import React, { Fragment, useEffect, useState } from 'react'
import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore';

import Breadcrumbs from '../common/breadcrumb/breadcrumb';
import SweetAlert from "sweetalert2";
import { db } from '../../data/firebase/firebase';
import ModalEventos from '../common/modal/modalEventos';

const Eventos = () => {
  const [modal, setModal] = useState(false);
  const [ eventos, setEventos ] = useState([]);

  useEffect(() =>{
   
    getEventos()
  }, [])

  const toggle = (eventos) => {
    setModal(!modal);
    if(eventos) {setEventos(eventos)};
    
  }

  const getEventos = async () => {
    const list = [];
    const querySnapshot = await getDocs(query(collection(db, "events")));
    querySnapshot.forEach((doc) => {
      let info = doc.data();
      list.push({
          id: doc.id,
          title: info.event,
          date: info.date,
          active: info.isActive,
        });
      
    });
    setEventos(list)
  }

  const deshabilitar = async (id) => {
    const userRef = doc(db, "events", id);
    const user = {
      isActive: false
    };
    try {
      await updateDoc(userRef, user);
      getEventos()
    } catch (e) {
      console.error("Error al camnbiar el estado a Firestore:", e);
    }
  }

  const habilitar = async (id) => {
    const userRef = doc(db, "events", id);
    const user = {
      isActive: true
    };
    try {
      await updateDoc(userRef, user);
      await getEventos()
    } catch (e) {
      console.error("Error al camnbiar el estado a Firestore:", e);
    }
  }


  const Displayalert = (id) => {
    SweetAlert.fire({
      title: "Evento deshabilitado",
      icon: "warning",
    });
    deshabilitar(id)
  }

  const DisplayalertHablitar = (id) => {
    SweetAlert.fire({
      title: "Evento habilitado",
      icon: "warning",
    });
    habilitar(id)
  }

  const DisplayalertDelete = (id) => {
    SweetAlert.fire({
      title: "Estás seguro de eliminar el evento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ok",
      cancelButtonText: "cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        deleteEvent(id)
        SweetAlert.fire("Usuario eliminado!");
      } else {
        SweetAlert.fire("No se realizaron los cambios!");
      }
    });
  }

  const deleteEvent = async (id) =>{
    const userRef = doc(db, "events", id);
    const user = {
      isActive: false
    };
    try {
      await updateDoc(userRef, user);
      getEventos()
    } catch (e) {
      console.error("Error al eliminar Evento a Firestore:", e);
    }
  
  }

  const formatFirebaseTimestamp = (timestamp) => {
    if(timestamp){
      const dateObj = new Date(timestamp.seconds * 1000);
      const year = dateObj.getFullYear();
      const month = `0${dateObj.getMonth() + 1}`.slice(-2);
      const day = `0${dateObj.getDate()}`.slice(-2);
      const hours = `0${dateObj.getHours()}`.slice(-2);
      const minutes = `0${dateObj.getMinutes()}`.slice(-2);
      
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    }else{
      return '';
    }
  }

  return (
    <Fragment>
    <Breadcrumbs parent="Listado Bebidas" title="Listado de Eventos" />
    <Container fluid={true}>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader>
              <Button color="primary" onClick={() => toggle()}>Agregar Evento</Button>
            </CardHeader>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th scope='col' style={{color: 'black'}}>Evento</th>
                    <th scope="col" style={{color: 'black'}}>Fecha del Evento</th>
                    <th scope="col" style={{color: 'black'}}>Estado del evento</th>
                    <th scope="col" style={{color: 'black'}}>Habilitación</th>
                    <th scope="col" style={{color: 'black'}}>Editar</th>
                    <th scope="col" style={{color: 'black'}}>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    eventos.length > 0  
                    ? eventos.map((i) =>{
                          

                          return  (<tr>
                                      <td style={{color: 'black'}}>{i.title}</td>
                                      <td style={{color: 'black'}}>{formatFirebaseTimestamp(i.date)}</td>
                                      <td style={{color: 'black'}}> 
                                        {
                                          i.active === true 
                                          ? <div className="order-process">
                                              <span className="order-process-circle shipped-order"></span>{" "}
                                                Activo
                                            </div> 
                                          : <div className="order-process">
                                              <span className="order-process-circle cancel-order"></span>{" "}
                                              Inactivo
                                            </div>
                                        }
                                        
                                      </td>
                                      <td>
                                        {
                                          i.active === true
                                          ? <Button color="primary" size="sm" onClick={() => Displayalert(i.id) }>
                                                Deshabilitar
                                            </Button>
                                          : <Button color="danger" size="sm" onClick={() => DisplayalertHablitar(i.id) }>
                                                Habilitar
                                            </Button>
                                        }
                                         
                                      </td>
                                      <td style={{color: 'black'}}> <i className={`fa fa-pencil`} onClick={() => toggle(i)}></i></td>
                                      <td style={{color: 'black'}}> <i className={`fa fa-trash-o`} onClick={() => DisplayalertDelete(i.id)}></i></td>
                                  </tr>)
                    
                    })
                    : <p></p>

                  }
                 
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
    <ModalEventos modal={modal} toggle={toggle} evento={eventos} getEvento={getEventos}></ModalEventos>
  </Fragment>
  )
}

export default Eventos
