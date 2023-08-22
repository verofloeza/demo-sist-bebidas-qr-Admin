import { Button, Card, CardHeader, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

import ProductsQr from '../../componentProducts/ProductsQr';
import { db } from '../../../data/firebase/firebase';

const ModalPedidos = ({ modalP, toggleP, email }) => {
    console.log(email)
  const [ordenes, setOrdenes] = useState([]);
  const [qr, setQr] = useState(null);
  useEffect(() => {
    const obtenerOrdenes = async () => {
        const userRefCartGet = collection(db, "orders");
        const q = query(userRefCartGet, where('user.email', '==', email), orderBy('date', 'desc'));
      
        try {
          const querySnapshot = await getDocs(q);
          const datos = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setOrdenes(datos);
        } catch (error) {
          console.error('Error al consultar los documentos:', error);
        }
      
        const userRefCart = collection(db, "carts");
        const r = query(userRefCart, where('user.email', '==', email), orderBy('date', 'desc'), limit(1));
      
        try {
          const querySnapshot2 = await getDocs(r);
          const datos2 = querySnapshot2.docs[0];
          if (!querySnapshot2.empty) {
            setQr(datos2.data().qr);
          } else {
            setQr(null);
          }
        } catch (error) {
          console.error('Error al consultar los documentos:', error);
        }
      }

    obtenerOrdenes();
  }, [email]);

  return (
    <Modal isOpen={modalP} toggle={toggleP} size="lg">
      <ModalHeader toggle={toggleP}>Bebidas</ModalHeader>
      <ModalBody>
        
              {ordenes.length > 0 ? (
                <Card>
                  <CardHeader>
                    <h5>{ordenes[0].user.name}</h5>
                    <span>
                      Tel: {ordenes[0].user.phone}<br />
                      email: {ordenes[0].user.email}
                    </span>
                  </CardHeader>
                  <div className="table-responsive">
                    <Table>
                      <thead>
                        <tr>
                          <th scope="col">Imagen</th>
                          <th scope="col">Bebida</th>
                          <th scope="col">Abono</th>
                          <th scope="col">Cantidad</th>
                          <th scope="col">Nro Mercado Pago</th>
                          <th scope="col">Estado</th>
                          <th scope="col"># Orden</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordenes.map(x => (
                          x.product.map((i, index) => (
                            <ProductsQr key={index} id={x.id} image={i.image} title={i.title} qty={i.qty} discount={i.discount} status={x.status} total={x.total} collection={x.nroCollection} />
                          ))
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              ) : (
                <p></p>
              )}
            
      </ModalBody>
    </Modal>
  );
}

export default ModalPedidos;