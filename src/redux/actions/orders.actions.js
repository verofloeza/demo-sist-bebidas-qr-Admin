import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

import { ORDERS_LIST } from '../actionType';
import { db } from '../../data/firebase/firebase';

export const getOrders = () => {
  return async dispatch => {
    try {
      const ordersSnapshot = await getDocs(query(collection(db, "orders")));
      const infoPromises = ordersSnapshot.docs.map(async (doc) => {
        const userCartRef = collection(db, "carts");
        const r = query(userCartRef, where('user.email', '==', doc.data().user.email), orderBy('date', 'desc'), limit(1));
  
        try {
          const querySnapshot = await getDocs(r);
          const cartData = querySnapshot.docs[0]?.data();
          const orderData = doc.data();
  
          return {
            id: doc.id,
            qr: cartData?.qr,
            data: orderData
          };
        } catch (error) {
          console.error('Error al consultar los documentos:', error);
          throw error;
        }
      });
  
      const info = await Promise.all(infoPromises);
      info.sort((a, b) => b.data.date - a.data.date);
  
      dispatch({ 
        type: ORDERS_LIST,
        payload: info
      });
    } catch (error) {
      console.error('Error al obtener la información de las órdenes:', error);
    }
  }
}
export const getSearchOrders = (busqueda) =>{
    return async dispatch => {
        let info = []
        const docRef = await getDocs(
          query(
            collection(db, "orders")
          )
        );
        docRef.forEach((doc) => {
          const data = doc.data()
          if (
            (data.user.name && data.user.name.includes(busqueda)) ||
            (data.user.email && data.user.email.includes(busqueda))
          ) {
            info.push({
              id: doc.id,
              data,
            });
          }
         
        });
        info.sort((a, b) => b.data.date - a.data.date);
        dispatch({ 
          type: ORDERS_LIST,
          payload: info
        });
        
      }
}
export const getStatusOrders = (estado) => {
  return async (dispatch) => {
    let info = [];
    const docRef = await getDocs(query(collection(db, "orders")));
    docRef.forEach((doc) => {
      const data = doc.data();
      if(Number(estado) === 0){
        if (data.status === Number(estado) || data.status === undefined) {
          info.push({
            id: doc.id,
            data,
          });
        }
      }else if(Number(estado) === -1){
        info.push({
          id: doc.id,
          data,
        });
      }else{
       if (data.status === Number(estado)) {
          info.push({
            id: doc.id,
            data,
          });
        } 
      }
      
    });
    info.sort((a, b) => b.data.date - a.data.date);

    dispatch({
      type: ORDERS_LIST,
      payload: info,
    });
  };
};