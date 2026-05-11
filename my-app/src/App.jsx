import { useState } from "react";
import InputSection from "./InputSection/InputSection";
import InputModal from "./ModalPage/InputModal";

import { generateInteger } from "./generator/integerGenerator";
import { generateString } from "./generator/stringGenerator";

import "./App.css";
import "./ModalPage/InputModal.css";

export default function App() {
  const [showModal, setShowModal] =
    useState(false);

  const [
    generatedOutput,
    setGeneratedOutput,
  ] = useState("");

  const [inputs, setInputs] =
    useState([
      {
        config: null,
        printInput: false,
        slot: "",
      },
    ]);

  const [activeIndex, setActiveIndex] =
    useState(null);

  const handleCreate = () => {
    setInputs((prev) => [
      ...prev,
      {
        config: null,
        printInput: false,
        slot: "",
      },
    ]);
  };

  const handleOpenModal = (
    index
  ) => {
    setActiveIndex(index);
    setShowModal(true);
  };

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

  const handleDelete = (
    index
  ) => {
    setInputs((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleTogglePrint = (
    index,
    value
  ) => {
    setInputs((prev) => {
      const updated = [...prev];
      updated[index].printInput =
        value;
      return updated;
    });
  };

  const handleSlotChange = (
    index,
    value
  ) => {
    setInputs((prev) => {
      const updated = [...prev];
      updated[index].slot = value;
      return updated;
    });
  };

  const handleGenerate = () => {
    let result = [];

    inputs.forEach((item) => {
      if (!item.config) return;

      const config =
        item.config;

      const firstInput =
        config.inputs?.[0];

      if (!firstInput) return;

      const type =
        firstInput.type;

      let slotCount = 1;

      if (
        item.slot &&
        item.slot !== ""
      ) {
        slotCount = Number(
          item.slot
        );
      }

      let generated = "";

      if (type === "int") {
        generated =
          generateInteger(
            config,
            slotCount
          );
      } else if (
        type === "string"
      ) {
        generated =
          generateString(
            config,
            slotCount
          );
      } else {
        generated =
          "TYPE_NOT_SUPPORTED";
      }

      if (
        item.printInput
      ) {
        result.push(
          String(slotCount)
        );
      }

      result.push(
        generated
      );
    });

    setGeneratedOutput(
      result.join("\n")
    );
  };

  const handleReset = () => {
    setInputs([
      {
        config: null,
        printInput: false,
        slot: "",
      },
    ]);

    setGeneratedOutput("");
  };

  const handleDownload = () => {
    const blob = new Blob(
      [generatedOutput],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;
    link.download =
      "hasil_test_case.txt";

    link.click();

    URL.revokeObjectURL(
      url
    );
  };

  return (
    <div className="container">
      <div className="card">
        <h1>
          Generator Kasus Uji
        </h1>

        <InputSection
          inputs={inputs}
          onOpenModal={
            handleOpenModal
          }
          onDelete={
            handleDelete
          }
          onTogglePrint={
            handleTogglePrint
          }
          onSlotChange={
            handleSlotChange
          }
        />

        <div className="bottom-section">
          <button
            className="btn primary"
            onClick={
              handleCreate
            }
          >
            Tambahkan Masukan
            Baru
          </button>

          <button
            className="btn success"
            onClick={
              handleGenerate
            }
          >
            Generate
          </button>

          <button
            className="btn danger"
            onClick={
              handleReset
            }
          >
            Reset
          </button>

          <button
            className="btn secondary"
            onClick={
              handleDownload
            }
            disabled={
              !generatedOutput
            }
          >
            Download
          </button>
        </div>

        <div className="output-section">
          <h3>
            Hasil Generate
          </h3>

          <textarea
            value={
              generatedOutput
            }
            readOnly
            placeholder="Hasil generate akan muncul di sini..."
          />
        </div>
      </div>

      {showModal && (
        <InputModal
          onClose={() =>
            setShowModal(
              false
            )
          }
          onCreate={
            handleSave
          }
          initialData={
            inputs[
              activeIndex
            ]?.config
          }
        />
      )}
    </div>
  );
}