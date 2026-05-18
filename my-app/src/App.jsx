import { useState } from "react";
import InputSection from "./InputSection/InputSection";
import InputModal from "./ModalPage/InputModal";

import { generateInteger } from "./generator/IntegerGenerator";
import { generateString } from "./generator/StringGenerator";
import { generateFloat } from "./generator/FloatGenerator";

import "./App.css";
import "./ModalPage/InputModal.css";

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState("");
  
  const [inputs, setInputs] = useState([
    { config: null, printInput: false, slotCount: "" },
  ]);
  const [activeIndex, setActiveIndex] = useState(null);

  /* ========================================================
      ROUTER JALUR DIREKTORI KE GENERATOR ASLI
     ======================================================== */
  const runGeneratorByType = (type, config, slotCount) => {
    if (type === "int") return generateInteger(config, slotCount);
    if (type === "float") return generateFloat(config, slotCount);
    if (type === "string") return generateString(config, slotCount);
    return "";
  };

  /* ========================================================
      1. FUNGSI REKURSIF: GENERATE DATA MENTAH KE ARRAY OBJEK (TREE)
     ======================================================== */
  const generateRawTree = (node, globalConfig) => {
    const localConfig = {
      ...globalConfig,
      inputs: [node],
      count: null,         
      isDifferent: false
    };

    const currentValue = runGeneratorByType(node.type, localConfig, 1).trim();
    const iterations = [];

    if (node.isNested && node.children && node.children.length > 0) {
      const childLoops = Number(currentValue) || 1;

      for (let i = 0; i < childLoops; i++) {
        const childOutputs = node.children.map((childNode) => 
          generateRawTree(childNode, globalConfig)
        );
        iterations.push(childOutputs);
      }
    }

    return {
      value: currentValue,
      iterations: iterations,
      printDigitCount: node.type === "int" && !!node.range?.printDigitCount,
      digitCount: node.range?.digit ? String(node.range.digit) : String(currentValue.replace('-', '').length)
    };
  };

  /* ========================================================
      2. FUNGSI FORMATTER: MENGUBAH ARRAY OBJEK MENJADI STRING TEXT
     ======================================================== */
  const formatTreeToString = (treeNode, globalDirection, shouldPrintInput, currentNestedFormat = "masing-masing") => {
    if (!treeNode) return "";

    let baseValue = treeNode.value;
    if (treeNode.printDigitCount) {
      const separator = globalDirection === "column" ? " " : "\n";
      baseValue = `${treeNode.digitCount}${separator}${treeNode.value}`;
    }

    if (!treeNode.iterations || treeNode.iterations.length === 0) {
      return baseValue;
    }

    // Penanganan "input-terlebih-dahulu" untuk pohon bersarang dalam (3-level)
    if (currentNestedFormat === "input-terlebih-dahulu") {
      const hasControlChildren = treeNode.iterations.some((iteration) =>
        iteration.some((childNode) => childNode.iterations && childNode.iterations.length > 0)
      );

      if (hasControlChildren) {
        const childControlValues = [];
        const childBodies = [];

        treeNode.iterations.forEach((iteration) => {
          iteration.forEach((childNode) => {
            if (childNode.iterations && childNode.iterations.length > 0) {
              let childBaseValue = childNode.value;
              if (childNode.printDigitCount) {
                const separator = globalDirection === "column" ? " " : "\n";
                childBaseValue = `${childNode.digitCount}${separator}${childNode.value}`;
              }
              childControlValues.push(childBaseValue);

              const leafValues = [];
              childNode.iterations.forEach((leafIter) => {
                leafIter.forEach((leafNode) => {
                  leafValues.push(formatTreeToString(leafNode, globalDirection, false, "masing-masing"));
                });
              });
              
              if (globalDirection === "column") {
                childBodies.push(leafValues.join(" "));
              } else {
                childBodies.push(leafValues.join("\n"));
              }
            } else {
              childBodies.push(formatTreeToString(childNode, globalDirection, false, "masing-masing"));
            }
          });
        });

        let resultLines = [];
        if (shouldPrintInput) resultLines.push(baseValue);
        if (childControlValues.length > 0) resultLines.push(childControlValues.join(" "));
        if (childBodies.length > 0) resultLines.push(childBodies.join("\n"));
        
        return resultLines.join("\n");
      }
    }

    // DEFAULT MODE: "MASING-MASING"
    const formattedIterations = treeNode.iterations.map((iteration) => {
      const childStrings = iteration.map((child) => 
        formatTreeToString(child, globalDirection, shouldPrintInput, currentNestedFormat)
      );
      
      if (globalDirection === "column") {
        return childStrings.filter(Boolean).join(" ");
      } else {
        const hasNestedChild = iteration.some(child => child.iterations && child.iterations.length > 0);
        return hasNestedChild ? childStrings.filter(Boolean).join("\n") : childStrings.filter(Boolean).join(" ");
      }
    });

    const hasNestedChildrenInside = treeNode.iterations.some((iteration) =>
      iteration.some((child) => child.iterations && child.iterations.length > 0)
    );

    let childrenString;
    if (globalDirection === "column" && !hasNestedChildrenInside) {
      childrenString = formattedIterations.filter(Boolean).join(" ");
    } else {
      childrenString = formattedIterations.filter(Boolean).join("\n");
    }

    if (shouldPrintInput) {
      return `${baseValue}\n${childrenString}`.trim();
    } else {
      return childrenString.trim();
    }
  };

  /* ========================================================
      3. LOGIKA UTAMA TOMBOL GENERATE
     ======================================================== */
  const handleGenerate = () => {
    let finalResult = [];

    inputs.forEach((item) => {
      if (!item || !item.config || !item.config.inputs || item.config.inputs.length === 0) return;

      const config = item.config;
      const slotCountValue = item.slotCount ? Number(item.slotCount) : 1;
      const loops = slotCountValue > 0 ? slotCountValue : 1;
      const currentFormat = config.printFormat || "masing-masing";
      const isColumnLayout = config.direction === "column"; 
      
      const shouldPrintModalInput = config.printInput === "yes";
      const currentNestedFormat = config.nestedFormat || "masing-masing";

      // --------------------------------------------------
      // JALUR A: KONDISI JIKA CONFIG ADALAH ARRAY 2D
      // --------------------------------------------------
      if (config.count && config.count > 0) {
        let arrayChunk = [];
        const totalKolomModal = config.count;
        
        for (let r = 0; r < loops; r++) {
          if (config.isDifferent) {
            const colOutputs = config.inputs.map((node) => {
              if (!node) return "";
              let val = runGeneratorByType(node.type, { ...config, inputs: [node] }, 1).trim();
              
              if (node.type === "int" && node.range?.printDigitCount) {
                const digitCount = node.range.digit ? String(node.range.digit) : String(val.replace('-', '').length);
                val = `${digitCount} ${val}`;
              }
              return val;
            });
            arrayChunk.push(colOutputs.join(" "));
          } else {
            const firstNode = config.inputs?.[0];
            if (!firstNode) continue;
            let rowOutput = runGeneratorByType(firstNode.type, { ...config, inputs: [firstNode] }, config.count);
            
            if (firstNode.type === "int" && firstNode.range?.printDigitCount) {
              const tokens = rowOutput.trim().split(/\s+/);
              const mappedTokens = tokens.map(val => {
                if (!val) return "";
                const digitCount = firstNode.range.digit ? String(firstNode.range.digit) : String(val.replace('-', '').length);
                return `${digitCount} ${val}`;
              });
              rowOutput = mappedTokens.join(" ");
            }
            arrayChunk.push(rowOutput);
          }
        }

        let chunkResultString = isColumnLayout ? arrayChunk.join(" ") : arrayChunk.join("\n");

        if (shouldPrintModalInput) {
          chunkResultString = `${totalKolomModal}\n${chunkResultString}`.trim();
        }

        if (item.printInput && currentFormat === "input-hasil") {
          if (isColumnLayout) {
            finalResult.push(`${slotCountValue} ${chunkResultString}`.trim());
          } else {
            finalResult.push(`${slotCountValue}\n${chunkResultString}`.trim());
          }
        } else {
          if (item.printInput) {
            finalResult.push(String(slotCountValue));
          }
          finalResult.push(chunkResultString);
        }
      } 
      
      // --------------------------------------------------
      // JALUR B: SINGLE / NESTED INPUT (NON-ARRAY 2D)
      // --------------------------------------------------
      else {
        const firstNode = config.inputs?.[0];
        if (!firstNode) return;

        let rawTreeOutputs = [];
        for (let loop = 0; loop < loops; loop++) {
          rawTreeOutputs.push(generateRawTree(firstNode, config));
        }

        const isNestedInput = firstNode.isNested === true;

        const hasControlChildren = rawTreeOutputs[0]?.iterations?.some((iteration) =>
          iteration.some((childNode) => childNode.iterations && childNode.iterations.length > 0)
        );

        // --- MODIFIKASI UTAMA JALUR B NESTED UNTUK INPUT-TERLEBIH-DAHULU ---
        if (currentNestedFormat === "input-terlebih-dahulu" && isNestedInput) {
          
          const rootValues = rawTreeOutputs.map(tree => {
            if (tree.printDigitCount) {
              const separator = config.direction === "column" ? " " : "\n";
              return `${tree.digitCount}${separator}${tree.value}`;
            }
            return tree.value;
          });

          if (!hasControlChildren) {
            // JALUR B1: Hanya 1 Level Perulangan Bersarang
            const bodies = rawTreeOutputs.map(treeData => 
              formatTreeToString(treeData, config.direction || "row", false, "masing-masing")
            );

            if (item.printInput) finalResult.push(String(slotCountValue));
            if (shouldPrintModalInput) finalResult.push(rootValues.join(" "));
            if (bodies.length > 0) finalResult.push(bodies.filter(Boolean).join("\n"));
          
          } else {
            // JALUR B2: BARU! Mendukung 2 Level Perulangan Bersarang (hasControlChildren === true)
            let allChildControlLines = [];
            let allBodies = [];

            rawTreeOutputs.forEach((tree) => {
              let slotChildControls = [];
              tree.iterations.forEach((iteration) => {
                iteration.forEach((childNode) => {
                  if (childNode.iterations && childNode.iterations.length > 0) {
                    let childBaseValue = childNode.value;
                    if (childNode.printDigitCount) {
                      const separator = config.direction === "column" ? " " : "\n";
                      childBaseValue = `${childNode.digitCount}${separator}${childNode.value}`;
                    }
                    slotChildControls.push(childBaseValue);

                    // Ambil data leaf terdalam
                    const leafValues = [];
                    childNode.iterations.forEach((leafIter) => {
                      leafIter.forEach((leafNode) => {
                        leafValues.push(formatTreeToString(leafNode, config.direction || "row", false, "masing-masing"));
                      });
                    });

                    if (config.direction === "column") {
                      allBodies.push(leafValues.join(" "));
                    } else {
                      allBodies.push(leafValues.join("\n"));
                    }
                  } else {
                    allBodies.push(formatTreeToString(childNode, config.direction || "row", false, "masing-masing"));
                  }
                });
              });
              if (slotChildControls.length > 0) {
                allChildControlLines.push(slotChildControls.join(" "));
              }
            });

            if (item.printInput) finalResult.push(String(slotCountValue));
            if (shouldPrintModalInput) finalResult.push(rootValues.join(" "));
            if (allChildControlLines.length > 0) finalResult.push(allChildControlLines.join(" "));
            if (allBodies.length > 0) finalResult.push(allBodies.filter(Boolean).join("\n"));
          }
        } 
        
        else {
          // JALUR DEFAULT (MASING-MASING MODE / NON-NESTED)
          const stringOutputsArray = rawTreeOutputs.map((treeData) => 
            formatTreeToString(treeData, config.direction || "row", shouldPrintModalInput, currentNestedFormat)
          );

          if (item.printInput && currentFormat === "input-hasil") {
            if (isColumnLayout) {
              finalResult.push(`${slotCountValue} ${stringOutputsArray.join(" ")}`.trim());
            } else {
              let firstLine = `${slotCountValue}\n${stringOutputsArray[0]}`;
              let remainingLines = stringOutputsArray.slice(1);
              finalResult.push([firstLine, ...remainingLines].join("\n"));
            }
          } else {
            if (item.printInput) {
              finalResult.push(String(slotCountValue));
            }

            if (isColumnLayout && !isNestedInput) {
              finalResult.push(stringOutputsArray.join(" "));
            } else {
              finalResult.push(stringOutputsArray.join("\n"));
            }
          }
        }
      }
    });

    setGeneratedOutput(finalResult.filter(Boolean).join("\n"));
  };

  /* ========================================================
      STATE MANAGEMENT & UTILITIES HANDLERS
     ======================================================== */
  const handleCreate = () => {
    setInputs((prev) => [...prev, { config: null, printInput: false, slotCount: "" }]);
  };

  const handleOpenModal = (index) => {
    setActiveIndex(index);
    setShowModal(true);
  };

  const handleSave = (data) => {
    setInputs((prev) => {
      const updated = [...prev];
      updated[activeIndex] = {
        ...updated[activeIndex],
        config: { ...data }
      };
      return updated;
    });
    setShowModal(false);
    setActiveIndex(null);
  };

  const handleDelete = (index) => {
    setInputs((prev) => prev.filter((_, i) => i !== index));
    if (activeIndex === index) {
      setActiveIndex(null);
      setShowModal(false);
    }
  };

  const handleTogglePrint = (index, value) => {
    setInputs((prev) => {
      const updated = [...prev];
      updated[index].printInput = value;
      return updated;
    });
  };

  const handleSlotChange = (index, value) => {
    setInputs((prev) => {
      const updated = [...prev];
      updated[index].slotCount = value;
      return updated;
    });
  };

  const handleReset = () => {
    setShowModal(false);
    setActiveIndex(null);
    setGeneratedOutput("");
    setInputs([{ config: null, printInput: false, slotCount: "" }]);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedOutput], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hasil_test_case.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Generator Kasus Uji</h1>

        <InputSection
          inputs={inputs}
          onOpenModal={handleOpenModal}
          onDelete={handleDelete}
          onTogglePrint={handleTogglePrint}
          onSlotChange={handleSlotChange}
        />

        <div className="bottom-section">
          <button className="btn primary" onClick={handleCreate}>Tambahkan Masukan Baru</button>
          <button className="btn success" onClick={handleGenerate}>Generate</button>
          <button className="btn danger" onClick={handleReset}>Reset</button>
          <button className="btn secondary" onClick={handleDownload} disabled={!generatedOutput}>Download</button>
        </div>

        <div className="output-section">
          <h3>Hasil Generate</h3>
          <textarea value={generatedOutput} readOnly placeholder="Hasil generate akan muncul di sini..." />
        </div>
      </div>

      {showModal && activeIndex !== null && inputs[activeIndex] && (
        <InputModal
          onClose={() => {
            setShowModal(false);
            setActiveIndex(null);
          }}
          onCreate={handleSave}
          initialData={inputs[activeIndex]?.config}
        />
      )}
    </div>
  );
}