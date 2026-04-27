import React from "react";
import InputRow from "./InputRow";
import "./InputSection.css";

export default function InputSection({
  inputs,
  onChange,
  onOpenModal,
  onDelete,
}) {
  return (
    <div className="inputSection">
      {inputs.map((item, index) => (
        <InputRow
          key={item.id}
          value={item.value}
          onChange={(val) => onChange(index, val)}
          onOpenModal={() => onOpenModal(index)}
          onDelete={() => onDelete(index)}
        />
      ))}
    </div>
  );
}