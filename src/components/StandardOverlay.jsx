import {Card} from "./Card"
import {useState} from "react"
import jCards from "../assets/cards.collectible.json"
import "../styles/overlay.css"

export function StandardOverlay({closeOverlay}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [cards, setCards] = useState([]);

    const standardSets = ["CORE", 
                          "BATTLE_OF_THE_BANDS", "TITANS", "WILD_WEST", // Year of the Wolf (2023)
                          "EVENT", // Contains all the 'gift' cards
                          "WHIZBANGS_WORKSHOP", "ISLAND_VACATION", "SPACE" // Year of the Pegasus (2024)
                        ];
    
    // Various filters for card search
    // If card is in standard
    const isStandard = (card) => {
        return standardSets.includes(card.set);
    }

    // If the beginning of the cards name matches the query
    const exactMatch = (card, query) => {
        return card.name.substr(0,query.length).toLowerCase() === query.toLowerCase();
    }
    
    // If any other word beginning in cards name matches the query
    const otherMatch = (card, query) => {
        // Find locations of non-alphanumeric chars (spaces, hyphens, etc.) and check substrs starting from of all of those
        return false;
    }

    // If cards name contains query at all
    const anyMatch = (card, query) => {
        return card.name.toLowerCase().includes(query.toLowerCase());
    }

    const onChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if(query.length >= 3){
            var remainingCards = jCards.filter(isStandard);
            
            // If the beginning of the cards name matches the query
            const exactCards = remainingCards.filter((card) => exactMatch(card, query));
            remainingCards = remainingCards.filter((card) => !exactMatch(card, query));
            
            // If any other word beginning in cards name matches the query
            const otherCards = remainingCards.filter((card) => otherMatch(card, query));
            remainingCards = remainingCards.filter((card) => !otherMatch(card, query));
            
            // If cards name contains query at all
            const anyCards = remainingCards.filter((card) => anyMatch(card, query));

            setCards(exactCards.concat(otherCards).concat(anyCards));
        }
        else{
            setCards([]);
        }
    };

    return (
        <div className="standard">
            <input 
                type="text" 
                placeholder="Search for cards..." 
                className="search-input"
                value={searchQuery}
                onChange={(event) => onChange(event)}
            />
            <div className="card-grid">
                {cards.map(card => 
                    <Card 
                        name={card.name} 
                        key={card.dbfId}
                    />
                )}
            </div>
            <button onClick={closeOverlay}>
                Close
            </button>
        </div>
    );
}