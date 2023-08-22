import { Button, Card, CardHeader, Col, Container, Row, Table } from 'reactstrap'
import React, { Fragment, useEffect, useState } from 'react'
import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore';

import Breadcrumbs from '../common/breadcrumb/breadcrumb';
import SweetAlert from "sweetalert2";
import { db } from '../../data/firebase/firebase';

const Eventos = () => {
  const [ evento, setEvento ] = useState([]);

  useEffect(() =>{
   
    getEventos()
  }, [])

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
    setEvento(list)
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
      getEventos()
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

  return (
    <Fragment>
    <Breadcrumbs parent="Listado Bebidas" title="Listado de Eventos" />
    <Container fluid={true}>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader>
              {/* <Button color="primary" onClick={() => toggle()}>Agregar Bebidas</Button> */}
            </CardHeader>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th scope='col' style={{color: 'black'}}>Evento</th>
                    <th scope="col" style={{color: 'black'}}>Fecha del Evento</th>
                    <th scope="col" style={{color: 'black'}}>Estado del evento</th>
                    <th scope="col" style={{color: 'black'}}>Habilitación</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    evento.length > 0  
                    ? evento.map((i) =>{
                          const date = i.date?.toDate?.();
                          const formattedDate = date ? date.toLocaleDateString() : '';

                          return  (<tr>
                                      <td style={{color: 'black'}}>{i.title}</td>
                                      <td style={{color: 'black'}}>{formattedDate}</td>
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
                                          : <Button color="primary" size="sm" onClick={() => DisplayalertHablitar(i.id) }>
                                                Habilitar
                                            </Button>
                                        }
                                         
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
  </Fragment>
  )
}

export default Eventos
