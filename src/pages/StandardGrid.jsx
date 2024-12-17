import React, {useState, useEffect} from "react"
import {StandardOverlay} from "../components/StandardOverlay"
import "../styles/grid.css"

const GridCell = ({row, col, card, onClick}) => {    
    return (
        <div>
            {card && 
                <div className="done-grid-cell">
                    <img src={"https://art.hearthstonejson.com/v1/256x/" + card.id + ".jpg"} alt={card.name}></img>
                </div>
            }
            {!card &&
                <button className="grid-cell" onClick={() => onClick(row, col)}>
                    {"Select"}
                </button>
            }
        </div>
    );
};

export default function StandardGrid() {
    const [allCards, setAllCards] = useState([]);
    useEffect(() => {
        function fetchJSONData() {
            fetch("https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json")
                .then((res) => {
                    if (!res.ok) {
                        throw new Error
                            (`HTTP error! Status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) =>
                    setAllCards(data))
                .catch((error) =>
                    console.error("Unable to fetch data:", error));
        }
        fetchJSONData();
    }, []);

    const [overlayVisible, setOverlayVisible] = useState(false);
    const [selectedCell, setSelectedCell] = useState({row: null, col: null});
    const [cardGrid, setCardGrid] = useState(
        Array(3).fill(null).map(() => Array(3).fill(null))
    );

    // WILL BE CHANGED DAILY (probably by a seeded random number generator? actually i would like to be able to select it manually)
    // cat_type options: [set, type, cost, attack, health, rarity, cardClass, mechanics]
    const rowCategories = [{cat_type: "set", cat_val: "WHIZBANGS_WORKSHOP"}, {cat_type: "set", cat_val: "WILD_WEST"}, {cat_type: "set", cat_val: "TITANS"}];
    const colCategories = [{cat_type: "type", cat_val: "MINION"}, {cat_type: "type", cat_val: "SPELL"}, {cat_type: "type", cat_val: "WEAPON"}];


    const openOverlay = (row, col) => {
        setSelectedCell({row, col});
        setOverlayVisible(true);
    };

    const closeOverlay = () => {
        setOverlayVisible(false);
        setSelectedCell({row: null, col: null});
    };

    const cardSelected = (card) => {
        const {row, col} = selectedCell;
        var matches = true;

        // Check if card matches row
        const row_cat_val = rowCategories[row].cat_val;
        switch(rowCategories[row].cat_type){
            case "set":
                matches = card.set === row_cat_val;
                break;
            case "type":
                matches = card.type === row_cat_val;
                break;
            case "rarity":
                matches = card.rarity === row_cat_val;
                break;
            case "cardClass":
                matches = card.cardClass === row_cat_val;
                break;
            case "mechanics":
                matches = card.mechanics.includes(row_cat_val);
                break;
            case "cost":
                // 0-3, 4-6, 7+
                break;
            case "attack":
                // 0-4, 5-7, 8+
                break; 
            case "health":
                // 0-4, 5-8, 9+
                break;
            default:
                console.log("Unrecognized rowCategory")
                break;
        }

        // Check if card matches col
        const col_cat_val = colCategories[col].cat_val;
        switch(colCategories[col].cat_type){
            case "set":
                matches = matches && card.set === col_cat_val;
                break;
            case "type":
                matches = matches && card.type === col_cat_val;
                break;
            default:
                console.log("Unrecognized colCategory")
                break;
        }

        if(matches){
            var prevGrid = cardGrid;
            prevGrid[row][col] = card;
            setCardGrid(prevGrid);
        }
        else{
            // Display an incorrect animation over the category
        }

        setOverlayVisible(false);
        setSelectedCell({row: null, col: null});
    }


    return (
        <div className="grid-container">
            <div className="standard-grid">
                <div className="grid-header"></div>

                {colCategories.map((colCategory, colIndex) => (
                    <div className="grid-header" key={colIndex}>
                        {colCategory.cat_val}
                    </div>
                ))}
                {rowCategories.map((rowCategory, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        <div className="grid-header">{rowCategory.cat_val}</div>
                        {colCategories.map((_, colIndex) => (
                            <GridCell
                                row={rowIndex}
                                col={colIndex}
                                card={cardGrid[rowIndex][colIndex]}
                                onClick={openOverlay}
                                key={colIndex}
                            />
                        ))}
                    </React.Fragment>
                ))}

                {overlayVisible && 
                    <div className="overlay-container">
                        {/* TODO: we should not allow selection of already chosen cards */}
                        <StandardOverlay closeOverlay={closeOverlay} cardSelected={cardSelected} allCards={allCards}/>
                    </div>
                }
            </div>
        </div>
    );
}