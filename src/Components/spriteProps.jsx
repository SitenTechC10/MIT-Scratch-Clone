import React, { useState } from "react";
import "./styles.css";
import { Box } from "@mui/material";
import cat2 from "../Assets/images/cat2.svg";
import cat1 from "../Assets/images/cat1.svg";

export const Sprites = (props) => {
  const { displayAddIcon } = props;

  const [sprites, setSprites] = useState([
    { id: 1, img: cat1 },
  ]);

  const handleClick = (id) => {
    const updatedSprites = sprites.map((sprite) => {
      if (sprite.id === id) {
        const newCat = sprite.img === cat1 ? cat2 : cat1; 
        return { ...sprite, img: newCat };
      }
      return sprite;
    });
    setSprites(updatedSprites);
  };


  const addNewSprite = () => {
    const newId = sprites.length + 1;
    setSprites([...sprites, { id: newId, img: cat1 }]);
  };

  return (
    <Box
      sx={{
        marginLeft: "5%",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "row",
        columnGap: "10px",
        flexWrap: "wrap",
      }}
    >

      {sprites.map((sprite) => (
        <Box
          key={sprite.id}
          sx={{
            background: "white",
            borderRadius: "20px",
            maxHeight: "130px",
            border: "2px solid #0d6efd",
            ":hover": {
              backgroundColor: "#4d97ff",
              cursor: "pointer",
            },
            margin: "10px",
          }}
          onClick={() => handleClick(sprite.id)} 
        >
          <img
            src={sprite.img} 
            alt={`sprite-${sprite.id}`}
            style={{
              marginBottom: "30px",
              height: "120px",
              width: "120px",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Sprites;
