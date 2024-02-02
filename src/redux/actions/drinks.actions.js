import { collection, getDocs, query, where } from "firebase/firestore";

import { DRINKS_LIST } from "../actionType";
import { db } from '../../data/firebase/firebase';

export const getDrink = () => {
    return async dispatch => {
      const list = [];
      const querySnapshot = await getDocs(query(collection(db, "drinks"), where("isActive", "==", true)));
      querySnapshot.forEach((doc) => {
        let info = doc.data();
        list.push({
            id: doc.id,
            title: info.title,
            description: info.description,
            image: info.image,
            event: info.evento,
            active: info.active
          });
      });

      dispatch({ 
          type: DRINKS_LIST,
          payload: list
        });
      
    }
  }