import { Button, Card, CardHeader, Col, Container, Row, Table } from 'reactstrap'
import React, { Fragment, useEffect, useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore';

import Breadcrumbs from '../common/breadcrumb/breadcrumb';
import SweetAlert from "sweetalert2";
import { db } from '../../data/firebase/firebase';
import ModalEventos from '../common/modal/modalEventos';
import { getEvents } from "../../redux/actions/events.actions";
import { useDispatch, useSelector } from 'react-redux';
import ModalEvBeb from '../common/modal/modalEvBeb';

const Eventos = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [modalBebidas, setModalBebidas] = useState(false);
  const [ eventos, setEventos ] = useState([]);
  const listEvents = useSelector(state => state.events.events);

  useEffect(() =>{
   dispatch(getEvents())
  }, [dispatch])

  const toggle = (eventos) => {
    setModal(!modal);
    if(eventos) {setEventos(eventos)};
    
  }

  const toggleBebidas = (eventos) => {
    setModalBebidas(!modalBebidas)
    if(eventos) {setEventos(eventos)};
  }

  const deshabilitar = async (id) => {
    const userRef = doc(db, "events", id);
    const user = {
      active: false
    };
    try {
      await updateDoc(userRef, user);
      getEvents()
    } catch (e) {
      console.error("Error al camnbiar el estado a Firestore:", e);
    }
  }

  const habilitar = async (id) => {
    const userRef = doc(db, "events", id);
    const user = {
      active: true
    };
    try {
      await updateDoc(userRef, user);
      await getEvents()
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
        SweetAlert.fire("Evento eliminado!");
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
      getEvents()
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
                    <th scope="col" style={{color: 'black'}}>Habilitación</th>
                    <th scope="col" style={{color: 'black'}}>Bebidas</th>
                    <th scope="col" style={{color: 'black'}}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    listEvents.length > 0  
                    ? listEvents.map((i) =>{
                          

                          return  (<tr>
                                      <td style={{color: 'black'}}>{i.event}</td>
                                      <td style={{color: 'black'}}>{formatFirebaseTimestamp(i.date)}</td>
                                      <td>
                                        {
                                          i.active === true
                                          ? <Button color="primary" size="sm" onClick={() => DisplayalertHablitar(i.id) }>
                                                Deshabilitar
                                            </Button>
                                          : <Button color="danger" size="sm" onClick={() => Displayalert(i.id) }>
                                                Habilitar
                                            </Button>
                                        }
                                         
                                      </td>
                                      <td>
                                        <Button color="primary" size="sm" onClick={() => toggleBebidas(i) }>
                                                Agregar
                                            </Button>
                                          
                                      </td>
                                      <td style={{color: 'black'}}> 
                                        <i className={`fa fa-pencil`} onClick={() => toggle(i)}></i> 
                                        <i className={`fa fa-trash-o`} onClick={() => DisplayalertDelete(i.id)}></i>
                                      </td>
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
    <ModalEventos modal={modal} toggle={toggle} evento={eventos} getEvento={getEvents}></ModalEventos>
    <ModalEvBeb modalBebidas={modalBebidas} toggleBebidas={toggleBebidas} evento={eventos}></ModalEvBeb>
  </Fragment>
  )
}

export default Eventos
