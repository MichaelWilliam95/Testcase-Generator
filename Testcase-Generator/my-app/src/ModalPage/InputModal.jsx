import { useState, useEffect } from "react";
import "./InputModal.css";

export default function InputModal({ onClose, onCreate, initialData }) {
  const initialCount = initialData?.inputs?.length || 1;

  const [isMultiple, setIsMultiple] = useState(initialCount > 1);
  const [isDifferent, setIsDifferent] = useState(false);

  const [count, setCount] = useState(initialCount);
  const [dataLength, setDataLength] = useState(1);

  const [printInput, setPrintInput] = useState(initialData?.printInput || "yes");
  const [direction, setDirection] = useState(initialData?.direction || "row");

  const normalizeInputs = (data, level = 0) => {
    return data.map((item) => ({
      ...item,
      level: item.level ?? level,
      isNested: item.isNested ?? false,
      children: item.children
        ? normalizeInputs(item.children, level + 1)
        : [],
    }));
  };

  const [inputs, setInputs] = useState(
    initialData?.inputs
      ? normalizeInputs(initialData.inputs)
      : [
          {
            type: "int",
            range: {},
            isNested: false,
            children: [],
            level: 0,
          },
        ]
  );

  const isMinMaxFilled = (range) =>
    (range.min && range.min !== "") || (range.max && range.max !== "");

  const isDigitFilled = (range) =>
    range.digit && range.digit !== "";

  const isStringConstraintUsed = (range) =>
    range.regex && range.regex !== "";

  const updateByPath = (data, path, updater) => {
    const newData = [...data];
    let current = newData;

    for (let i = 0; i < path.length - 1; i++) {
      current[path[i]].children = [...current[path[i]].children];
      current = current[path[i]].children;
    }

    const lastIndex = path[path.length - 1];
    current[lastIndex] = updater(current[lastIndex]);

    return newData;
  };

  // MODE BERBEDA
  useEffect(() => {
    if (isMultiple && isDifferent) {
      setInputs((prev) => {
        const newInputs = [...prev];

        if (count > prev.length) {
          for (let i = prev.length; i < count; i++) {
            newInputs.push({
              type: "int",
              range: {},
              isNested: false,
              children: [],
              level: 0,
            });
          }
        } else {
          newInputs.length = count;
        }

        return newInputs;
      });
    }
  }, [count, isMultiple, isDifferent]);

  // MODE UNIFORM
  useEffect(() => {
    if (isMultiple && !isDifferent) {
      setInputs([
        {
          type: "int",
          range: {},
          isNested: false,
          children: [],
          level: 0,
        },
      ]);
    }
  }, [isMultiple, isDifferent]);

  // 🔥 Reset nested kalau array 2D
  useEffect(() => {
    if (isMultiple) {
      setInputs((prev) =>
        prev.map((item) => ({
          ...item,
          isNested: false,
          children: [],
        }))
      );
    }
  }, [isMultiple]);

  const handleChange = (path, field, value) => {
    setInputs((prev) =>
      updateByPath(prev, path, (item) => {
        const updated = { ...item, [field]: value };

        if (field === "type") {
          updated.range = {};
          updated.isNested = false;
          updated.children = [];
        }

        return updated;
      })
    );
  };

  const handleRangeChange = (path, field, value) => {
    setInputs((prev) =>
      updateByPath(prev, path, (item) => {
        const range = { ...item.range };

        if (field === "digit" && value !== "") {
          range.min = "";
          range.max = "";
        }

        if ((field === "min" || field === "max") && value !== "") {
          range.digit = "";
        }

        range[field] = value;

        return { ...item, range };
      })
    );
  };

  const handleFloatChange = (path, field, value) => {
    setInputs((prev) =>
      updateByPath(prev, path, (item) => {
        const range = { ...item.range };
        range[field] = value;
        return { ...item, range };
      })
    );
  };

  const handleStringChange = (path, field, value) => {
    setInputs((prev) =>
      updateByPath(prev, path, (item) => {
        const range = { ...item.range };

        if (field === "regex" && value !== "") {
          range.length = "";
          range.maxLength = "";
        }

        if ((field === "length" || field === "maxLength") && value !== "") {
          range.regex = "";
        }

        range[field] = value;

        return { ...item, range };
      })
    );
  };

  const handleNestedChange = (path, value) => {
    setInputs((prev) =>
      updateByPath(prev, path, (item) => ({
        ...item,
        isNested: value === "yes",
        children:
          value === "yes"
            ? [
                {
                  type: "int",
                  range: {},
                  isNested: false,
                  children: [],
                  level: 1,
                },
              ]
            : [],
      }))
    );
  };

  const renderInput = (item, path) => {
    const minMaxUsed = isMinMaxFilled(item.range);
    const digitUsed = isDigitFilled(item.range);

    return (
      <div key={path.join("-")} className="inputCard">
        <div className="inputHeader">
          Masukan {path.map((p) => p + 1).join(".")}
        </div>

        <div className="inputBody">
          <div className="formGroup">
            <label>Tipe Data</label>
            <select
              className="dropdown"
              value={item.type}
              onChange={(e) =>
                handleChange(path, "type", e.target.value)
              }
            >
              <option value="int">Bilangan Bulat</option>
              <option value="string">String</option>
              <option value="float">Bilangan Rill</option>
            </select>
          </div>

          {/* INT */}
          {item.type === "int" && (
            <div className="formGroup">
              <label>Batasan</label>
              <div className="rangeInputs">
                <input
                  placeholder="Min"
                  value={item.range.min || ""}
                  disabled={digitUsed}
                  onChange={(e) =>
                    handleRangeChange(path, "min", e.target.value)
                  }
                />
                <input
                  placeholder="Max"
                  value={item.range.max || ""}
                  disabled={digitUsed}
                  onChange={(e) =>
                    handleRangeChange(path, "max", e.target.value)
                  }
                />
                <label>Atau</label>
                <input
                  placeholder="Digit"
                  value={item.range.digit || ""}
                  disabled={minMaxUsed}
                  onChange={(e) =>
                    handleRangeChange(path, "digit", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {/* FLOAT */}
          {item.type === "float" && (
            <>
              <div className="formGroup">
                <label>Nilai Minimum</label>
                <input
                  type="number"
                  value={item.range.min || ""}
                  onChange={(e) =>
                    handleFloatChange(path, "min", e.target.value)
                  }
                />
              </div>

              <div className="formGroup">
                <label>Nilai Maksimum</label>
                <input
                  type="number"
                  value={item.range.max || ""}
                  onChange={(e) =>
                    handleFloatChange(path, "max", e.target.value)
                  }
                />
              </div>

              <div className="formGroup">
                <label>Jumlah angka di belakang koma</label>
                <input
                  type="number"
                  value={item.range.decimal || ""}
                  onChange={(e) =>
                    handleFloatChange(path, "decimal", e.target.value)
                  }
                />
              </div>
            </>
          )}

          {/* STRING */}
          {item.type === "string" && (
            <>
              <div className="formGroup">
                <label>Apakah panjang string tetap?</label>
                <select
                  className="dropdown"
                  value={item.range.isFixed ? "yes" : "no"}
                  disabled={isStringConstraintUsed(item.range)}
                  onChange={(e) =>
                    handleStringChange(
                      path,
                      "isFixed",
                      e.target.value === "yes"
                    )
                  }
                >
                  <option value="no">Tidak</option>
                  <option value="yes">Iya</option>
                </select>
              </div>

              {!isStringConstraintUsed(item.range) &&
                item.range.isFixed && (
                  <div className="formGroup">
                    <label>Panjang string</label>
                    <input
                      type="number"
                      value={item.range.length || ""}
                      onChange={(e) =>
                        handleStringChange(path, "length", e.target.value)
                      }
                    />
                  </div>
                )}

              {!isStringConstraintUsed(item.range) &&
                !item.range.isFixed && (
                  <div className="formGroup">
                    <label>Maksimal panjang</label>
                    <input
                      type="number"
                      value={item.range.maxLength || ""}
                      onChange={(e) =>
                        handleStringChange(
                          path,
                          "maxLength",
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}

              <div className="formGroup">
                <label>Atau gunakan Regex</label>
                <input
                  placeholder="contoh: ^[a-zA-Z]+$"
                  value={item.range.regex || ""}
                  onChange={(e) =>
                    handleStringChange(path, "regex", e.target.value)
                  }
                />
              </div>
            </>
          )}

          {/* Nested hanya untuk SINGLE input */}
          {(item.level ?? 0) === 0 &&
            !isMultiple &&
            item.type === "int" && (
              <div className="formGroup">
                <label>Apakah ini merupakan sebuah masukan lagi?</label>
                <select
                  className="dropdown"
                  value={item.isNested ? "yes" : "no"}
                  onChange={(e) =>
                    handleNestedChange(path, e.target.value)
                  }
                >
                  <option value="no">Tidak</option>
                  <option value="yes">Iya</option>
                </select>
              </div>
            )}

          {item.isNested && (
            <div className="nestedBox">
              {item.children.map((child, i) =>
                renderInput(child, [...path, i])
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalHeader">
          <h2>Pengaturan Masukan</h2>
          <span className="closeBtn" onClick={onClose}>✕</span>
        </div>

        <div className="formSection">
          <div className="formGroup">
            <label>Apakah masukan berupa array 2 dimensi dengan banyak kolom yang sama?</label>
            <select
              className="dropdown"
              value={isMultiple ? "yes" : "no"}
              onChange={(e) => {
                const val = e.target.value === "yes";
                setIsMultiple(val);
                if (!val) {
                  setCount(1);
                  setIsDifferent(false);
                }
              }}
            >
              <option value="no">Tidak</option>
              <option value="yes">Iya</option>
            </select>
          </div>

          {isMultiple && (
            <div className="formGroup">
              <label>Apakah tipe data pada kolom bisa berbeda?</label>
              <select
                className="dropdown"
                value={isDifferent ? "yes" : "no"}
                onChange={(e) => {
                  const val = e.target.value === "yes";
                  setIsDifferent(val);
                  if (!val) setCount(1);
                }}
              >
                <option value="no">Tidak</option>
                <option value="yes">Iya</option>
              </select>
            </div>
          )}

          {isMultiple && isDifferent && (
            <div className="formGroup">
              <label>Banyak data (kolom)</label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>
          )}

          {isMultiple && !isDifferent && (
            <div className="formGroup">
              <label>Banyak data (kolom)</label>
              <input
                type="number"
                value={dataLength}
                onChange={(e) => setDataLength(Number(e.target.value))}
              />
            </div>
          )}

          {inputs.map((item, i) => renderInput(item, [i]))}

          {!isMultiple && (
            <div className="formGroup">
              <label>Arah Print</label>
              <select
                className="dropdown"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              >
                <option value="row">Row</option>
                <option value="column">Column</option>
              </select>
            </div>
          )}

          <div className="formGroup">
            <label>Apakah masukan bilangan bulat ingin diprint?</label>
            <select
              className="dropdown"
              value={printInput}
              onChange={(e) => setPrintInput(e.target.value)}
            >
              <option value="yes">Ya</option>
              <option value="no">Tidak</option>
            </select>
          </div>
        </div>

        <div className="modalButtons">
          <button
            className="btn primary"
            onClick={() =>
              onCreate({
                inputs,
                printInput,
                direction: isMultiple ? null : direction,
                isDifferent,
                count: isDifferent ? count : null,
                dataLength: !isDifferent ? dataLength : null,
              })
            }
          >
            Save
          </button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}