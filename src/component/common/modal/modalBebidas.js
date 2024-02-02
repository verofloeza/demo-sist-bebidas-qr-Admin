import { Button, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import React, { useState } from 'react'
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

import Files from 'react-files';
import { db } from "../../../data/firebase/firebase";
import { getDrink } from "../../../redux/actions/drinks.actions";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { getEvents } from "../../../redux/actions/events.actions";

const ModalBebidas = ({modal, toggle, drinkId}) => {
  const dispatch = useDispatch();
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ image, setImage ] = useState([]);
  const [ urlImage, setUrlImage ] = useState(null)
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [ evento, setEvento ] = useState('');
  const listEvents = useSelector(state => state.events.events);

  useEffect(()=>{
    if(drinkId){
      setTitle(drinkId.title)
      setDescription(drinkId.description)
      setUrlImage(drinkId.image)
      setEvento(drinkId.event)
    }
    dispatch(getEvents())
  }, [drinkId, dispatch])

  const addDrink = async () =>{
    const userRef = collection(db, "drinks");
    const drink = {
          title: title,
          description: description,
          image: urlImage,
          evento: evento,
          isActive: true
        };
  try {
    await addDoc(userRef, drink);
    dispatch(getDrink())
    setear();
    toggle()
  } catch (e) {
    console.error("Error al agregar la bebida a Firestore:", e);
  }
    
}

const updateDrink = async () =>{ 
  const userRef = doc(db, "drinks", drinkId.id);
  const drink = {
    title: title,
    description: description,
    image: urlImage,
    evento: evento
  };
  try {
    await updateDoc(userRef, drink);
    dispatch(getDrink())
    setear()
    toggle()
  } catch (e) {
    console.error("Error al editar la bebida a Firestore:", e);
  }

}

  const setear = ()=>{
    setTitle('');
    setDescription('');
    setImage([]);
    setUrlImage('');
    setEvento('');
  }

  //Image
  function deleteFile(e) {
    setImage([]);
    return image
  }

  const onFilesChange = (files) => {
    if (files) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${files[0].name}`);

        const uploadTask = uploadBytesResumable(storageRef, files[0]);

        uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            default :;
                
            }
        },
        (error) => {
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                setUrlImage(`${downloadURL}`);
            });
        }
        );
        
      } else {
        setMessage('Seleccione un archivo para cargar');
      }
    setImage(files)
  }
  const onFilesError = (error, file) => {
    setImage(file)
  }

  const formatFirebaseTimestamp = (timestamp) => {
    if(timestamp){
      const dateObj = new Date(timestamp.seconds * 1000);
      const year = dateObj.getFullYear();
      const month = `0${dateObj.getMonth() + 1}`.slice(-2);
      const day = `0${dateObj.getDate()}`.slice(-2);
      const hours = `0${dateObj.getHours()}`.slice(-2);
      const minutes = `0${dateObj.getMinutes()}`.slice(-2);
      
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    }else{
      return '';
    }
    
  };
  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Bebidas</ModalHeader>
      <ModalBody>
        <Form className="form theme-form">
                <CardBody>
                <Row>
                    <Col>
                      <FormGroup>
                        <Label className="form-label">Título</Label>
                        <Input
                          className="form-control input-air-primary"
                          type="text"
                          placeholder="Título"
                          value={title}
                          onChange={(e)=> setTitle(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label className="form-label">Descripción</Label>
                        <Input
                          className="form-control input-air-primary"
                          type="text"
                          placeholder="Descripción"
                          value={description}
                          onChange={(e)=> setDescription(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label className="form-label">Evento</Label>
                        <Input
                          type="select"
                          name="select"
                          className="form-control input-air-primary digits"
                          value={evento}
                          onChange={(e)=> setEvento(e.target.value)}
                        >
                          <option>Evento</option>
                          {
                          listEvents.length > 0 
                          
                            ? listEvents.map( (i, index) =>
                              <option value={i.event} key={index}>{i.event} - {formatFirebaseTimestamp(i.date)}</option>
                            )
                            : <option></option>
                          }
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                          {
                            urlImage ?
                            <img className='files-gallery-item img-fluid' alt="img" src={urlImage} />
                            : <div></div>
                          }
                            
                            <Files
                            className='files-dropzone fileContainer'
                            onChange={onFilesChange}
                            onError={onFilesError}
                            accepts={['image/*']}
                            multiple={false}
                            maxFileSize={10000000}
                            minFileSize={0}
                            clickable
                            >
                            {
                                image !== undefined && image.length > 0
                                ? <div className='files-gallery'>
                                    {image.map((file, index) =>
                                    <div key={index}>
                                        <img className='files-gallery-item img-fluid' alt="img" src={file} />
                                    </div>
                                    )}
                                </div>

                                : <div className="d-flex justify-content-center">
                                    <button className="btn btn-primary btn-pill" type="button" color='primary' >Upload Image</button>
                                </div>
                            }
                            </Files>
                            {image !== undefined && image.length > 0 ?
                            <div className="d-flex justify-content-center">
                                <button className="mt-2 btn btn-danger btn-pill" color='primary' type="button" onClick={() => deleteFile(image)} >
                                Delete
                                </button></div> : ''}
                                {progress > 0 && progress < 100 && <progress value={progress} max="100" />}
                                {message && <div>{message}</div>}

                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary btn-pill" onClick={toggle}>
          Cerrar
        </Button>
        {
          !drinkId
          ?
          <Button color="secondary btn-pill" onClick={() => addDrink()}>
            Guardar Cambios
          </Button>
          :
          <Button color="secondary btn-pill" onClick={() => updateDrink()}>
            Guardar
          </Button>
        }
        
      </ModalFooter>
    </Modal>
  )
}

export default ModalBebidas