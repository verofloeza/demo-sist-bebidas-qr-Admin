import { Button, Card, CardHeader, Col, Container, Row, Table } from 'reactstrap';
import React, { Fragment, useEffect, useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';

import Breadcrumbs from '../common/breadcrumb/breadcrumb';
import ModalBebidas from '../common/modal/modalBebidas';
import SweetAlert from "sweetalert2";
import { db } from '../../data/firebase/firebase';
import { getDrink } from '../../redux/actions/drinks.actions';
import { getEvents } from "../../redux/actions/events.actions";

const BarraList = () => {
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [ drinkId, setDrinkId ] = useState('');
    const listDrinks = useSelector(state => state.drinks. drinks);
    const listEvents = useSelector(state => state.events.events);

    useEffect(() => {
      dispatch(getDrink())
      dispatch(getEvents())
    },[]);

    const toggle = (bebida) => {
        setModal(!modal);
        setDrinkId(bebida)
      }

      const deleteDrink = async (id) =>{
        const userRef = doc(db, "drinks", id);
        const drink = {
          isActive: false
        };
        try {
          await updateDoc(userRef, drink);
          dispatch(getDrink())
        } catch (e) {
          console.error("Error al agregar usuario a Firestore:", e);
        }
      
      }

      const Displayalert = (id) => {
        SweetAlert.fire({
          title: "Estás seguro de eliminar la bebida?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "cancelar",
          reverseButtons: true,
        }).then((result) => {
          if (result.value) {
            deleteDrink(id)
            SweetAlert.fire("Bebida eliminado!");
          } else {
            SweetAlert.fire("No se realizaron los cambios!");
          }
        });
      }
      const DisplayalertInnactivo = (id) => {
        SweetAlert.fire({
          title: "Estás seguro de deshabilitada la bebida?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "cancelar",
          reverseButtons: true,
        }).then((result) => {
          if (result.value) {
            innactivo(id)
            SweetAlert.fire("Bebida deshabilitada!");
          } else {
            SweetAlert.fire("No se realizaron los cambios!");
          }
        });
      }
      const DisplayalertActivo = (id) => {
        SweetAlert.fire({
          title: "Estás seguro de habilitar la bebida?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "cancelar",
          reverseButtons: true,
        }).then((result) => {
          if (result.value) {
            activo(id)
            SweetAlert.fire("Bebida habilitada!");
          } else {
            SweetAlert.fire("No se realizaron los cambios!");
          }
        });
      }

      const innactivo = async (id) => {
        const userRef = doc(db, "drinks", id);
        const drink = {
          active: false
        };
        try {
          await updateDoc(userRef, drink);
          dispatch(getDrink())
        } catch (e) {
          console.error("Error al agregar usuario a Firestore:", e);
        }
      }

      const activo = async (id) => {
        const userRef = doc(db, "drinks", id);
        const drink = {
          active: true
        };
        try {
          await updateDoc(userRef, drink);
          dispatch(getDrink())
        } catch (e) {
          console.error("Error al agregar usuario a Firestore:", e);
        }
      }
      // const renderEventCells = (user) => {
      //   if (user.event) {
      //     const matchingEvents = listEvents.filter((event) => event.event === user.event);
      //     return matchingEvents.map((event, index) => (
      //       <td key={index} style={{ color: 'black' }}>{event.event} {formatFirebaseTimestamp(event.date)}</td>
      //     ));
      //   } else {
      //     return <td style={{ color: 'black' }}></td>;
      //   }
      // };
      // const formatFirebaseTimestamp = (timestamp) => {
      //   if(timestamp){
      //     const dateObj = new Date(timestamp.seconds * 1000);
      //     const year = dateObj.getFullYear();
      //     const month = `0${dateObj.getMonth() + 1}`.slice(-2);
      //     const day = `0${dateObj.getDate()}`.slice(-2);
      //     const hours = `0${dateObj.getHours()}`.slice(-2);
      //     const minutes = `0${dateObj.getMinutes()}`.slice(-2);
          
      //     return `${day}-${month}-${year} ${hours}:${minutes}`;
      //   }else{
      //     return '';
      //   }
      // }
  return (
    <Fragment>
      <Breadcrumbs parent="Listado Bebidas" title="Listado de Bebidas" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <Button color="primary" onClick={() => toggle()}>Agregar Bebidas</Button>
              </CardHeader>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th scope='col' style={{color: 'black'}}>#</th>
                      <th scope="col" style={{color: 'black'}}>Imagen</th>
                      <th scope="col" style={{color: 'black'}}>Título</th>
                      <th scope="col" style={{color: 'black'}}>Descripción</th>
                      {/* <th scope="col" style={{color: 'black'}}>Evento</th>
                      <th scope="col" style={{color: 'black'}}>Precio</th> */}
                      {/* <th scope="col" style={{color: 'black'}}>Editar</th>
                      <th scope="col" style={{color: 'black'}}>Eliminar</th> */}
                      <th scope="col" style={{color: 'black'}}>Deshabilitar</th>
                      <th scope="col" style={{color: 'black'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      listDrinks.length > 0 
                      
                      ? listDrinks.map( (i, index) =>
                        <tr key={index}>
                          <td style={{color: 'black'}}>{index}</td>
                          <td><img className='files-gallery-item img-fluid' alt="img" src={i.image} width={80} /></td>
                          <td style={{color: 'black'}}>{i.title}</td>
                          <td style={{color: 'black'}}>{i.description}</td>
                          {/* {renderEventCells(i)}
                          <td style={{color: 'black'}}>{i.price}</td> */}
                          {/* <td style={{color: 'black'}}> <i className={`fa fa-pencil`} onClick={() => toggle(i)}></i></td>
                          <td style={{color: 'black'}}> <i className={`fa fa-trash-o`} onClick={() => Displayalert(i.id)}></i></td> */}
                          <td>
                            {
                              i.active 
                              ? <Button color="primary" size="sm" onClick={() => DisplayalertInnactivo(i.id)}>
                                    Deshabilitar
                                </Button> 
                              : <Button color="primary" size="sm" onClick={() => DisplayalertActivo(i.id)}>
                                    Habilitar
                                </Button> 
                            }
                            
                          </td>
                          <td style={{color: 'black'}}> <i className={`fa fa-pencil`} onClick={() => toggle(i)}></i> <i className={`fa fa-trash-o`} onClick={() => Displayalert(i.id)}></i></td>
                        </tr>
                        )
                      
                      :
                      <tr></tr>
                    }
                    
                    
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
      <ModalBebidas modal={modal} toggle={toggle} drinkId={drinkId}></ModalBebidas>
    </Fragment>
  )
}

export default BarraList
