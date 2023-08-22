import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from '../../data/firebase/firebase';

export const USERS_LIST = 'USERS_LIST';

export const usersList = ()=>{
    return async dispatch => {
      const list = [];
      const querySnapshot = await getDocs(query(collection(db, "Users"), where("isActive", "==", true), where("role", "!=", "Admin")));
      querySnapshot.forEach((doc) => {
        list.push(doc.data())
      });

      dispatch({ 
          type: USERS_LIST,
          payload: list
        });
      
    }
}

