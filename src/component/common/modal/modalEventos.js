import { Button, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import React, { useState } from 'react'
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux/es/exports";

import { db } from "../../../data/firebase/firebase";
import { getEvents } from "../../../redux/actions/events.actions";
import { useEffect } from "react";
import { usersList } from "../../../redux/actions/users.actions";

const ModalEventos = ({modal, toggle, evento, getEvento}) => {
  const dispatch = useDispatch();
  const [ event, setEvent ] = useState('');
  const [ date, setDate ] = useState('');
  const [ active, setActive ] = useState('');
  const [ idCliente, setIdCliente ] = useState(evento.id);

  useEffect(()=>{
    if(evento){
      setEvent(evento.title)
      setActive(evento.active)
      setIdCliente(evento.id)
      setDate(evento.date)
    }
    dispatch(getEvents())
  }, [evento])

  const addUser = async () =>{
    const eventsCollection = collection(db, 'events');

  const user = {
    event: event,
    date: parseFecha(date),
    isActive: true
  };

  try {
    await addDoc(eventsCollection, user);
    dispatch(usersList())
    setear()
    toggle()
    getEvento()
  } catch (e) {
    console.error("Error al agregar evento a Firestore:", e);
  }
    
}

const parseFecha = (fechaString) => {
  const [dia, mes, anio] = fechaString.split('/');
  // El mes en JavaScript es 0-indexado, por lo que restamos 1
  return new Date(anio, mes - 1, dia);
};

const updateUser = async () =>{
  const userRef = doc(db, "events", idCliente);
  const user = {
        event: event,
        date: parseFecha(date)  
  };
  try {
    await updateDoc(userRef, user);
    dispatch(usersList())
    setear()
    toggle('')
    getEvento()
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

  const close = () => {
    toggle('')
    getEvento()
  }

  const formatear = (fecha) => {
    const date = fecha?.toDate?.();
    const formattedDate = date ? date.toLocaleDateString() : '';
    return formattedDate;
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
                          value={formatear(date)}
                          onChange={(e)=> setDate(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary btn-pill" onClick={() => close()}>
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
