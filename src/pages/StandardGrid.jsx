import React, {useState} from "react"
import {Standard} from "../components/Standard"
import "../style/grid.css"

const GridCell = ({row, col, value, onClick}) => {    
    return (
        <button className="grid-cell" onClick={() => onClick(row, col)}>
            {value || "Select"}
        </button>
    );
};

export default function StandardGrid() {
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [selectedCell, setSelectedCell] = useState({row: null, col: null});

    const openOverlay = (row, col) => {
        setSelectedCell({row, col});
        setOverlayVisible(true);
    };

    const closeOverlay = () => {
        setOverlayVisible(false);
        setSelectedCell({row: null, col: null});
    };

    const rowCategories = ["TGT", "Classic", "Naxxramas"];
    const colCategories = ["Minion", "Spell", "Weapon"];


    return (
        <div className="standard-grid">
            <div className="grid-header"></div>

            {colCategories.map((colCategory, colIndex) => (
                <div className="grid-header" key={colIndex}>
                    {colCategory}
                </div>
            ))}
            {rowCategories.map((rowCategory, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    <div className="grid-header">{rowCategory}</div>
                    {colCategories.map((_, colIndex) => (
                        <GridCell
                            row={rowIndex}
                            col={colIndex}
                            value={null}
                            onClick={openOverlay}
                            key={colIndex}
                        />
                    ))}
                </React.Fragment>
            ))}

            {overlayVisible && <Standard closeOverlay={closeOverlay}></Standard>}
        </div>
    );
}