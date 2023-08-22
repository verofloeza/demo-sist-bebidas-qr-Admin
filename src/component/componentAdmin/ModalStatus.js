import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { doc, updateDoc } from 'firebase/firestore';

import GenerateQr from './GenerateQr';
import React from 'react';
import { db } from '../../data/firebase/firebase';
import { getOrders } from '../../redux/actions/orders.actions';
import { useDispatch } from 'react-redux'

const ModalStatus = ({ modal, toggle, id, status, email }) => {
   const dispatch= useDispatch()
  const handleInputChange = async (e) => {
        const userRef = doc(db, "orders", id);
        const order = {
            status: parseInt(e.target.value)
            };
        try {
            await updateDoc(userRef, order);
            dispatch(getOrders())
        } catch (e) {
            console.error("Error al actualizar una orden a Firestore:", e);
        }
  };

  return (
    <Modal isOpen={modal} toggle={() => toggle( '', 0, '' )}>
      <ModalHeader toggle={() => toggle( '', 0, '' )}>
        <h4>Cambiar Estado de Pago: {id}</h4>
      </ModalHeader>
      <ModalBody>
        <Input type="select" className="form-select" required="" onChange={handleInputChange}>
            <option value="">Seleccionar Estado</option>
            <option value="1" selected={ status === 1 ? true : false }>Pago realizado</option>
            <option value="2" selected={ status === 2 ? true : false }>Pago pendiente</option>
            <option value="0" selected={ status === 0 ? true : false }>Pago cancelado</option>
        </Input>
        {
          status === 1 || status === 2
          ? <GenerateQr email={email}/> 
          : <p></p>
        }
      </ModalBody>
      <ModalFooter>
        <Button color="primary btn-pill" onClick={() => toggle( '', 0, '' )}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalStatus;
