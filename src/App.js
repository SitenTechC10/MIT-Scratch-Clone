import React from "react";
import { EventBody } from "./Components/eventBody";
import { useState } from "react";

import { DragDropContext } from "react-beautiful-dnd";
import { MOVES } from "./constants";

export default function App() {
  const [moves, setMoves] = useState(MOVES);
  const [actions, setActions] = useState([]);
  const [actions2, setActions2] = useState([]);

  const onHandleDragEnd = (result) => {
    const { source, destination } = result;
    console.log(source, destination);
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    let add,
      active = moves,
      complete = actions,
      complete2 = actions2;

    add = active[source.index];

    if (destination.droppableId === "MovesActions") {
      complete.push(add);
    } else {
      complete2.push(add);
    }
    setActions2(complete2);
    setActions(complete);
    setMoves(active);
  };

  return (
    <div className="bg-blue-100 font-sans text-center">
      <DragDropContext onDragEnd={onHandleDragEnd}>
        <EventBody
          moves={moves}
          setMoves={setMoves}
          actions={actions}
          actions2={actions2}
          setActions2={setActions2}
          setActions={setActions}
        />
      </DragDropContext>
    </div>
  );
}
