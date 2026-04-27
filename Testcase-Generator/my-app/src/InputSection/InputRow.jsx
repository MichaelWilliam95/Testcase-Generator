import React from "react";
import "./InputRow.css";

export default function InputRow({ value, onChange, onOpenModal, onDelete }) {
  return (
    <div className="row">
      <label>Masukan sebuah bilangan bulat</label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="actions">
        <button type="button" onClick={onOpenModal}>
          Pengaturan
        </button>

        <button
          type="button"
          className="delete"
          onClick={onDelete}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}