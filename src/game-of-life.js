import React, { useState, useEffect } from "react";

const DEFAULT_GENERATION_INTERVAL = 300;
const ROWS = 78;
const COLS = 151;

const Grid = ({ grid, setGrid }) => {
  return (
    <table>
      <tbody>
        {grid.map((row, i) => (
          <tr key={i}>
            {row.map((col, j) => (
              <td
                key={j}
                onClick={() => {
                  const newGrid = [...grid];
                  newGrid[i][j] = !newGrid[i][j];
                  setGrid(newGrid);
                }}
                style={{
                  backgroundColor: grid[i][j] ? "green" : "white",
                  border: "1px solid black",
                  width: 5,
                  height: 5
                }}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const GameOfLife = () => {
  const [grid, setGrid] = useState([]);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [generationInterval, setGenerationInverval] = useState(
    DEFAULT_GENERATION_INTERVAL
  );
  const [nextGenerationInterval, setNextGenerationInterval] = useState(
    DEFAULT_GENERATION_INTERVAL
  );
  const [error, setError] = useState("");
  const initializeGrid = () => {
    // Initialize the grid with random values
    const rows = ROWS;
    const cols = COLS;
    const newGrid = Array(rows)
      .fill()
      .map(() => Array(cols).fill());

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newGrid[i][j] = Math.random() > 0.7;
      }
    }
    return newGrid;
  };

  useEffect(() => {
    setGrid(initializeGrid());
  }, []);

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        setGeneration((prev) => prev + 1);
        // Create a new grid with the updated values
        const newGrid = grid.map((row, i) =>
          row.map((col, j) => {
            // Count the number of alive neighbors
            let aliveNeighbors = 0;
            for (let x = -1; x <= 1; x++) {
              for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) {
                  continue;
                }
                const rowIndex = i + x;
                const colIndex = j + y;
                if (
                  rowIndex >= 0 &&
                  rowIndex < grid.length &&
                  colIndex >= 0 &&
                  colIndex < row.length
                ) {
                  if (grid[rowIndex][colIndex]) {
                    aliveNeighbors++;
                  }
                }
              }
            }
            // Apply the rules of Conway's Game of Life
            if (grid[i][j] && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
              return true;
            } else if (!grid[i][j] && aliveNeighbors === 3) {
              return true;
            } else {
              return false;
            }
          })
        );
        setGrid(newGrid);
      }, nextGenerationInterval);
      return () => clearInterval(interval);
    }
  }, [running, grid, nextGenerationInterval]);

  const reset = () => {
    setRunning(false);
    setGrid([]);
    setGeneration(0);
    setGrid(initializeGrid());
    setError("");
  };

  const handleGenerationIntervalChange = (e) => {
    if (e.target.value === "") {
      setGenerationInverval(e.target.value);
    } else if (isFinite(e.target.value)) {
      const value = parseInt(e.target.value, 10);
      setGenerationInverval(value);
    }
    setError("");
  };

  const handleSetGenerationInterval = () => {
    if (generationInterval >= 20 && generationInterval <= 5000) {
      setNextGenerationInterval(generationInterval);
    } else {
      setError("Must be between 20 and 5000");
    }
  };

  return (
    <div>
      <Grid rows={25} cols={25} grid={grid} setGrid={setGrid} />
      <br />
      <button onClick={reset}>Reset</button>&nbsp;
      <button onClick={() => setRunning(!running)}>
        {running ? "Stop" : "Start"}
      </button>
      &nbsp;
      <span>Current generation: {generation + 1}</span>
      <br />
      <br />
      Interval (miliseconds):
      <input
        type="text"
        value={generationInterval}
        onChange={handleGenerationIntervalChange}
      />
      &nbsp;
      <button onClick={handleSetGenerationInterval}>Set</button>
      <br />
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default GameOfLife;
