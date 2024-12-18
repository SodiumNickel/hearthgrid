import React, {useState, useEffect} from "react"
import {StandardOverlay} from "../components/StandardOverlay"
import {CategoryHeader} from "../components/CategoryHeader"
import {Random} from "../components/Random"
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
    const standardSets = [
        "CORE", 
        "BATTLE_OF_THE_BANDS", "TITANS", "WILD_WEST", // Year of the Wolf (2023)
        "EVENT", // Contains all the 'gift' cards
        "WHIZBANGS_WORKSHOP", "ISLAND_VACATION", "SPACE" // Year of the Pegasus (2024)
    ];

    const isStandard = (card) => {
        return standardSets.includes(card.set);
    }

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
                    setAllCards(data.filter(isStandard)))
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

    // WILL BE CHANGED DAILY (per users local time)
    const [rowCategories, setRowCategories] = useState([]);
    const [colCategories, setColCategories] = useState([])
    useEffect(() => {
        if(allCards.length === 0){
            return;
        }

        var categories = [
            // set
            [{cat_type: "set", cat_val: "BATTLE_OF_THE_BANDS"},
             {cat_type: "set", cat_val: "TITANS"}, 
             {cat_type: "set", cat_val: "WILD_WEST"},
             {cat_type: "set", cat_val: "WHIZBANGS_WORKSHOP"},
             {cat_type: "set", cat_val: "ISLAND_VACATION"}, 
             {cat_type: "set", cat_val: "SPACE"}
            ],
            // type
            [{cat_type: "type", cat_val: "MINION"}, 
             {cat_type: "type", cat_val: "SPELL"}, 
             {cat_type: "type", cat_val: "WEAPON"}
            ],
            // rarity
            [{cat_type: "rarity", cat_val: "COMMON"}, 
             {cat_type: "rarity", cat_val: "RARE"}, 
             {cat_type: "rarity", cat_val: "EPIC"},
             {cat_type: "rarity", cat_val: "LEGENDARY"},
            ],
            // cardClass
            [{cat_type: "cardClass", cat_val: "NEUTRAL"}, 
             {cat_type: "cardClass", cat_val: "DEATHKNIGHT"}, 
             {cat_type: "cardClass", cat_val: "DEMONHUNTER"}, 
             {cat_type: "cardClass", cat_val: "DRUID"}, 
             {cat_type: "cardClass", cat_val: "HUNTER"}, 
             {cat_type: "cardClass", cat_val: "MAGE"}, 
             {cat_type: "cardClass", cat_val: "PALADIN"}, 
             {cat_type: "cardClass", cat_val: "PRIEST"}, 
             {cat_type: "cardClass", cat_val: "ROGUE"}, 
             {cat_type: "cardClass", cat_val: "SHAMAN"}, 
             {cat_type: "cardClass", cat_val: "WARLOCK"}, 
             {cat_type: "cardClass", cat_val: "WARRIOR"}
            ],
            // mechanics
            [{cat_type: "mechanics", cat_val: "BATTLECRY"}, 
             {cat_type: "mechanics", cat_val: "DEATHRATTLE"},
             {cat_type: "mechanics", cat_val: "DISCOVER"},
             {cat_type: "mechanics", cat_val: "DIVINE_SHIELD"},
             {cat_type: "mechanics", cat_val: "LIFESTEAL"},
             {cat_type: "mechanics", cat_val: "POISONOUS"},
             {cat_type: "mechanics", cat_val: "RUSH"},
             {cat_type: "mechanics", cat_val: "SECRET"}
            ],
            // cost
            [{cat_type: "cost", cat_val: "0-3"}, 
             {cat_type: "cost", cat_val: "4-6"}, 
             {cat_type: "cost", cat_val: "7+"}
            ]
        ]

        const date = new Date();
        const seed = (89 * date.getDate()) + (7 * (date.getMonth()+1)) + (109 * date.getFullYear()) 
        const rand = new Random(seed);

        // First randomly accept any categories for the rows (no duplicate vals)
        const rowCats = [];
        const usedCats = new Set();
        for (let k = 0; k < 3; k++) {
            const i = rand.nextInt(categories.length);
            const j = rand.nextInt(categories[i].length);
            rowCats.push(categories[i][j]);
            categories[i].splice(j, 1);

            usedCats.add(i);
        }

        // Remove category_types that are in the rows (columns cannot overlap here)
        const sortedUsedCats = Array.from(usedCats).sort();
        sortedUsedCats.reverse();
        sortedUsedCats.forEach(k => categories.splice(k, 1));

        // Columns can still have no duplicate vals (but need to make sure at least 2 cards exist with those categories)
        function cardsExist(colCat) {
            var i = 0;
            var cardIdx = 0;
            while(cardIdx < allCards.length && i < 2){
                const card = allCards[cardIdx];

                var allMatches = true;
                for(let j = 0; j < 4; j++){
                    var matches = true;

                    const cat_type = j == 3 ? colCat.cat_type : rowCats[j].cat_type;
                    const cat_val = j == 3 ? colCat.cat_val : rowCats[j].cat_val;

                    switch(cat_type){
                        case "set":
                            matches = matches && card.set === cat_val;
                            break;
                        case "type":
                            matches = matches && card.type === cat_val;
                            break;
                        case "rarity":
                            matches = matches && card.rarity === cat_val;
                            break;
                        case "cardClass":
                            matches = matches && card.cardClass === cat_val;
                            break;
                        case "mechanics":
                            matches = matches && card.hasOwnProperty("mechanics") && card.mechanics.includes(cat_val);
                            break;
                        case "cost":
                            // 0-3, 4-6, 7+
                            if(cat_val === "0-3"){
                                matches = matches && card.cost <= 3;
                            }
                            else if(cat_val === "4-6"){
                                matches = matches && 4 <= card.cost && card.cost <= 6;
                            }
                            else if(cat_val === "7+"){
                                matches = matches && 7 <= card.cost;
                            }
                            else{
                                console.log("Unrecognized category")
                            }
                            break;
                        default:
                            console.log("Unrecognized category" + cat_type + cat_val);
                            break;
                    }

                    if(!matches){
                        allMatches = false;
                        break;
                    }
                }
                
                if(allMatches){
                    i += 1;
                }
                cardIdx += 1;
            }

            return i >= 2;
        }
        
        const colCats = [];
        for (let k = 0; k < 3; k++) {
            var i = rand.nextInt(categories.length);
            var j = rand.nextInt(categories[i].length);
            while(!cardsExist(categories[i][j])){
                categories[i].splice(j, 1);
                if(categories[i].length === 0){
                    categories.splice(i, 1);
                }
                
                console.log(categories.length);
                i = rand.nextInt(categories.length);
                j = rand.nextInt(categories[i].length);
            }

            colCats.push(categories[i][j]);
            categories[i].splice(j, 1);
            if(categories[i].length === 0){
                categories.splice(i, 1);
            }

        }

        setRowCategories(rowCats);
        setColCategories(colCats);
    }, [allCards]);  // Need to make sure allCards is properly created before we generate categories

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
                matches = card.hasOwnProperty("mechanics") && card.mechanics.includes(row_cat_val);
                break;
            case "cost":
                // 0-3, 4-6, 7+
                if(row_cat_val === "0-3"){
                    matches = card.cost <= 3;
                }
                else if(row_cat_val === "4-6"){
                    matches = 4 <= card.cost && card.cost <= 6;
                }
                else if(row_cat_val === "7+"){
                    matches = 7 <= card.cost;
                }
                else{
                    console.log("Unrecognized rowCategory")
                }
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
            case "rarity":
                matches = matches && card.rarity === col_cat_val;
                break;
            case "cardClass":
                matches = matches && card.cardClass === col_cat_val;
                break;
            case "mechanics":
                matches = matches && card.hasOwnProperty("mechanics") && card.mechanics.includes(col_cat_val);
                break;
            case "cost":
                // 0-3, 4-6, 7+
                if(col_cat_val === "0-3"){
                    matches = matches && card.cost <= 3;
                }
                else if(col_cat_val === "4-6"){
                    matches = 4 <= matches && card.cost && card.cost <= 6;
                }
                else if(col_cat_val === "7+"){
                    matches = 7 <= matches && card.cost;
                }
                else{
                    console.log("Unrecognized colCategory")
                }
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
                        <CategoryHeader cat_type={colCategory.cat_type} cat_val={colCategory.cat_val}/>
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