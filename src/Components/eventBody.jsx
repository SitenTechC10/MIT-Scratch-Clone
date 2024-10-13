import * as React from "react";
import { SingleAction } from "./singleAction";
import { Droppable } from "react-beautiful-dnd";
import { Box, Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Sprites } from "./spriteProps";

import Draggable1 from "react-draggable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WARN_MSG_POS, WARN_MSG_SIZE } from "../constants";

import CatSprite from "../Assets/images/cat2.svg";
import JerrySprite from "../Assets/images/cat1.svg";
import Positions from "./position";
import { yellow } from "@mui/material/colors";

export const EventBody = (props) => {
  const { moves, setMoves, actions, setActions, setActions2, actions2 } = props;

  const ref = React.useRef();
  const ref2 = React.useRef();

  let r = -100; 
  let t = 0;
  let scale = 1;
  let angle = 0;

  let r2 = 200;
  let t2 = 0;
  let scale2 = 1;
  let angle2 = 0;

  const [displayAddIcon, setDisplayAddIcon] = React.useState(true);
  const [sprite, setSprite] = React.useState(CatSprite);
  const [sprite2, setSprite2] = React.useState(null);
  const [sprites, setSprites] = React.useState([]);

  const handleButtonClick = () => {
    const newSprite = {
      id: sprites.length,
      ref: React.createRef(),
      sprite: CatSprite,
      x: -100,
      y: 0,
      scale: 1,
      angle: 0,
    };
    setSprites([...sprites, newSprite]);
  };
  

  const checkCollision = () => {
    const sprite1Rect = ref.current.getBoundingClientRect();
    const sprite2Rect = ref2.current.getBoundingClientRect();

    return !(
      sprite1Rect.right < sprite2Rect.left ||
      sprite1Rect.left > sprite2Rect.right ||
      sprite1Rect.bottom < sprite2Rect.top ||
      sprite1Rect.top > sprite2Rect.bottom
    );
  };

  const handleCollision = () => {
    if (checkCollision()) {
    
      const tempActions = [...actions];
      setActions([...actions2]);
      setActions2(tempActions);

      toast.info("Sprites collided! Swapping actions.", {
        position: "top-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  function transform(x, y, action1) {
    if (action1) {
      r = x;
      t = y;
      ref.current.style.transform = `translate(${r || 0}px, ${
        t || 0
      }px) scale(${scale}) rotate(${angle}deg)`;
    } else {
      r2 = x;
      t2 = y;
      ref2.current.style.transform = `translate(${r2 || 0}px, ${
        t2 || 0
      }px) scale(${scale2}) rotate(${angle2}deg)`;
    }

    if (!displayAddIcon && ref.current && ref2.current) {
      handleCollision();
    }
  }

  function moveRight(i, action1) {
    setTimeout(() => {
      if (action1) {
        r += 10;
        if (r > 580) {
          refresh(WARN_MSG_POS);
          return;
        }
      } else {
        r2 += 10;
        if (r2 > 580) {
          refresh(WARN_MSG_POS);
          return;
        }
      }
      transform(action1 ? r : r2, action1 ? t : t2, action1);
    }, i * 1500);
  }

  function moveLeft(i, action1) {
    setTimeout(() => {
      if (action1) {
        r -= 10;
        if (r < -580) {
          refresh(WARN_MSG_POS);
          return;
        }
      } else {
        r2 -= 10;
        if (r2 < -580) {
          refresh(WARN_MSG_POS);
          return;
        }
      }
      transform(action1 ? r : r2, action1 ? t : t2, action1);
    }, i * 1500);
  }

  function rotateSprite(rAngle, i, action1) {
    console.log(rAngle);
    setTimeout(() => {
      if (action1) {
        angle += rAngle;
        console.log(rAngle);
      } else {
        angle2 += rAngle;
      }
      transform(action1 ? r : r2, action1 ? t : t2, action1);
    }, i * 1500);
  }

  function moveXY(xInput, yInput, random, i, action1) {
    r = typeof r === "undefined" ? "0%" : r.toString();
    r2 = typeof r2 === "undefined" ? "0%" : r2.toString();
    t = typeof t === "undefined" ? "0%" : t.toString();
    t2 = typeof t2 === "undefined" ? "0%" : t2.toString();
    
    setTimeout(() => {
      let tempR = parseInt(action1 ? r.slice(0, -1) : r2.slice(0, -1));
      let tempT = parseInt(action1 ? t.slice(0, -1) : t2.slice(0, -1));
      
      tempR =
        tempR !== parseInt(xInput) && parseInt(xInput) !== 0
          ? random
            ? Math.floor(Math.random() * (-290 - 290) + 290)
            : parseInt(xInput)
          : tempR;
      tempT =
        tempT !== -parseInt(yInput) && parseInt(yInput) !== 0
          ? random
            ? Math.floor(Math.random() * (-140 - 140) + 140)
            : -parseInt(yInput)
          : tempT;
      if (parseInt(yInput) == 0) {
        tempT = 0;
      }
      if (parseInt(xInput) == 0) {
        tempR = 0;
      }

      if (tempR < -290 || tempR > 290 || tempT < -140 || tempT > 140) {
        refresh(WARN_MSG_POS);
        return;
      }
      let valueR = tempR.toString();
      let valueT = tempT.toString();

      if (action1) {
        r = valueR.concat("%");
        t = valueT.concat("%");
      } else {
        r2 = valueR.concat("%");
        t2 = valueT.concat("%");
      }
  
      action1
        ? (ref.current.style.transform = `scale(${scale})translate(${r}, ${t}) rotate(${angle}deg)`)
        : (ref2.current.style.transform = `scale(${scale2})translate(${r2}, ${t2}) rotate(${angle2}deg)`);
    }, i * 1500);
  }

  const startActions = (action, idx, action1) => {
    switch (action) {
      case "move x by 10": {
        moveRight(idx, action1);
        break;
      }

      case "move x by -10": {
        moveLeft(idx, action1);
        break;
      }

      case "turn 20": {
        rotateSprite(20, idx, action1);
        break;
      }
      case "random position": {
        moveXY(1, 1, true, idx, action1);
        break;
      }

      case "repeat": {
        setTimeout(() => {
          if (action1) {
            runAction1();
          } else {
            runAction2();
          }
        }, idx * 1500);
        break;
      }
      default:
        break;
    }
  };

  function clearTimeouts() {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  const refresh = (msg) => {
    r = -100;
    t = 0;
    r2 = 200;
    t2 = 0;
    scale2 = 1;
    angle2 = 0;
    scale = 1;
    angle = 0;
    clearTimeouts();

    if (msg) {
      toast.warn(msg, {
        position: "top-center",
        autoClose: 2000,
        borderRadius: "20px",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    if (ref.current) {
      ref.current.style.transform = `translate(${r}px, ${t}px) scale(${scale}) rotate(${angle}deg)`;
    }
    if (ref2.current) {
      ref2.current.style.transform = `translate(${r2}px, ${t2}px) scale(${scale2}) rotate(${angle2}deg)`;
    }
  };

  function runAction1() {
    actions &&
      actions.forEach((item, i) => {
        console.log(item);
        startActions(item.todo, i, true);
      });
  }

  function runAction2() {
    if (!displayAddIcon && actions2.length) {
      actions2.forEach((item, i) => {
        startActions(item.todo, i, false);
      });
    }
  }

  return (
    <div className="mainContainer">
      <ToastContainer />
      <div className="container">
        <Droppable droppableId="MovesList">
          {(provided) => (
            <div
              className="moves"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="moves__heading">Motions</div>
              {console.log(moves)}
              {moves?.map((move, index) => (
                <SingleAction
                  disableDelete={true}
                  index={index}
                  moves={moves}
                  move={move}
                  key={move.id}
                  setMoves={setMoves}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="MovesActions">
          {(provided) => (
            <div
              className="moves actions"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <span className="moves__heading">Action 1</span>
              {actions?.map((move, index) => (
                <SingleAction
                  index={index}
                  moves={actions}
                  move={move}
                  key={move.id}
                  refresh={refresh}
                  setMoves={setActions}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {displayAddIcon && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="icon">
              <button
              style={{border:"1px solid gray",borderRadius:"7px", background:"#00BFFF"}}
                sx={{ color: "gray", cursor: "pointer" }}
                onClick={() => {
                  setDisplayAddIcon(false);
                  setSprite2(JerrySprite);
                  refresh();
                }}
              >&nbsp;<b style={{color:"white"}}>+Actions</b>&nbsp;&nbsp;</button>
              <span className="tooltiptext">add sprite</span>
            </div>
            <br/>
            <div>
              <DeleteIcon
                onClick={() => {
                  setActions([]);
                }}
                sx={{ cursor: "pointer", fontSize: "30px", color: "Grey" }}
              />
            </div>
          </div>
        )}
        {!displayAddIcon && (
          <Droppable droppableId="MovesActions2">
            {(provided) => (
              <div
                className="moves actions"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span className="moves__heading">Action 2</span>
                {actions2?.map((move, index) => (
                  <SingleAction
                    index={index}
                    moves={actions2}
                    move={move}
                    key={move.id}
                    refresh={refresh}
                    setMoves={setActions2}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
        {!displayAddIcon && (
          <div className="icon">
            <DisabledByDefaultIcon
              sx={{ color: "gray", cursor: "pointer" }}
              onClick={() => {
                setDisplayAddIcon(true);
                setSprite2(null);
                refresh();
              }}
            />
            <div>
              <DeleteIcon
                onClick={() => {
                  setActions([]);
                  setActions2([]);
                }}
                sx={{ cursor: "pointer", fontSize: "30px", color: "Grey" }}
              />
            </div>
          </div>
        )}

        <div className="moves play" style={{}}>
          <div style={{ display: "flex", flexDirection: "row" }}>
          
          {sprites.map((spriteObj, index) => (
        <Draggable1
          key={spriteObj.id}
          bounds={{ left: -800, top: -400, right: 800, bottom: 400 }}
        >
          <div
            ref={spriteObj.ref}
            style={{
              position: "relative",
              transform: `translate(${spriteObj.x}px, ${spriteObj.y}px) scale(${spriteObj.scale}) rotate(${spriteObj.angle}deg)`,
              transition: "1s all ease",
            }}
          >
            <img
              src={spriteObj.sprite}
              draggable="false"
              alt={`sprite-${index}`}
              style={{
                cursor: "pointer",
                height: "auto",
                width: "auto",
                maxHeight: "100px",
                maxWidth: "100px",
                objectFit: "contain",
                transition: "1s all ease",
              }}
            />
          </div>
        </Draggable1>
      ))}

            <Draggable1
              bounds={{ left: -800, top: -400, right: 800, bottom: 400 }}
            >
              <div
                ref={ref}
                style={{
                  position: "relative",
                  transition: "1s all ease",
                }}
              >
                <img
                  src={sprite}
                  draggable="false"
                  alt="sprite"
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    height: "auto",
                    width: "auto",
                    maxHeight: "100px",
                    maxWidth: "100px",
                    objectFit: "contain",
                    transition: "1s all ease",
                  }}
                />
              </div>
            </Draggable1>
            {!displayAddIcon && (
              <Draggable1
                bounds={{ left: -800, top: -400, right: 800, bottom: 400 }}
              >
                <div
                  ref={ref2}
                  style={{
                    position: "relative",
                    transition: "1s all ease",
                  }}
                >
                  <img
                    src={sprite2}
                    draggable="false"
                    alt="sprite2"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      height: "auto",
                      width: "auto",
                      maxHeight: "100px",
                      maxWidth: "100px",
                      objectFit: "contain",
                      transition: "1s all ease",
                    }}
                  />
                </div>
              </Draggable1>
            )}
          </div>
        </div>
      </div>

      <div className="gameProps">
        <Sprites
          setSprite={setSprite}
          setSprite2={setSprite2}
          displayAddIcon={displayAddIcon}
          sprite2={sprite2}
          sprite={sprite}
        />

        <div className="playRefresh">
          <Button
            variant="contained"
            sx={{
              borderRadius: "20px",
              marginRight: "5px",
              height: "40px",
              width: "80px",
            }}
            color="success"
            onClick={() => {
              runAction1();
              runAction2();
            }}
          >
            <PlayArrowIcon />
          </Button>
          <Button
            variant="contained"
            sx={{ borderRadius: "20px", height: "40px", width: "80px" }}
            color="error"
            onClick={refresh}
          >
            <RefreshIcon sx={{ color: "white" }} />
          </Button>

          <Button
            variant="contained"
            onClick={handleButtonClick}
            sx={{ marginBottom: '20px', background: '#00BFFF' }}
            style={{borderRadius:'20px', height: "40px", width: "80px"}}
          >
            +Sprite
          </Button>

        </div>
        <Positions handleMove={moveXY} refresh={refresh} />
      </div>
    </div>
  );
};

export default EventBody;
