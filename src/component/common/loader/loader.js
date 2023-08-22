import React,{useEffect, useState} from 'react';

const Loader = (props) => {

    const [show, setShow] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setShow(false)
          }, 1000);
        
    },[show]);

    return (
        <div className={`loader-wrapper ${show ? '' : 'loderhide'}`}>
            <div className="typewriter">
                <h1>SISTEMA BEBIDAS..</h1>
            </div>
        </div>
    );
}

export default Loader;