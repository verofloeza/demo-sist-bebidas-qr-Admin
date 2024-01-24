import React, { useEffect, useState } from 'react'

const ProductsQr = ({id, image, title, qty, discount, status, total, collection}) => {
  const [ cant, setCant ] = useState(0)
  const [ descuento, setDescuento ] = useState(0);

  useEffect(()=>{
    discount ? setCant((qty - discount)) : setCant(qty)
    discount ? setDescuento(discount) : setDescuento(0)
  },[])
  
  return (
    <tr>
        
        <td><img className='files-gallery-item img-fluid' alt="img" src={image} width={50} /></td>
        <td style={{color: 'black'}}>{title}</td>
        <td style={{color: 'black'}}>{total}</td>
        <td style={{color: 'black'}}>{cant}</td>
        <td style={{color: 'black'}}>{collection}</td>
        <td style={{color: 'black'}}>
        {
            status === 1 || status === 2
            ? status === 1
              
              ? <div>
                  <i className="fa fa-circle font-success f-12" />{ ' ' }
                  Pago realizado
                </div>
              : <div>
                  <i className="fa fa-circle font-warning f-12" />{ ' ' }
                  Pago pendiente
                </div>

            : <div>
                <i className="fa fa-circle font-danger f-12" />{ ' ' }
                Pago cancelado
              </div>
          }
        </td>
        <th scope="row" style={{color: 'black'}}>{id}</th>
    </tr>
  )
}

export default ProductsQr