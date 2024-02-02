import {Button, Card, Col, Container, Row, Table, Modal, ModalBody, ModalHeader, FormGroup, Input} from 'reactstrap'
import React, { useEffect, useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore';

import { getDrink } from '../../../redux/actions/drinks.actions';
import { getEvents } from "../../../redux/actions/events.actions";
import { useDispatch, useSelector } from 'react-redux';
import { db } from "../../../data/firebase/firebase";

const ModalEvBeb = ({modalBebidas, toggleBebidas, evento}) => {
  const dispatch = useDispatch();
  const listDrinks = useSelector(state => state.drinks. drinks);
  const [ listBebidas, setListBebidas ] = useState([]);
console.log(listBebidas)
    useEffect( () =>{
      dispatch(getDrink())
      setListBebidas(evento.drinks !== undefined ? evento.drinks : [])
      
    }, [evento, dispatch] );

    const findBebidaIndex = (bebidaId) => { 
        return listBebidas.findIndex((bebida) => bebida.id === bebidaId);
      
    };
  
    const toggleDrinkStatus = (bebidaId) => {
      const bebidaIndex = findBebidaIndex(bebidaId);
      
  if (bebidaIndex !== -1) {
    const updatedList = [...listBebidas];
    if (updatedList[bebidaIndex]) { 
      updatedList[bebidaIndex].active = !updatedList[bebidaIndex].active;
      setListBebidas(updatedList);
    } else {
      console.error(`Error: La bebida con ID ${bebidaId} no se encuentra en la lista.`);
    }
  } else {
    setListBebidas([
      ...listBebidas,
      {
        id: bebidaId,
        active: true, 
      },
    ]);
  }
      updateEvent();
    };

    const toggleDrinkStock = (bebidaId, value) => {
      const bebidaIndex = findBebidaIndex(bebidaId);
      
  if (bebidaIndex !== -1) {
    const updatedList = [...listBebidas];
    if (updatedList[bebidaIndex]) { 
      updatedList[bebidaIndex].stock = value;
      setListBebidas(updatedList);
    } else {
      console.error(`Error: La bebida con ID ${bebidaId} no se encuentra en la lista.`);
    }
  } else {
    setListBebidas([
      ...listBebidas,
      {
        id: bebidaId,
        stock: value
      },
    ]);
  }
      updateEvent();
    };

    const toggleDrinkPrice = (bebidaId, value) => {
      const bebidaIndex = findBebidaIndex(bebidaId);
      
  if (bebidaIndex !== -1) {
    const updatedList = [...listBebidas];
    if (updatedList[bebidaIndex]) { 
      updatedList[bebidaIndex].price = value;
      setListBebidas(updatedList);
    } else {
      console.error(`Error: La bebida con ID ${bebidaId} no se encuentra en la lista.`);
    }
  } else {
    setListBebidas([
      ...listBebidas,
      {
        id: bebidaId,
        price: value
      },
    ]);
  }
      updateEvent();
    };

    const updateEvent = async () => {
      const userRef = doc(db, "events", evento.id);
      const user = {
        drinks: listBebidas
      };
      try {
        await updateDoc(userRef, user);
        getEvents()
      } catch (e) {
        console.error("Error al editar las bebidas a Firestore:", e);
      }
    }

    return (
    <Modal isOpen={modalBebidas} toggle={toggleBebidas}>
      <ModalHeader toggle={toggleBebidas}>Bebidas</ModalHeader>
      <ModalBody>
        <Container fluid={true}>
      <Row>
        <Col sm="12">
          <Card>
            
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th scope='col' style={{color: 'black'}}>Bebida</th>
                    <th scope="col" style={{color: 'black'}}>Stock</th>
                    <th scope="col" style={{color: 'black'}}>Precio</th>
                    <th scope="col" style={{color: 'black'}}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                {
                      listDrinks.length > 0 
                      
                      ? listDrinks.map( (i, index) =>
                        <tr key={index}>
                          <td style={{color: 'black'}}>{i.title}</td>
                          <td style={{color: 'black'}}>
                          <Row>
                            <Col>
                              <FormGroup>
                                <Input
                                  className="form-control input-air-primary"
                                  type="text"
                                  placeholder="Stock"
                                  value={findBebidaIndex(i.id) !== -1 && listBebidas[findBebidaIndex(i.id)].stock !== 'undefined' ? listBebidas[findBebidaIndex(i.id)].stock : 0 }
                                  onChange={(e)=> toggleDrinkStock(i.id, e.target.value)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          </td>
                          <td style={{color: 'black'}}>
                          <Row>
                            <Col>
                              <FormGroup>
                                <Input
                                  className="form-control input-air-primary"
                                  type="text"
                                  placeholder="Precio"
                                  value={findBebidaIndex(i.id) !== -1 && listBebidas[findBebidaIndex(i.id)].price !== 'undefined' ? listBebidas[findBebidaIndex(i.id)].price : 0}
                                  onChange={(e)=> toggleDrinkPrice(i.id, e.target.value)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          </td>
                          <td style={{color: 'black'}}>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => toggleDrinkStatus(i.id)}
                              >
                                {findBebidaIndex(i.id) !== -1 && listBebidas[findBebidaIndex(i.id)].active
                                  ? 'Deshabilitar'
                                  : 'Habilitar'}
                              </Button>
                          </td>
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
    </ModalBody>
    </Modal>
    );
}

export default ModalEvBeb;