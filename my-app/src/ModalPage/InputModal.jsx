import { useState, useEffect } from "react";
import "./InputModal.css";

export default function InputModal({
  onClose,
  onCreate,
  initialData,
}) {
  const defaultInput = {
    type: "int",
    range: {
      order: "none",
      multipleOf: "",
      isFixed: false,
      length: "",
      maxLength: "",
      minAscii: "",
      maxAscii: "",
      regex: "",
    },
    isNested: false,
    children: [],
    level: 0,
  };

  const normalizeInputs = (
    data,
    level = 0
  ) => {
    return data.map((item) => ({
      ...item,
      level: item.level ?? level,
      isNested:
        item.isNested ?? false,
      children: item.children
        ? normalizeInputs(
            item.children,
            level + 1
          )
        : [],
    }));
  };

  const [inputs, setInputs] =
    useState([{ ...defaultInput }]);

  const [isMultiple, setIsMultiple] =
    useState(false);

  const [
    isDifferent,
    setIsDifferent,
  ] = useState(false);

  const [count, setCount] =
    useState(1);

  const [dataLength, setDataLength] =
    useState(1);

  const [printInput, setPrintInput] =
    useState("yes");

  const [direction, setDirection] =
    useState("row");

  useEffect(() => {
    if (!initialData) {
      setInputs([{ ...defaultInput }]);
      setIsMultiple(false);
      setIsDifferent(false);
      setCount(1);
      setDataLength(1);
      setPrintInput("yes");
      setDirection("row");
      return;
    }

    setInputs(
      initialData.inputs
        ? normalizeInputs(
            initialData.inputs
          )
        : [{ ...defaultInput }]
    );

    setIsMultiple(
      initialData.count !== null ||
        initialData.dataLength !==
          null
    );

    setIsDifferent(
      initialData.isDifferent ??
        false
    );

    setCount(
      initialData.count ||
        initialData.inputs
          ?.length ||
        1
    );

    setDataLength(
      initialData.dataLength || 1
    );

    setPrintInput(
      initialData.printInput ||
        "yes"
    );

    setDirection(
      initialData.direction ||
        "row"
    );
  }, [initialData]);

  const updateByPath = (
    data,
    path,
    updater
  ) => {
    const newData = [...data];
    let current = newData;

    for (
      let i = 0;
      i < path.length - 1;
      i++
    ) {
      current[path[i]].children = [
        ...current[path[i]]
          .children,
      ];
      current =
        current[path[i]].children;
    }

    const lastIndex =
      path[path.length - 1];

    current[lastIndex] = updater(
      current[lastIndex]
    );

    return newData;
  };

  useEffect(() => {
    if (isMultiple && isDifferent) {
      setInputs((prev) => {
        const updated = [...prev];

        if (
          count > updated.length
        ) {
          for (
            let i =
              updated.length;
            i < count;
            i++
          ) {
            updated.push({
              ...defaultInput,
            });
          }
        } else {
          updated.length = count;
        }

        return updated;
      });
    }

    if (isMultiple && !isDifferent) {
      setInputs((prev) =>
        prev.length === 1
          ? prev
          : [{ ...prev[0] }]
      );
    }
  }, [count, isMultiple, isDifferent]);

  const handleChange = (
    path,
    field,
    value
  ) => {
    setInputs((prev) =>
      updateByPath(
        prev,
        path,
        (item) => {
          const updated = {
            ...item,
            [field]: value,
          };

          if (
            field === "type"
          ) {
            updated.range = {
              order: "none",
              multipleOf: "",
              isFixed: false,
              length: "",
              maxLength: "",
              minAscii: "",
              maxAscii: "",
              regex: "",
            };

            updated.isNested =
              false;
            updated.children =
              [];
          }

          return updated;
        }
      )
    );
  };

  const handleRangeChange = (
    path,
    field,
    value
  ) => {
    setInputs((prev) =>
      updateByPath(
        prev,
        path,
        (item) => {
          const range = {
            ...item.range,
          };

          if (
            field === "digit" &&
            value !== ""
          ) {
            range.min = "";
            range.max = "";
          }

          if (
            (field === "min" ||
              field === "max") &&
            value !== ""
          ) {
            range.digit = "";
          }

          if (
            field === "regex" &&
            value !== ""
          ) {
            range.isFixed = false;
            range.length = "";
            range.maxLength = "";
            range.minAscii = "";
            range.maxAscii = "";
          }

          range[field] = value;

          return {
            ...item,
            range,
          };
        }
      )
    );
  };

  const handleNestedChange = (
    path,
    value
  ) => {
    setInputs((prev) =>
      updateByPath(
        prev,
        path,
        (item) => ({
          ...item,
          isNested:
            value === "yes",
          children:
            value === "yes"
              ? [
                  {
                    ...defaultInput,
                    level: 1,
                  },
                ]
              : [],
        })
      )
    );
  };

  const renderInput = (
    item,
    path
  ) => {
    const digitUsed =
      item.range.digit &&
      item.range.digit !== "";

    const minMaxUsed =
      (item.range.min &&
        item.range.min !== "") ||
      (item.range.max &&
        item.range.max !== "");

    return (
      <div
        key={path.join("-")}
        className="inputCard"
      >
        <div className="inputHeader">
          Masukan{" "}
          {path
            .map(
              (p) => p + 1
            )
            .join(".")}
        </div>

        <div className="inputBody">
          <div className="formGroup">
            <label>
              Tipe Data
            </label>

            <select
              className="dropdown"
              value={item.type}
              onChange={(e) =>
                handleChange(
                  path,
                  "type",
                  e.target.value
                )
              }
            >
              <option value="int">
                Bilangan Bulat
              </option>
              <option value="string">
                String
              </option>
              <option value="float">
                Bilangan Riil
              </option>
            </select>
          </div>

          {item.type === "int" && (
            <>
              <div className="formGroup">
                <label>
                  Batasan
                </label>

                <div className="rangeInputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={
                      item.range.min ||
                      ""
                    }
                    disabled={
                      digitUsed
                    }
                    onChange={(e) =>
                      handleRangeChange(
                        path,
                        "min",
                        e.target
                          .value
                      )
                    }
                  />

                  <input
                    type="number"
                    placeholder="Max"
                    value={
                      item.range.max ||
                      ""
                    }
                    disabled={
                      digitUsed
                    }
                    onChange={(e) =>
                      handleRangeChange(
                        path,
                        "max",
                        e.target
                          .value
                      )
                    }
                  />

                  <input
                    type="number"
                    placeholder="Digit"
                    value={
                      item.range
                        .digit ||
                      ""
                    }
                    disabled={
                      minMaxUsed
                    }
                    onChange={(e) =>
                      handleRangeChange(
                        path,
                        "digit",
                        e.target
                          .value
                      )
                    }
                  />
                </div>
              </div>

              <div className="formGroup">
                <label>
                  Urutan Data
                </label>

                <select
                  className="dropdown"
                  value={
                    item.range
                      .order ||
                    "none"
                  }
                  onChange={(e) =>
                    handleRangeChange(
                      path,
                      "order",
                      e.target.value
                    )
                  }
                >
                  <option value="none">
                    Tidak perlu
                  </option>
                  <option value="increment">
                    Increment
                  </option>
                  <option value="decrement">
                    Decrement
                  </option>
                </select>
              </div>

              <div className="formGroup">
                <label>
                  Kelipatan
                </label>

                <input
                  type="number"
                  value={
                    item.range
                      .multipleOf ||
                    ""
                  }
                  onChange={(e) =>
                    handleRangeChange(
                      path,
                      "multipleOf",
                      e.target.value
                    )
                  }
                />
              </div>

              {!isMultiple &&
                item.level ===
                  0 && (
                  <div className="formGroup">
                    <label>
                      Apakah ini
                      merupakan sebuah
                      masukan lagi?
                    </label>

                    <select
                      className="dropdown"
                      value={
                        item.isNested
                          ? "yes"
                          : "no"
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          path,
                          e.target.value
                        )
                      }
                    >
                      <option value="no">
                        Tidak
                      </option>
                      <option value="yes">
                        Iya
                      </option>
                    </select>
                  </div>
                )}
            </>
          )}

          {item.type === "string" && (
            <>
              <div className="formGroup">
                <label>
                  Panjang tetap?
                </label>

                <select
                  className="dropdown"
                  value={
                    item.range.isFixed
                      ? "yes"
                      : "no"
                  }
                  disabled={
                    item.range.regex
                  }
                  onChange={(e) =>
                    handleRangeChange(
                      path,
                      "isFixed",
                      e.target.value ===
                        "yes"
                    )
                  }
                >
                  <option value="no">
                    Tidak
                  </option>
                  <option value="yes">
                    Iya
                  </option>
                </select>
              </div>

              {item.range.isFixed ? (
                <div className="formGroup">
                  <label>
                    Length
                  </label>
                  <input
                    type="number"
                    value={
                      item.range
                        .length || ""
                    }
                    onChange={(e) =>
                      handleRangeChange(
                        path,
                        "length",
                        e.target.value
                      )
                    }
                  />
                </div>
              ) : (
                <div className="formGroup">
                  <label>
                    Max Length
                  </label>
                  <input
                    type="number"
                    value={
                      item.range
                        .maxLength ||
                      ""
                    }
                    onChange={(e) =>
                      handleRangeChange(
                        path,
                        "maxLength",
                        e.target.value
                      )
                    }
                  />
                </div>
              )}

              <div className="formGroup">
                <label>
                  ASCII Range
                </label>

                <div className="rangeInputs">
                  <input
                    type="number"
                    placeholder="Min ASCII"
                    value={
                      item.range
                        .minAscii || ""
                    }
                    onChange={(e) =>
                      handleRangeChange(
                        path,
                        "minAscii",
                        e.target.value
                      )
                    }
                  />

                  <input
                    type="number"
                    placeholder="Max ASCII"
                    value={
                      item.range
                        .maxAscii || ""
                    }
                    onChange={(e) =>
                      handleRangeChange(
                        path,
                        "maxAscii",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="formGroup">
                <label>
                  Regex
                </label>

                <input
                  placeholder="^[a-zA-Z]+$"
                  value={
                    item.range.regex ||
                    ""
                  }
                  onChange={(e) =>
                    handleRangeChange(
                      path,
                      "regex",
                      e.target.value
                    )
                  }
                />
              </div>
            </>
          )}

          {item.isNested && (
            <div className="nestedBox">
              {item.children.map(
                (
                  child,
                  i
                ) =>
                  renderInput(
                    child,
                    [
                      ...path,
                      i,
                    ]
                  )
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
          <h2>
            Pengaturan
            Masukan
          </h2>

          <span
            className="closeBtn"
            onClick={onClose}
          >
            ✕
          </span>
        </div>

        <div className="formSection">
          <div className="formGroup">
            <label>
              Apakah array 2D?
            </label>

            <select
              className="dropdown"
              value={
                isMultiple
                  ? "yes"
                  : "no"
              }
              onChange={(e) =>
                setIsMultiple(
                  e.target.value ===
                    "yes"
                )
              }
            >
              <option value="no">
                Tidak
              </option>
              <option value="yes">
                Iya
              </option>
            </select>
          </div>

          {isMultiple && (
            <>
              <div className="formGroup">
                <label>
                  Kolom berbeda?
                </label>

                <select
                  className="dropdown"
                  value={
                    isDifferent
                      ? "yes"
                      : "no"
                  }
                  onChange={(e) =>
                    setIsDifferent(
                      e.target.value ===
                        "yes"
                    )
                  }
                >
                  <option value="no">
                    Tidak
                  </option>
                  <option value="yes">
                    Iya
                  </option>
                </select>
              </div>

              <div className="formGroup">
                <label>
                  Banyak Kolom
                </label>

                <input
                  type="number"
                  value={
                    isDifferent
                      ? count
                      : dataLength
                  }
                  onChange={(e) =>
                    isDifferent
                      ? setCount(
                          Number(
                            e.target
                              .value
                          )
                        )
                      : setDataLength(
                          Number(
                            e.target
                              .value
                          )
                        )
                  }
                />
              </div>
            </>
          )}

          {inputs.map(
            (item, i) =>
              renderInput(
                item,
                [i]
              )
          )}

          {!isMultiple && (
            <div className="formGroup">
              <label>
                Arah Print
              </label>

              <select
                className="dropdown"
                value={direction}
                onChange={(e) =>
                  setDirection(
                    e.target.value
                  )
                }
              >
                <option value="row">
                  Row
                </option>
                <option value="column">
                  Column
                </option>
              </select>
            </div>
          )}

          <div className="formGroup">
            <label>
              Print Input?
            </label>

            <select
              className="dropdown"
              value={printInput}
              onChange={(e) =>
                setPrintInput(
                  e.target.value
                )
              }
            >
              <option value="yes">
                Ya
              </option>
              <option value="no">
                Tidak
              </option>
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
                direction:
                  isMultiple
                    ? null
                    : direction,
                isDifferent,
                count:
                  isMultiple &&
                  isDifferent
                    ? count
                    : null,
                dataLength:
                  isMultiple &&
                  !isDifferent
                    ? dataLength
                    : null,
              })
            }
          >
            Save
          </button>

          <button
            className="btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}