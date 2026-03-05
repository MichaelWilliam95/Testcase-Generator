import "./ModalContent.css";

export default function ModalContent({ onClose }) {
  
  return (
    <div className="modal-container">
      <div className="overlay" onClick={onClose}></div>
      
      <div className="modal-content">
        <h2>Informasi</h2>
        <p>I'm a modal dialog!</p>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}