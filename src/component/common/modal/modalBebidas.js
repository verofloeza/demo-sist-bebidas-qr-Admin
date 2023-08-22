import { Button, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import React, { useState } from 'react'
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

import Files from 'react-files';
import { db } from "../../../data/firebase/firebase";
import { getDrink } from "../../../redux/actions/drinks.actions";
import { useDispatch } from 'react-redux';
import { useEffect } from "react";

const ModalBebidas = ({modal, toggle, drinkId}) => {
  const dispatch = useDispatch();
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ price, setPrice ] = useState('');
  const [ image, setImage ] = useState([]);
  const [ urlImage, setUrlImage ] = useState(null)
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [ stock, setStock ] = useState(0)

  useEffect(()=>{
    if(drinkId){
      setTitle(drinkId.title)
      setDescription(drinkId.description)
      setPrice(drinkId.price)
      setUrlImage(drinkId.image)
      setStock(drinkId.stock)
    }
    
  }, [drinkId])

  const addDrink = async () =>{
    const userRef = collection(db, "drinks");
    const drink = {
          title: title,
          description: description,
          price: price,
          image: urlImage,
          stock: stock,
          isActive: true
        };
  try {
    await addDoc(userRef, drink);
    dispatch(getDrink())
    setear()
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
    price: price,
    image: urlImage,
    stock: stock
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
    setPrice('');
    setImage([]);
    setUrlImage('');
    setStock(0);
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
                        <Label className="form-label">Precio</Label>
                        <Input
                          className="form-control input-air-primary"
                          type="text"
                          placeholder="Precio"
                          value={price}
                          onChange={(e)=> setPrice(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label className="form-label">Stock</Label>
                        <Input
                          className="form-control input-air-primary"
                          type="text"
                          placeholder="Stock"
                          value={stock}
                          onChange={(e)=> setStock(e.target.value)}
                        />
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