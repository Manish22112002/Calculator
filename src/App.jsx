import React, { useEffect, useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(0);
  const [memory, setMemory] = useState([]);
  const [history, setHistory] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
    const savedMemory = JSON.parse(localStorage.getItem("calcMemory")) || [];
    setHistory(savedHistory);
    setMemory(savedMemory);
  }, []);

  useEffect(() => {
    localStorage.setItem("calcHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("calcMemory", JSON.stringify(memory));
  }, [memory]);

  const handleButtonClick = (value) => {
    if (value === "C") {
      setInput("");
      setResult(0);
    } else if (value === "CE") {
      const match = input.match(/(.*?)([+\-×÷]?)(\d+)?$/);
      if (match) {
        setInput(match[1] + match[2]);
      }
    } else if (value === "←") {
      setInput(input.slice(0, -1));
    } else if (value === "=") {
      try {
        const evalResult = eval(input.replace(/×/g, "*").replace(/÷/g, "/"));

        const isValidExpression =
          /^[\d\.\-+\*/÷]+$/.test(input) &&
          /[+\-×÷]/.test(input) &&
          /\d/.test(input);

        if (input && isValidExpression) {
          setResult(evalResult);
          setInput(evalResult.toString());

          setHistory([...history, { query: input, result: evalResult }]);
        } else {
          setInput(evalResult.toString());
        }
      } catch (error) {
        setInput("Error");
      }
    } else if (["+", "-", "×", "÷"].includes(value)) {
      const operator = value === "×" ? "*" : value === "÷" ? "/" : value;
      setInput(input + operator);
    } else {
      setInput(input + value);
    }
  };

  const handleMemory = (type) => {
    if (type === "MC") setMemory([]);
    if (type === "MR" && memory.length > 0)
      setInput(input + memory[memory.length - 1]);
    if (type === "M+")
      setMemory([...memory, (memory[memory.length - 1] || 0) + (result || 0)]);
    if (type === "M-")
      setMemory([...memory, (memory[memory.length - 1] || 0) - (result || 0)]);
    if (type === "MS") setMemory([...memory, result || 0]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calcHistory");
  };

  const clearMemory = () => {
    setMemory([]);
    localStorage.removeItem("calcMemory");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-80 relative">
        <div className="flex justify-between items-center p-4 border-b h-28">
          <button className="text-xl" onClick={() => setShowPanel(!showPanel)}>
            <span className="block w-6 h-1 bg-black mb-1"></span>
            <span className="block w-6 h-1 bg-black mb-1"></span>
            <span className="block w-6 h-1 bg-black"></span>
          </button>
          <div className="text-3xl font-light">{input || result}</div>
        </div>

        <div className="grid grid-cols-4 gap-2 p-4 pb-0 text-center text-sm font-medium">
          <button
            className="bg-gray-100 py-2 "
            onClick={() => handleMemory("MC")}
          >
            MC
          </button>
          <span></span>
          <span></span>
          <span></span>

          <button
            className="bg-gray-100 py-2"
            onClick={() => handleMemory("MR")}
          >
            MR
          </button>
          <button
            className="bg-gray-100 py-2"
            onClick={() => handleMemory("M+")}
          >
            M+
          </button>
          <button
            className="bg-gray-100 py-2"
            onClick={() => handleMemory("M-")}
          >
            M-
          </button>
          <button
            className="bg-gray-100 py-2"
            onClick={() => handleMemory("MS")}
          >
            MS
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 p-4">
          {["CE", "C", "←", "÷"].map((btn) => (
            <button
              key={btn}
              className="bg-gray-200 py-3 rounded"
              onClick={() => handleButtonClick(btn)}
            >
              {btn}
            </button>
          ))}

          {[7, 8, 9, "×", 4, 5, 6, "-", 1, 2, 3, "+"].map((btn) => (
            <button
              key={btn}
              className="bg-gray-100 py-3 rounded"
              onClick={() => handleButtonClick(btn.toString())}
            >
              {btn}
            </button>
          ))}

          <button
            className="col-span-2 bg-gray-100 py-3 rounded"
            onClick={() => handleButtonClick("0")}
          >
            0
          </button>
          <button
            className="bg-gray-100 py-3 rounded"
            onClick={() => handleButtonClick(".")}
          >
            .
          </button>
          <button
            className="bg-blue-500 text-white py-3 rounded"
            onClick={() => handleButtonClick("=")}
          >
            =
          </button>
        </div>

        {showPanel && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-50 p-4 shadow-md z-10">
            <div className="flex justify-between mb-4">
              <button
                className={`px-4 py-2 ${
                  activeTab === "history"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setActiveTab("history")}
              >
                History
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "memory"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setActiveTab("memory")}
              >
                Memory
              </button>
            </div>

            {activeTab === "history" && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">History</h2>
                  <button
                    className="text-sm text-red-500"
                    onClick={clearHistory}
                  >
                    Clear All
                  </button>
                </div>
                <div className="overflow-y-auto h-64 border rounded p-2">
                  {history.length > 0 ? (
                    history.map((entry, index) => (
                      <div
                        key={index}
                        className="p-2 border-b last:border-none text-sm"
                      >
                        <p className="text-gray-600">{entry.query}</p>
                        <p className="font-medium">{entry.result}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No history available.
                    </p>
                  )}
                </div>
              </>
            )}

            {activeTab === "memory" && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Memory</h2>
                  <button
                    className="text-sm text-red-500"
                    onClick={clearMemory}
                  >
                    Clear All
                  </button>
                </div>
                <div className="overflow-y-auto h-64 border rounded p-2">
                  {memory.length > 0 ? (
                    memory.map((value, index) => (
                      <div
                        key={index}
                        className="p-2 border-b last:border-none text-sm"
                      >
                        <p className="font-medium">{value}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No memory available.
                    </p>
                  )}
                </div>
              </>
            )}

            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded w-full"
              onClick={() => setShowPanel(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
