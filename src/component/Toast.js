import React, { useEffect, useState,forwardRef ,useImperativeHandle } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
const Toasts = forwardRef((props, ref) =>{
    const [show,setShow]=useState(false);
    const [error,seterror]=useState('');
    const style={
        black:{
            "color":"black"
        }
    }
    useImperativeHandle(ref, () => ({
    errors(error)
    {
        seterror(error);
        setShow(true);
    }
}));
return (
    <ToastContainer position="bottom-end" className="position-fixed" >
    <Toast  onClose={() => setShow(false)}  show={show} delay={3000} autohide>
<Toast.Header>
 <img src="holder.js/20x20?text=%20" className="rounded me-2" alt=""
 />
 <strong className="me-auto">Alert</strong>
</Toast.Header>
<Toast.Body style={style.black}>{error}</Toast.Body>
</Toast>
</ToastContainer>
)
})
export default Toasts;