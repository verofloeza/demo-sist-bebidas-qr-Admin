import { Button, Card, CardHeader, Col, Container, Row, Table } from "reactstrap";
import React, { Fragment, useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';

import Breadcrumb from "../common/breadcrumb/breadcrumb";
import ModalForms from "../common/modal/modalForms";
import SweetAlert from "sweetalert2";
import { db } from "../../data/firebase/firebase";
import { usersList } from '../../redux/actions/users.actions';
import { getEvents } from "../../redux/actions/events.actions";

const Usuarios = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.usuarios.usuarios);
  const [modal, setModal] = useState(false);
  const [ userId, setUserId ] = useState('');
  const listEvents = useSelector(state => state.events.events);

  // Variables para el paginador
  const itemsPerPage = 30; // Número de elementos por página
  const totalPages = Math.ceil(users.length / itemsPerPage); // Total de páginas
  const [currentPage, setCurrentPage] = useState(1); // Página actual

  useEffect(()=>{
    dispatch(usersList())
    dispatch(getEvents())
  }, [])

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
  
  const toggle = (usuario) => {
    setModal(!modal);
    setUserId(usuario)
  }

  const deleteUser = async (email) =>{
    const userRef = doc(db, "Users", email);
    const user = {
      isActive: false
    };
    try {
      await updateDoc(userRef, user);
      dispatch(usersList())
    } catch (e) {
      console.error("Error al agregar usuario a Firestore:", e);
    }
  
  }

  const Displayalert = (email) => {
    SweetAlert.fire({
      title: "Estás seguro de eliminar el usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ok",
      cancelButtonText: "cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        deleteUser(email)
        SweetAlert.fire("Usuario eliminado!");
      } else {
        SweetAlert.fire("No se realizaron los cambios!");
      }
    });
  }

  // Funciones para el paginador
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Calcular los índices de inicio y fin de los elementos en la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const renderEventCells = (user) => {
    if (user.event) {
      const matchingEvents = listEvents.filter((event) => event.event === user.event);
      return matchingEvents.map((event, index) => (
        <td key={index} style={{ color: 'black' }}>{event.event} {formatFirebaseTimestamp(event.date)}</td>
      ));
    } else {
      return <td style={{ color: 'black' }}></td>;
    }
  };
  return (
    <Fragment>
      <Breadcrumb parent="Organizadores" title="Listado de Organizadores" />
      <Container fluid={true} className="tables-wrapper">
        <Row>
        <Col sm="12">
            <Card>
              <CardHeader>
                <Button color="primary" onClick={() => toggle([])}>Agregar Organizador</Button>
              </CardHeader>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col" style={{color: 'black'}}>#</th>
                      <th scope="col" style={{color: 'black'}}>Nombre Organizador</th>
                      <th scope="col" style={{color: 'black'}}>Email</th>
                      <th scope="col" style={{color: 'black'}}>Rol</th>
                      <th scope="col" style={{color: 'black'}}>Evento</th>
                      <th scope="col" style={{color: 'black'}}>Editar</th>
                      <th scope="col" style={{color: 'black'}}>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      users.length > 0 
                      
                      ? users
                      .slice(startIndex, endIndex)
                      .map( i =>
                        <tr key={i.id}>
                          <td scope="row" style={{color: 'black'}}>{i.id}</td>
                          <td style={{color: 'black'}}>{i.name}</td>
                          <td style={{color: 'black'}}>{i.email}</td>
                          <td style={{color: 'black'}}>{i.role}</td>
                          {renderEventCells(i)}
                          <td style={{color: 'black'}}> <i className={`fa fa-pencil`} onClick={() => toggle(i)}></i></td>
                          <td style={{color: 'black'}}> <i className={`fa fa-trash-o`} onClick={() => Displayalert(i.email)}></i></td>
                        </tr>
                        )
                      
                      :
                      <tr></tr>
                    }
                    
                    
                  </tbody>
                </Table>
                
              </div>
            </Card>
            <div style={{marginTop: 20}}>
                    <Button onClick={previousPage} disabled={currentPage === 1}>
                      Anterior
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        disabled={pageNumber === currentPage}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    <Button onClick={nextPage} disabled={currentPage === totalPages}>
                      Siguiente
                    </Button>
                  </div>
          </Col>
        </Row>
       </Container>
       <ModalForms modal={modal} toggle={toggle} userId={userId}></ModalForms>
    </Fragment>
  )
}



export default Usuarios
