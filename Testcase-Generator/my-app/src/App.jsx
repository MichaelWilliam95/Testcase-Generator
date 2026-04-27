import { useState } from "react";
import InputSection from "./InputSection/InputSection";
import InputModal from "./ModalPage/InputModal";
import "./App.css";
import "./ModalPage/InputModal.css";

export default function App() {
  const [showModal, setShowModal] = useState(false);

  //agar ada 1 input didepan
  const [inputs, setInputs] = useState([{ config: null }]);

  const [activeIndex, setActiveIndex] = useState(null);

  // Create = tambah row kosong
  const handleCreate = () => {
    setInputs((prev) => [...prev, { config: null }]);
  };

  // buka modal untuk row tertentu
  const handleOpenModal = (index) => {
    setActiveIndex(index);
    setShowModal(true);
  };

  // Save = update row, BUKAN tambah
  const handleSave = (data) => {
    setInputs((prev) => {
      const updated = [...prev];
      updated[activeIndex] = {
        ...updated[activeIndex],
        config: data,
      };
      return updated;
    });

    setShowModal(false);
    setActiveIndex(null);
  };

  const handleDelete = (index) => {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Generator Kasus Uji</h1>

        <InputSection
          inputs={inputs}
          onOpenModal={handleOpenModal}
          onDelete={handleDelete}
        />

        <div className="bottom-section">
          <button className="btn primary" onClick={handleCreate}>
            Tambahkan Masukan Baru
          </button>
        </div>
      </div>

      {showModal && (
        <InputModal
          onClose={() => setShowModal(false)}
          onCreate={handleSave}
          initialData={inputs[activeIndex]?.config}
        />
      )}
    </div>
  );
}