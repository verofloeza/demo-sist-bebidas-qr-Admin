import { Card, CardHeader, Col, Container, Row, Table } from 'reactstrap';
import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

import ProductsQr from '../componentProducts/ProductsQr';
import { db } from '../../data/firebase/firebase';
import { useParams } from 'react-router-dom';

const Qr = () => {
    const { evento, email } = useParams();
    const [ ordenes, setOrdenes ] = useState( [])
    const [ qr, setQr ] = useState(null)
    const [ products, setProducts ] = useState(null)


    useEffect(()=>{
      
      const obtenerOrdenes = async () =>{
        const userRefCartGet = collection(db, "orders");
        const q = query(userRefCartGet, where('user.email', '==', email), orderBy('date', 'desc'));
          
        try {
          const querySnapshot = await getDocs(q);
          const datos = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setOrdenes(datos);
        }catch (error) {
          console.error('Error al consultar los documentos:', error);
                  
        }

        const userRefCart = collection(db, "carts");
        const r = query(userRefCart, where('user.email', '==', email), orderBy('date', 'desc'), limit(1));
        
        try {
          const querySnapshot2 = await getDocs(r);
          const datos2 = querySnapshot2.docs[0];
          if (!querySnapshot2.empty) {
            if(datos2.data().qr !== null){
              setQr(datos2.data().qr);
            }else{
              // Obtén una referencia al almacenamiento
            const storage = getStorage();

            // Especifica la ruta de la imagen en el almacenamiento
            const imagePath = `qr/Evento1/${email}.png`;

            // Crea una referencia a la imagen en el almacenamiento
            const imageRef = ref(storage, imagePath);

            // Obtén la URL de descarga de la imagen
            getDownloadURL(imageRef)
              .then(async (url) => {
                const userRefCart = doc(db, "carts", datos2.id);
                const cart = {
                    qr: url
                    };
                try {
                    await updateDoc(userRefCart, cart);
                    
                } catch (e) {
                    console.error("Error al actualizar una orden a Firestore:", e);
                }
                setQr(url)
                console.log('URL de descarga:', url);
                // Utiliza la URL para mostrar la imagen o realizar otras acciones
              })
              .catch((error) => {
                console.error('Error al obtener la URL de descarga:', error);
              });
            }
            
          } else {
            setQr(null);
          }
        } catch (error) {
          console.error('Error al consultar los documentos:', error);
        }
      }
        
      obtenerOrdenes()
    },[])
      
  return (
    <Container fluid={true} className="tables-wrapper">
        <Row>
          <Col sm="12">
             {ordenes.length > 0
                ?<Card>
              <CardHeader>
                <h5>{ ordenes[0].user.name }</h5>
                <span>
                  Tel: {ordenes[0].user.phone}<br></br>
                  emal: {ordenes[0].user.email}
                </span>
                <img
                    className="files-gallery-item img-fluid"
                    alt="img"
                    src={qr || ''}
                    width={350}
                    />  
              </CardHeader>
              <div className="table-responsive">
                <Table>
                  <thead>
                    <tr>
                      <th scope="col" style={{color: 'black'}}>Imagen</th>
                      <th scope="col" style={{color: 'black'}}>Bebida</th>
                      <th scope="col" style={{color: 'black'}}>Abono</th>
                      <th scope="col" style={{color: 'black'}}>Cantidad</th>
                      <th scope="col" style={{color: 'black'}}>Nro Mercado Pago</th>
                      <th scope="col" style={{color: 'black'}}>Estado</th>
                      <th scope="col" style={{color: 'black'}}># Orden</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    ordenes.map(x => {
                      return x.product.map((i, index) => (
                        <ProductsQr key={index} id={x.id} image={i.image} title={i.title} qty={i.qty} discount={i.discount} status={x.status} total={x.total} collection={x.nroCollection}/>
                      ));
                    })
                  }
                    
                  </tbody>
                </Table>
              </div>
              
            </Card>
            : <p></p>
            }

          </Col>
        </Row>
    </Container>
  )
}

export default Qr