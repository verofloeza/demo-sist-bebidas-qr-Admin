import { Button, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import React, { useState } from 'react'
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux/es/exports";

import { db } from "../../../data/firebase/firebase";
import { getEvents } from "../../../redux/actions/events.actions";
import { useEffect } from "react";
import { usersList } from "../../../redux/actions/users.actions";
import { replace } from "lodash";

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
      setDate(formatFirebaseTimestamp(evento.date))
      console.log(formatFirebaseTimestamp(evento.date))
    }
    dispatch(getEvents())
  }, [evento])

  const formatFirebaseTimestamp = (timestamp) => {
    if(timestamp){
      const dateObj = new Date(timestamp.seconds * 1000);
      const year = dateObj.getFullYear();
      const month = `0${dateObj.getMonth() + 1}`.slice(-2);
      const day = `0${dateObj.getDate()}`.slice(-2);
      const hours = `0${dateObj.getHours()}`.slice(-2);
      const minutes = `0${dateObj.getMinutes()}`.slice(-2);
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }else{
      return '';
    }
    
  };

  const addUser = async () =>{
    const eventsCollection = collection(db, 'events');
    const slug = replace(' ', event);
  const user = {
    event: event,
    slug: slug,
    date: new Date(date),
    isActive: true
  };
  console.log(user)

  try {
    await addDoc(eventsCollection, user);
    dispatch(usersList())
    setear()
    toggle('')
    getEvento()
  } catch (e) {
    console.error("Error al agregar evento a Firestore:", e);
  }
    
  }

const updateUser = async () =>{
  const userRef = doc(db, "events", idCliente);
  const slug = replace(' ', event);
  const user = {
        event: event,
        slug: slug,
        date: new Date(date)  
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
                        <Label className="col-form-label">
                          Fecha del evento
                        </Label>
                        <Col sm="9">
                          <Input
                            className="form-control digits"
                            id="example-datetime-local-input"
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(new Date(e.target.value).getTime())}
                          />
                        </Col>
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
