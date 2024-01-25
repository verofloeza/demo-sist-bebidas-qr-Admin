import { Button, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import React, { useState } from 'react'
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux/es/exports";

import { db } from "../../../data/firebase/firebase";
import { getEvents } from "../../../redux/actions/events.actions";
import { useEffect } from "react";
import { usersList } from "../../../redux/actions/users.actions";

const ModalEventos = ({modal, toggle, evento}) => {
  const dispatch = useDispatch();
  const [ event, setEvent ] = useState('');
  const [ active, setActive ] = useState('');
  const [ idCliente, setIdCliente ] = useState('');
  const listEvents = useSelector(state => state.events.events);

  useEffect(()=>{
    if(evento){
      setEvent(evento.event)
      setActive(evento.active)
      setIdCliente(evento.id)
    }
    dispatch(getEvents())
  }, [evento])

  const addUser = async () =>{
    const userRef = doc(db, "events", email);
    const user = {
          event: event,
          date: date,
          isActive: true
        };
  try {
    await setDoc(userRef, user);
    dispatch(usersList())
    setear()
    toggle()
  } catch (e) {
    console.error("Error al agregar evento a Firestore:", e);
  }
    
}

const updateUser = async () =>{
  const userRef = doc(db, "event", email);
  const user = {
        event: event,
        date: new Date(),
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
    setDate('');
    setActive('');
    setIdCliente('');
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
                </CardBody>
              </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary btn-pill" onClick={toggle}>
          Cerrar
        </Button>
        {
          userId
          ?
          <Button color="secondary btn-pill" onClick={() => addUser()}>
            Guardar Cambios
          </Button>
          :
          <Button color="secondary btn-pill" onClick={() => updateUser()}>
            Guardar Cambios
          </Button>
        }
        
      </ModalFooter>
    </Modal>
  )
}

export default ModalEventos
