import React, { useEffect, useRef, useState } from 'react'
import { collection, doc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { QRCodeCanvas } from "qrcode.react"
import { db } from '../../data/firebase/firebase';

const GenerateQr = ({email}) => {
    const [url, setUrl] = useState(`https://club-masiva-emp.vercel.app/qr/JR-Recital/${email}`);
    const qrRef = useRef();

    useEffect(() =>{
      qrCodeEncoder()
    }, [])

const qrCodeEncoder = async () => {
  const canvas = qrRef.current.querySelector('canvas');
    const context = canvas.getContext('2d');

    // Obtiene las dimensiones actuales del código QR
    const qrWidth = canvas.width;
    const qrHeight = canvas.height;

    // Configura el tamaño del lienzo con el borde
    const canvasWidth = qrWidth + 200;
    const canvasHeight = qrHeight + 200;

    // Crea un nuevo lienzo para el código QR con borde
    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = qrWidth;
    qrCanvas.height = qrHeight;
    const qrContext = qrCanvas.getContext('2d');

    // Dibuja el código QR en el lienzo del código QR con borde
    qrContext.drawImage(canvas, 0, 0);

    // Configura el tamaño del lienzo principal con el borde
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Dibuja el fondo blanco
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    // Dibuja el código QR en el centro del lienzo principal
    const qrX = (canvasWidth - qrWidth) / 2;
    const qrY = (canvasHeight - qrHeight) / 2;
    context.drawImage(qrCanvas, qrX, qrY);

    const storage = getStorage();
    const storageRef = ref(storage, `qr/JR-Recital/${email}.png`);
    const imageData = canvas.toDataURL('image/png');
    const base64Data = imageData.split(',')[1];
    const byteArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

  try {
     uploadBytes(storageRef, byteArray);

     const downloadURL = await getDownloadURL(storageRef);
     console.log(downloadURL) 
     const userRef2 = collection(db, 'carts');
     const q = query(userRef2, where('user.email', '==', email), orderBy('date', 'desc'), limit(1));
     try {
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        const userRef = doc(db, "carts", lastDoc.id);
        
        const user = {
          qr: downloadURL,
        };
    
        try {
          await updateDoc(userRef, user);
        } catch (e) {
          console.error("Error al agregar usuario a Firestore:", e);
        }
      } else {
        
        console.error("No se encontraron documentos en la consulta.");
      }
    } catch (error) {
      console.error('Error al consultar los documentos:', error);
    }
     
     
      } catch (error) {
          console.error("Error uploading canvas:", error);
      }
};

const qrcode = 
  <QRCodeCanvas
    id="qrCode"
    value={url}
    size={200}
    bgColor="#fff"
    level="H"
  />;
return (
  <div className="qrcode__container">
    <div ref={qrRef}>
      <p>Qr de cliente. Luego del pago los productos serán cargados en el Qr, el cuál deberá mostrar en la barra del evento para ir retirando las bebidas.</p>
      { url ? qrcode : <p></p> }
    </div>
    
  </div>
);
}

export default GenerateQr
