import React, { useState } from "react";
//creating block
const Block = ({ block, onAddChild, onDrag }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: block.x,
        top: block.y,
        width: "100px",
        height: "100px",
        backgroundColor: "rgba(60, 135,247, 1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        borderRadius: "10px",
        cursor: "move",
        border: "2px solid black",
        zIndex: 1,
      }}
      onMouseDown={(e) => onDrag(e, block.id)}
    >
      <span style={{ fontSize: "20px", fontWeight: "bold", color: "black" }}>
        {block.id}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddChild(block.id);
        }}
        style={{
          backgroundColor: "white",
          border: "none",
          padding: "5px 10px",
          cursor: "pointer",
          borderRadius: "5px",
          marginTop: "5px",
        }}
      >
        +
      </button>
    </div>
  );
};

function App() {
  const centerX = window.innerWidth / 2 - 50;
  const centerY = window.innerHeight / 2 - 50;
  const [blocks, setBlocks] = useState([
    { id: 0, x: centerX, y: centerY, parent: null },
  ]);
  const addBlock = (parentId) => {
    const newBlock = {
      id: blocks.length,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
      parent: parentId,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };
  const dragBlock = (e, id) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const targetBlock = blocks.find((b) => b.id === id);
    const initialX = targetBlock.x;
    const initialY = targetBlock.y;
    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === id
            ? { ...block, x: initialX + dx, y: initialY + dy }
            : block
        )
      );
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const renderConnections = () => {
    return blocks.map((block) => {
      if (block.parent === null) return null;
      const parentBlock = blocks.find((b) => b.id === block.parent);
      if (!parentBlock) return null;
      const parentCenterX = parentBlock.x + 50;
      const parentCenterY = parentBlock.y + 50;
      const childCenterX = block.x + 50;
      const childCenterY = block.y + 50;
      const midX = childCenterX;
      const midY = parentCenterY;
      const horizontalLength = Math.abs(midX - parentCenterX);
      const verticalLength = Math.abs(childCenterY - midY);
      return (
        <React.Fragment key={`line-${block.id}`}>
          <div
            style={{
              position: "absolute",
              left: Math.min(parentCenterX, midX),
              top: midY,
              width: horizontalLength,
              height: "2px",
              borderTop: "2px dashed black",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: midX,
              top: Math.min(midY, childCenterY),
              width: "2px",
              height: verticalLength,
              borderLeft: "2px dashed black",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <div>Prepared by: Shakil Ahmed (ahmedshakil.aiub@gmail.com)</div>
      {renderConnections()}
      {blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          onAddChild={addBlock}
          onDrag={dragBlock}
        />
      ))}
    </div>
  );
}

export default App;
