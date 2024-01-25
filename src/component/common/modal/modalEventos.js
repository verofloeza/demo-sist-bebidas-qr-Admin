import { Button, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import React, { useState } from 'react'
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux/es/exports";

import { db } from "../../../data/firebase/firebase";
import { getEvents } from "../../../redux/actions/events.actions";
import { useEffect } from "react";
import { usersList } from "../../../redux/actions/users.actions";

const ModalEventos = ({modal, toggle, evento}) => {
  const dispatch = useDispatch();
  const [ event, setEvent ] = useState('');
  const [ date, setDate ] = useState('');
  const [ active, setActive ] = useState('');
  const [ idCliente, setIdCliente ] = useState('');

  useEffect(()=>{
    if(evento){
      setEvent(evento.event)
      setActive(evento.active)
      setIdCliente(evento.id)
    }
    dispatch(getEvents())
  }, [evento])

  const convertirFechaAFirebaseTimestamp = () => {
    // Crea un nuevo objeto Date con la fecha y hora específicas
    const fecha = new Date('September 21, 2024 00:00:00 GMT-0300');
    
    return fecha;
  };

  const addUser = async () =>{
    const eventsCollection = collection(db, 'events');

  const user = {
    event: event,
    date: convertirFechaAFirebaseTimestamp(date),
    isActive: true
  };

  try {
    await addDoc(eventsCollection, user);
    dispatch(usersList())
    setear()
    toggle()
  } catch (e) {
    console.error("Error al agregar evento a Firestore:", e);
  }
    
}

const updateUser = async () =>{
  console.log('update')
  const userRef = doc(db, "event", idCliente);
  const user = {
        event: event,
        date: convertirFechaAFirebaseTimestamp(date)
  };
  try {
    await updateDoc(userRef, user);
    dispatch(usersList())
    setear()
    toggle()
  } catch (e) {
    console.error("Error al agregar evento a Firestore:", e);
  }

}

  const setear = ()=>{
    setActive('');
    setIdCliente('');
    setDate('');
    setEvent('');
  }

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Usuarios</ModalHeader>
      <ModalBody>
        <Form className="form theme-form">
                <CardBody>
                <Row>
                    <Col>
                      <FormGroup>
                        <Label className="form-label">Nombre del Evento</Label>
                        <Input
                          className="form-control input-air-primary"
                          type="text"
                          placeholder="Nombre del Evento"
                          value={event}
                          onChange={(e)=> setEvent(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label className="form-label">Fecha del evento</Label>
                        <Input
                          className="form-control input-air-primary"
                          type="text"
                          placeholder="Fecha del evento"
                          value={date}
                          onChange={(e)=> setDate(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary btn-pill" onClick={toggle}>
          Cerrar
        </Button>
        {
          idCliente
          ?
          <Button color="secondary btn-pill" onClick={() => updateUser()}>
            Guardar Cambios
          </Button>
          :
          <Button color="secondary btn-pill" onClick={() => addUser()}>
            Guardar Cambios
          </Button>
        }
        
      </ModalFooter>
    </Modal>
  )
}

export default ModalEventos
