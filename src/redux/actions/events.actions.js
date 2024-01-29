import { collection, getDocs, query, where } from "firebase/firestore";

import { EVENTS_LIST } from "../actionType";
import { db } from '../../data/firebase/firebase';

export const getEvents = () => {
    return async dispatch => {
      const list = [];
      const querySnapshot = await getDocs(query(collection(db, "events"), where("isActive", "==", true)));
      querySnapshot.forEach((doc) => {
        let info = doc.data();
        list.push({
            id: doc.id,
            event: info.event,
            slug: info.slug,
            date: info.date,
            active: info.isActive
          });
      });

      dispatch({ 
          type: EVENTS_LIST,
          payload: list
        });
      
    }
  }