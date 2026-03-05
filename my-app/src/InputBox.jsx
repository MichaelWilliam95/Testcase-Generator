import ModalContent from "./ModalContent";
import { useState } from "react";

function InputBox(){
    const [modal, setModal] = useState(false);

    const openModal = () => {
        setModal(!modal)
    }
    return(
           <div>
            <h1>Input/masukan</h1>
            <input type="text" placeholder='add integer' />
            <input type="text" placeholder='add integer' />
            <button onClick={openModal} className='set-input'>
                Set-input
          </button>
            {modal && <ModalContent onClose={openModal} /> }
        </div>
    );
}

export default InputBox