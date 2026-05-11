import InputRow from "./InputRow";
import "./InputSection.css";

export default function InputSection({
  inputs,
  onOpenModal,
  onDelete,
  onTogglePrint,
  onSlotChange,
}) {
  return (
    <div className="inputSection">
      {inputs.map((item, i) => (
        <InputRow
          key={i}
          index={i}
          data={item}
          onOpenModal={() =>
            onOpenModal(i)
          }
          onDelete={() =>
            onDelete(i)
          }
          onTogglePrint={(value) =>
            onTogglePrint(i, value)
          }
          onSlotChange={(value) =>
            onSlotChange(i, value)
          }
        />
      ))}
    </div>
  );
}