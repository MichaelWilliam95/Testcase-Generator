import { useState, useEffect, useRef } from "react";
import "./InputModal.css";

const createDefaultInput = (level = 0) => ({
  type: "int",
  range: {
    min: "",
    max: "",
    digit: "",
    order: "none",
    multipleOf: "",
    printDigitCount: false,
    isFixed: false,
    length: "",
    maxLength: "",
    minAscii: "",
    maxAscii: "",
    regex: "",
  },
  isNested: false,
  children: [],
  level: level,
  direction: "row", 
});

export default function InputModal({ onClose, onCreate, initialData }) {
  const isInitialLoad = useRef(true);

  const normalizeInputs = (data, level = 0, currentDirection = "row") => {
    if (!Array.isArray(data)) return [createDefaultInput(level)];
    return data.map((item) => {
      const deepRange = item.range ? { ...item.range } : { ...createDefaultInput(level).range };
      if (deepRange.printDigitCount === undefined) deepRange.printDigitCount = false; 

      return {
        ...item,
        level: item.level ?? level,
        direction: item.direction ?? currentDirection, 
        isNested: item.isNested ?? false,
        range: deepRange,
        children: item.children ? normalizeInputs(item.children, level + 1, item.direction ?? currentDirection) : [],
      };
    });
  };

  // State Declarations
  const [inputs, setInputs] = useState([createDefaultInput()]);
  const [isMultiple, setIsMultiple] = useState(false);
  const [isDifferent, setIsDifferent] = useState(false);
  const [count, setCount] = useState(1);
  const [dataLength, setDataLength] = useState(1);
  const [printInput, setPrintInput] = useState("yes");
  const [direction, setDirection] = useState("row"); 
  const [nestedFormat, setNestedFormat] = useState("masing-masing");

  /* =========================================
      1. LOAD INITIAL DATA
  ========================================= */
  useEffect(() => {
    if (!initialData) {
      setInputs([createDefaultInput()]);
      setIsMultiple(false);
      setIsDifferent(false);
      setCount(1); 
      setDataLength(1);
      setPrintInput("yes");
      setDirection("row");
      setNestedFormat("masing-masing");
      isInitialLoad.current = false;
      return;
    }

    const initialDir = initialData.direction || (initialData.inputs?.[0]?.direction) || "row";
    const savedInputs = initialData.inputs ? normalizeInputs(initialData.inputs, 0, initialDir) : [createDefaultInput()];
    
    setInputs(savedInputs);
    setIsMultiple(!!(initialData.count || initialData.dataLength));
    setIsDifferent(initialData.isDifferent ?? false);
    
    const savedCount = initialData.isDifferent ? (initialData.count || savedInputs.length) : 1;
    setCount(savedCount);
    setDataLength(initialData.dataLength || 1);
    setPrintInput(initialData.printInput || "yes");
    setDirection(initialDir);
    setNestedFormat(initialData.nestedFormat || "masing-masing");

    setTimeout(() => {
      isInitialLoad.current = false;
    }, 0);
  }, [initialData]);

  /* =========================================
      2. EFFECT: UPDATE DIRECTION SECARA SMART RECURSIVE
  ========================================= */
  useEffect(() => {
    if (isMultiple || isInitialLoad.current) return; 

    const applyDirectionRecursively = (items, dir) => {
      return items.map((item) => {
        const currentDir = item.isNested ? "row" : dir;

        return {
          ...item,
          direction: currentDir,
          children: item.children ? applyDirectionRecursively(item.children, dir) : [],
        };
      });
    };

    setInputs((prev) => applyDirectionRecursively(prev, direction));
  }, [direction, isMultiple]);

  /* =========================================
      3. HANDLE MULTIPLE / DIFFERENT STRUCTURE
  ========================================= */
  useEffect(() => {
    if (isInitialLoad.current) return;

    setInputs((prev) => {
      if (!isMultiple) {
        return [prev[0] ? { ...prev[0], level: 0, direction: direction } : { ...createDefaultInput(), direction: direction }];
      }

      const sanitizeBase = (item) => ({
        ...item,
        isNested: false,
        children: []
      });

      if (!isDifferent) {
        return [prev[0] ? sanitizeBase(prev[0]) : createDefaultInput()];
      }

      let updated = prev.map((item) => ({
        ...sanitizeBase(item),
        range: {
          ...item.range,
          order: "none"
        }
      }));

      if (count > updated.length) {
        const diff = count - updated.length;
        for (let i = 0; i < diff; i++) {
          updated.push(createDefaultInput());
        }
      } else if (count < updated.length) {
        updated = updated.slice(0, count);
      }
      return updated;
    });
  }, [count, isMultiple, isDifferent]);

  /* =========================================
      4. UPDATE BY PATH
  ========================================= */
  const updateByPath = (data, path, updater) => {
    const cloneData = (items, currentPathIdx = 0) => {
      return items.map((item, idx) => {
        if (idx !== path[currentPathIdx]) {
          return item; 
        }

        if (currentPathIdx === path.length - 1) {
          return updater({ ...item });
        }

        return {
          ...item,
          children: cloneData([...item.children], currentPathIdx + 1),
        };
      });
    };

    return cloneData(data);
  };

  /* =========================================
      5. EVENT HANDLERS
  ========================================= */
  const handleChange = (path, field, value) => {
    setInputs((prev) =>
      updateByPath(prev, path, (item) => {
        const updated = { ...item, [field]: value };

        if (field === "type") {
          updated.range = { ...createDefaultInput().range };
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

        if (item.type !== "float") {
          if (field === "digit" && value !== "") {
            range.min = "";
            range.max = "";
            range.multipleOf = ""; 
          }
          if (field === "digit" && value === "") {
            range.printDigitCount = false;
          }
          if ((field === "min" || field === "max") && value !== "") {
            range.digit = "";
            range.printDigitCount = false; 
          }
        }

        range[field] = value;
        
        let isNested = item.isNested;
        let children = item.children;

        if (field === "digit" && value !== "") {
          isNested = false;
          children = [];
        }

        if (item.type !== "float" && (field === "min" || field === "max")) {
          const currentMin = range.min !== "" ? Number(range.min) : 0;
          const currentMax = range.max !== "" ? Number(range.max) : 0;
          
          if (currentMin < 0 || currentMax < 0) {
            isNested = false;
            children = [];
          }
        }

        return { ...item, range, isNested, children };
      })
    );
  };

  const handleNestedChange = (path, value) => {
    setInputs((prev) =>
      updateByPath(prev, path, (item) => {
        const isNested = value === "yes";
        return {
          ...item,
          isNested,
          children: isNested ? [{ ...createDefaultInput(item.level + 1), direction: direction }] : [],
        };
      })
    );
  };

  /* =========================================
      6. RECURSIVE RENDER COMPONENT
  ========================================= */
  const renderInput = (item, path) => {
    const digitUsed = item.type !== "float" && item.range.digit !== "";
    const minMaxUsed = item.type !== "float" && (item.range.min !== "" || item.range.max !== "");
    const regexUsed = !!item.range.regex;

    const isMinNegative = item.type !== "float" && item.range.min !== "" && Number(item.range.min) < 0;
    const isMaxNegative = item.type !== "float" && item.range.max !== "" && Number(item.range.max) < 0;
    const hasNegativeLimit = isMinNegative || isMaxNegative;

    const isColumnLayout = !isMultiple && direction === "column";

    return (
      <div 
        key={path.join("-")} 
        className="inputCard" 
        style={{ marginLeft: isColumnLayout ? "0px" : `${item.level * 15}px` }}
      >
        <div className="inputHeader">
          Masukan {path.map((p) => p + 1).join(".")}
        </div>

        <div className="inputBody">
          <div className="formGroup">
            <label>Tipe Data</label>
            <select
              className="dropdown"
              value={item.type}
              onChange={(e) => handleChange(path, "type", e.target.value)}
            >
              <option value="int">Bilangan Bulat</option>
              <option value="float">Bilangan Riil</option>
              <option value="string">String</option>
            </select>
          </div>

          {item.type === "int" && (
            <>
              <div className="formGroup">
                <label>Batasan</label>
                <div className="rangeInputs">
                  <input
                    type="number"
                    placeholder="Min"
                    disabled={digitUsed}
                    value={item.range.min}
                    onChange={(e) => handleRangeChange(path, "min", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    disabled={digitUsed}
                    value={item.range.max}
                    onChange={(e) => handleRangeChange(path, "max", e.target.value)}
                  />
                  <label>Atau</label>
                  <input
                    type="number"
                    placeholder="Digit"
                    disabled={minMaxUsed}
                    value={item.range.digit}
                    onChange={(e) => handleRangeChange(path, "digit", e.target.value)}
                  />
                </div>
              </div>

              {!(isMultiple && isDifferent) && (
                <div className="formGroup">
                  <label>Urutan Data</label>
                  <select
                    className="dropdown"
                    value={item.range.order}
                    onChange={(e) => handleRangeChange(path, "order", e.target.value)}
                  >
                    <option value="none">Tidak perlu</option>
                    <option value="increment">Increment</option>
                    <option value="decrement">Decrement</option>
                  </select>
                </div>
              )}

              <div className="formGroup">
                <label>Kelipatan (Opsional)</label>
                <input
                  type="number"
                  disabled={digitUsed}
                  value={item.range.multipleOf}
                  onChange={(e) => handleRangeChange(path, "multipleOf", e.target.value)}
                  placeholder={digitUsed ? "Tidak aktif saat kolom digit terisi" : ""}
                />
              </div>

              {digitUsed && (
                <div className="formGroup">
                  <label>Cetak jumlah digit sebagai input sebelumnya?</label>
                  <select
                    className="dropdown"
                    value={item.range.printDigitCount ? "yes" : "no"}
                    onChange={(e) => handleRangeChange(path, "printDigitCount", e.target.value === "yes")}
                  >
                    <option value="no">Tidak</option>
                    <option value="yes">Ya</option>
                  </select>
                </div>
              )}

              {/* PERUBAHAN UTAMA: Batasan level diubah dari item.level === 0 menjadi item.level < 2 */}
              {item.level < 2 && !isMultiple && !digitUsed && !hasNegativeLimit && (
                <div className="formGroup">
                  <label>Apakah ini masukan lagi?</label>
                  <select
                    className="dropdown"
                    value={item.isNested ? "yes" : "no"}
                    onChange={(e) => handleNestedChange(path, e.target.value)}
                  >
                    <option value="no">Tidak</option>
                    <option value="yes">Iya</option>
                  </select>
                </div>
              )}
            </>
          )}

          {item.type === "float" && (
            <>
              <div className="formGroup">
                <label>Minimum</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={item.range.min}
                  onChange={(e) => handleRangeChange(path, "min", e.target.value)}
                />
              </div>
              <div className="formGroup">
                <label>Maksimum</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={item.range.max}
                  onChange={(e) => handleRangeChange(path, "max", e.target.value)}
                />
              </div>
              <div className="formGroup">
                <label>Digit belakang koma</label>
                <input
                  type="number"
                  placeholder="Contoh: 2"
                  value={item.range.digit}
                  onChange={(e) => handleRangeChange(path, "digit", e.target.value)}
                />
              </div>

              {!(isMultiple && isDifferent) && (
                <div className="formGroup">
                  <label>Urutan Data</label>
                  <select
                    className="dropdown"
                    value={item.range.order}
                    onChange={(e) => handleRangeChange(path, "order", e.target.value)}
                  >
                    <option value="none">Tidak perlu</option>
                    <option value="increment">Increment</option>
                    <option value="decrement">Decrement</option>
                  </select>
                </div>
              )}
            </>
          )}

          {item.type === "string" && (
            <>
              <div className="formGroup">
                <label>Regex</label>
                <input
                  placeholder="Contoh: [A-Z]{3}[0-9]"
                  value={item.range.regex}
                  onChange={(e) => handleRangeChange(path, "regex", e.target.value)}
                />
              </div>

              {!regexUsed && (
                <>
                  <div className="formGroup">
                    <label>Batasan Rentang ASCII</label>
                    <div className="rangeInputs">
                      <input
                        type="number"
                        placeholder="Start ASCII (ex: 65)"
                        min="0"
                        max="255"
                        value={item.range.minAscii}
                        onChange={(e) => handleRangeChange(path, "minAscii", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="End ASCII (ex: 90)"
                        min="0"
                        max="255"
                        value={item.range.maxAscii}
                        onChange={(e) => handleRangeChange(path, "maxAscii", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="formGroup">
                    <label>Panjang tetap?</label>
                    <select
                      className="dropdown"
                      value={item.range.isFixed ? "yes" : "no"}
                      onChange={(e) => handleRangeChange(path, "isFixed", e.target.value === "yes")}
                    >
                      <option value="no">Tidak</option>
                      <option value="yes">Ya</option>
                    </select>
                  </div>

                  {item.range.isFixed ? (
                    <div className="formGroup">
                      <label>Length</label>
                      <input
                        type="number"
                        value={item.range.length}
                        onChange={(e) => handleRangeChange(path, "length", e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="formGroup">
                      <label>Max Length</label>
                      <input
                        type="number"
                        value={item.range.maxLength}
                        onChange={(e) => handleRangeChange(path, "maxLength", e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {item.isNested && item.children && item.children.length > 0 && (
            <div className={`nestedBox ${isColumnLayout ? "is-column-layout" : ""}`}>
              {item.children.map((child, i) => renderInput(child, [...path, i]))}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* =========================================
      7. MAIN JSX
  ========================================= */
  const isColumnLayoutActive = !isMultiple && direction === "column";
  const hasNestedChild = !isMultiple && inputs[0]?.isNested === true;

  return (
    <div className="modalOverlay">
      <div className={`modal ${isColumnLayoutActive ? "is-column-layout" : ""}`}>
        <div className="modalHeader">
          <h2>Pengaturan Masukan</h2>
          <span className="closeBtn" onClick={onClose}>✕</span>
        </div>

        <div className="formSection">
          <div className="formGroup">
            <label>Apakah masukan berupa array 2 dimensi atau setiap kolom bisa berbeda tipe data?</label>
            <select
              className="dropdown"
              value={isMultiple ? "yes" : "no"}
              onChange={(e) => setIsMultiple(e.target.value === "yes")}
            >
              <option value="no">Tidak</option>
              <option value="yes">Iya</option>
            </select>
          </div>

          {isMultiple && (
            <>
              <div className="formGroup">
                <label>Apakah setiap kolom berbeda tipe data?</label>
                <select
                  className="dropdown"
                  value={isDifferent ? "yes" : "no"}
                  onChange={(e) => setIsDifferent(e.target.value === "yes")}
                >
                  <option value="no">Tidak</option>
                  <option value="yes">Iya</option>
                </select>
              </div>

              <div className="formGroup">
                <label>Banyak Kolom</label>
                <input
                  type="number"
                  min="1"
                  value={isDifferent ? count : dataLength}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value));
                    if (isDifferent) setCount(val);
                    else setDataLength(val);
                  }}
                />
              </div>
            </>
          )}

          <div className={`inputCardsContainer ${isColumnLayoutActive ? "is-column-layout" : ""}`}>
            {inputs.map((item, i) => renderInput(item, [i]))}
          </div>

          {!isMultiple && (
            <div className="formGroup">
              <label>Arah Print</label>
              <select className="dropdown" value={direction} onChange={(e) => setDirection(e.target.value)}>
                <option value="row">Row</option>
                <option value="column">Column</option>
              </select>
            </div>
          )}

          {(hasNestedChild || isMultiple) && (
            <div className="formGroup">
              <label>Print Input (Cetak Banyak Kolom)?</label>
              <select className="dropdown" value={printInput} onChange={(e) => setPrintInput(e.target.value)}>
                <option value="yes">Ya</option>
                <option value="no">Tidak</option>
              </select>
            </div>
          )}

          {hasNestedChild && printInput === "yes" && (
            <div className="formGroup">
              <label>Format Cetak Nested</label>
              <select className="dropdown" value={nestedFormat} onChange={(e) => setNestedFormat(e.target.value)}>
                <option value="masing-masing">Masing-masing (Campur Hasil)</option>
                <option value="input-terlebih-dahulu">Input Terlebih Dahulu</option>
              </select>
            </div>
          )}
        </div>

        <div className="modalButtons">
          <button
            className="btn primary"
            onClick={() =>
              onCreate({
                inputs,
                printInput: isMultiple ? printInput : (hasNestedChild ? printInput : "yes"),
                direction: isMultiple ? null : direction,
                nestedFormat: (hasNestedChild && printInput === "yes") ? nestedFormat : "masing-masing",
                isDifferent,
                count: isMultiple ? (isDifferent ? count : dataLength) : null,
                dataLength: isMultiple && !isDifferent ? dataLength : null,
              })
            }
          >
            Save
          </button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}