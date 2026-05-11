import "./InputRow.css";

export default function InputRow({
  index,
  data,
  onOpenModal,
  onDelete,
  onTogglePrint,
  onSlotChange,
}) {
  return (
    <div className="row">
      <label>
        Masukan {index + 1}
      </label>

      <input
        type="number"
        min="1"
        value={data.slotCount}
        onChange={(e) =>
          onSlotChange(
            e.target.value
          )
        }
      />

      <select
        value={
          data.printInput
            ? "yes"
            : "no"
        }
        onChange={(e) =>
          onTogglePrint(
            e.target.value === "yes"
          )
        }
      >
        <option value="yes">
          Print
        </option>
        <option value="no">
          Jangan Print
        </option>
      </select>

      <button onClick={onOpenModal}>
        Pengaturan
      </button>

      <button
        className="delete"
        onClick={onDelete}
      >
        Hapus
      </button>
    </div>
  );
}