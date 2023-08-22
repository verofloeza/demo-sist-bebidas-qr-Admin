import { Button, Card, CardBody, CardHeader, Col, Container, Input, Row, Table } from 'reactstrap'
import { MoreVertical, Search } from 'react-feather/dist'
import React, { useEffect, useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { getOrders, getSearchOrders, getStatusOrders } from '../../redux/actions/orders.actions'
import { useDispatch, useSelector } from 'react-redux'

import { Fragment } from 'react'
import ModalPedidos from '../common/modal/modalPedidos'
import ModalStatus from '../componentAdmin/ModalStatus'
import SweetAlert from "sweetalert2";
import { db } from '../../data/firebase/firebase'
import { useNavigate } from 'react-router-dom'

const OrdenesBebidas = () => {
  const dispatch = useDispatch();
  const history = useNavigate()
  const orders = useSelector((state) => state.orders.cart)
  const [ modal, setModal ] = useState(false)
  const [ modalP, setModalP ] = useState(false)
  const [ idCliente, setIdCliente ] = useState(null)
  const [ status, setStatus ] = useState(0)
  const [ email, setEmail ] = useState(null)

  // Variables para el paginador
  const itemsPerPage = 30; // Número de elementos por página
  const totalPages = Math.ceil(orders.length / itemsPerPage); // Total de páginas
  const [currentPage, setCurrentPage] = useState(1); // Página actual

  useEffect(()=>{
    dispatch(getOrders())
  },[])

  const searchOrders = (busqueda) =>{
    if(busqueda !== ''){
      dispatch(getSearchOrders(busqueda))
    }else{
      dispatch(getOrders())
    }
  }

  const toggle = ( idC, statusC, email) =>{ 
    setIdCliente(idC)
    setStatus(statusC)
    setEmail(email)
    setModal(!modal) 
    dispatch(getOrders())
  }
  const toggleP = (email) => {
    setEmail(email)
    setModalP(!modalP)
  }
  const enviar = (qr, email) =>{
    Displayalert()
    // fetch('https://clubmasiva.com.ar/sistema/mails/enviarCorreo.php?qr=' + encodeURIComponent(qr) + '&email='+ email)
    //         .then(() =>{
    //             Displayalert()
    //             console.log('correo enviado')
    //         })
    //         .catch(error => {
    //           console.error('Error al obtener la imagen del código QR:', error);
    //         });
  }

  const Displayalert = () => {
    SweetAlert.fire({
      title: "Correo enviado",
      icon: "success",
    });
  }

  const searchStatus = (e) => {
    dispatch(getStatusOrders(e.target.value))
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

  const deleteOrder = async (id) =>{
    const userRef = doc(db, "orders", id);
    const user = {
      isActive: false
    };
    try {
      await updateDoc(userRef, user);
      dispatch(getOrders())
    } catch (e) {
      console.error("Error al agregar usuario a Firestore:", e);
    }
  
  }

  const DisplayalertOrder = (id) => {
    SweetAlert.fire({
      title: "Estás seguro de eliminar el usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ok",
      cancelButtonText: "cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        deleteOrder(id)
      } else {
        SweetAlert.fire("No se realizaron los cambios!");
      }
    });
  }

  const getPaymentStatus = async (paymentId, id) => {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer TEST-4572302144899635-081021-9c25a8bcb9688b76b0456fbf4483c03f-99911975',
        },
      });
      const data = await response.json();
      const paymentStatus = data.status;
      
      let status = 0
      if(paymentStatus === 'approved'){
        status = 1;
      }else if(paymentStatus === 'cancelled'){
        status = 0
      }else{
        status = 2;
      }

      const userRef = doc(db, "orders", id);
      const user = {
        status: 1
      };
      try {
        await updateDoc(userRef, user);
        dispatch(getOrders())
      } catch (e) {
        console.error("Error al agregar usuario a Firestore:", e);
      }

      console.log(paymentStatus);
      return paymentStatus;
    } catch (error) {
      console.error('Error al obtener el estado del pago:', error);
      throw error;
    }
  };
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col>
                    <h5>Ordenes de Bebidas</h5>
                  </Col>
                  <Col>
                    <Input
                          type="select"
                          name="select"
                          className="form-control digits"
                          onChange={searchStatus}
                        >
                          <option value='-1'>Todos los estados</option>
                          <option value='1'>Pagos realizados</option>
                          <option value='2'>Pagos pendientes</option>
                          <option value='0'>Pagos cancelados</option>
                        </Input>
                  </Col>
                  <Col>
                    <div className="faq-form">
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="Buscar por nombre y/o email"
                          onChange={(e) => searchOrders(e.target.value)}
                        />
                        <Search className="search-icon" />
                      </div>
                  </Col>
                </Row>
                
              </CardHeader>
              <CardBody>
                <div className="order-history table-responsive">
                  <Table>
                    <thead>
                      <tr>
                        <th scope="col" style={{color: 'black'}}>Nombre del cliente</th>
                        <th scope="col" style={{color: 'black'}}>Email</th>
                        <th scope="col" style={{color: 'black'}}>Teléfono</th>
                        <th scope="col" style={{color: 'black'}}>total</th>
                        <th scope="col" style={{color: 'black'}}>Fecha</th>
                        <th scope="col" style={{color: 'black'}}>Evento</th>
                        <th scope="col" style={{color: 'black'}}>Compra</th>
                        <th scope="col" style={{color: 'black'}}>Ver Compra</th>
                        <th scope="col" style={{color: 'black'}}>Estado de pago</th>
                        <th scope="col" style={{color: 'black'}}>Envio QR</th>
                        <th scope="col" style={{color: 'black'}}>Eliminar</th>
                        <th scope="col" style={{color: 'black'}}>Verificar pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        orders.length > 0
                        ?
                        orders
                        .slice(startIndex, endIndex)
                        .map((i, index) => {
                          const date = i.data.date?.toDate?.();
                          const formattedDate = date ? date.toLocaleDateString() : '';
                          return <tr>
                          
                          <td key={index}>
                            <div className="product-name">
                              <a href="#javascript">{i.data.user.name}</a>
                              {
                                i.data.status
                                ? 
                                  i.data.status === 1
                                  ? <div className="order-process">
                                        <span className="order-process-circle shipped-order"></span>{" "}
                                        Pago realizado
                                      </div>
                                  : i.data.status === 2
                                    ? <div className="order-process">
                                        <span className="order-process-circle"></span>{" "}
                                        Pago pendiente
                                      </div>
                                    : <div className="order-process">
                                        <span className="order-process-circle cancel-order"></span>{" "}
                                        Pago cancelado
                                      </div>
                                : !i.data.qr
                                  ?
                                  i.data.status === 0
                                  ?<div className="order-process">
                                    <span className="order-process-circle cancel-order"></span>{" "}
                                    Pago cancelado
                                  </div>
                                  :<div className="order-process">
                                      <span className="order-process-circle cancel-order"></span>{" "}
                                      Pago no realizado
                                    </div>
                                  : <div className="order-process">
                                      <span className="order-process-circle shipped-order"></span>{" "}
                                        Pago realizado
                                    </div>
                              }
                            </div>
                          </td>
                          <td style={{color: 'black'}}>{i.data.user.email}</td>
                          <td style={{color: 'black'}}>{i.data.user.phone}</td>
                          <td style={{color: 'black'}}>{i.data.total}</td>
                          <td style={{color: 'black'}}>{formattedDate}</td>
                          <td style={{color: 'black'}}>{i.data.event}</td>
                          <td style={{color: 'black'}}>
                          { 
                            i.data?.product && i.data.product.length > 0
                            ? i.data.product.map((x, index) => (
                                <div key={index}>
                                  <em style={{fontSize: 12, lineHeight: 1}}>*{x.title} cant {x.qty}</em><br></br>
                                </div>
                                
                              ))
                            : ''
                          }
                          </td>
                          <td> 
                            <Button color="primary" size="sm">
                              <a href={`../qr/JR-Recital/${i.data.user.email}`} target="_blank" rel="noopener noreferrer" style={{color: 'white' }}>
                                Ver
                              </a>
                            </Button> 
                           
                          </td>
                          <td> 
                            <Button color="primary" size="sm" onClick={() => toggle(i.id, i.data.status, i.data.user.email) }>
                                Cambiar
                            </Button> 
                          </td>
                          <td> 
                            <Button color="primary" size="sm" onClick={() => enviar(i.qr, i.data.user.email) }>
                                Qr
                            </Button> 
                          </td>
                          <td>
                            <Button color="primary" size="sm" onClick={() => DisplayalertOrder(i.id)}>
                              <i className={`fa fa-trash-o`}></i>
                            </Button> 
                           
                          </td>
                          <td> 
                            <Button color="primary" size="sm" onClick={() => getPaymentStatus(i.data.nroCollection, i.id) }>
                                Verificar
                            </Button> 
                          </td>
                        </tr>
                        })
                        
                        :
                        <tr></tr>
                      }
                      
                    </tbody>
                  </Table>
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
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* <ModalPedidos modalP={modalP} toggleP={toggleP} email={email} /> */}
      <ModalStatus modal={modal} toggle={toggle} id={idCliente} status={status} email={email} />
    </Fragment>
  )
}

export default OrdenesBebidas
