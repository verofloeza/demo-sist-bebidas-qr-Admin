import { Button, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import React, { useState } from 'react'
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux/es/exports";

import { db } from "../../../data/firebase/firebase";
import { getEvents } from "../../../redux/actions/events.actions";
import { useEffect } from "react";
import { usersList } from "../../../redux/actions/users.actions";

const ModalForms = ({modal, toggle, userId}) => {
  const dispatch = useDispatch();
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ pass, setPass ] = useState('');
  const [ role, setRole ] = useState('');
  const [ evento, setEvento ] = useState('');
  const listEvents = useSelector(state => state.events.events);

  useEffect(()=>{
    if(userId){
      setName(userId.name)
      setEmail(userId.email)
      setPass(userId.pass)
      setRole(userId.role)
      setEvento(userId.event)
    }
    dispatch(getEvents())
  }, [userId])

  const addUser = async () =>{
    const userRef = doc(db, "Users", email);
    const user = {
          name: name,
          email: email,
          pass: pass,
          role: role,
          event: evento,
          isActive: true
        };
  try {
    await setDoc(userRef, user);
    dispatch(usersList())
    setear()
    toggle()
  } catch (e) {
    console.error("Error al agregar usuario a Firestore:", e);
  }
    
}

const updateUser = async () =>{
  const userRef = doc(db, "Users", email);
  const user = {
    name: name,
    email: email,
    pass: pass,
    role: role,
    event: evento
  };
  try {
    await updateDoc(userRef, user);
    dispatch(usersList())
    setear()
    toggle()
  } catch (e) {
    console.error("Error al agregar usuario a Firestore:", e);
  }

}

  const setear = ()=>{
    setName('');
    setEmail('');
    setPass('');
    setRole('');
    setEvento('');
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
                        <Label className="form-label">Nombre</Label>
                        <Input
                          className="form-control input-air-primary"
                          type="text"
                          placeholder="Nombre"
                          value={name}
                          onChange={(e)=> setName(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label className="form-label">Email</Label>
                        <Input
                          className="form-control input-air-primary"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e)=> setEmail(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label className="form-label">Contraseña</Label>
                        <Input
                          className="form-control input-air-primary"
                          type="password"
                          placeholder="Password"
                          value={pass}
                          onChange={(e)=> setPass(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label className="form-label">Evento</Label>
                        <Input
                          type="select"
                          name="select"
                          className="form-control input-air-primary digits"
                          value={evento}
                          onChange={(e)=> setEvento(e.target.value)}
                        >
                          <option>Evento</option>
                          {
                          listEvents.length > 0 
                          
                            ? listEvents.map( (i, index) =>
                              <option value={i.event} key={index}>{i.event}</option>
                            )
                            : <option></option>
                          }
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label className="form-label">Roles</Label>
                        <Input
                          type="select"
                          name="select"
                          className="form-control input-air-primary digits"
                          value={role}
                          onChange={(e)=> setRole(e.target.value)}
                        >
                          <option>Rol</option>
                          <option value='Organizador'>Organizador</option>
                          <option value='Check-in'>Check-in</option>
                          <option value='Bartender'>Bartender</option>
                        </Input>
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

export default ModalForms
