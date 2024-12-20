import {Card} from "./Card.jsx"
import {useState} from "react"
import "../styles/overlay.css"

export function StandardOverlay({closeOverlay, cardSelected, allCards}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [cards, setCards] = useState([]);


    // Various filters for card search
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
            var remainingCards = allCards;
            
            // If the beginning of the cards name matches the query
            const exactCards = remainingCards.filter((card) => exactMatch(card, query));
            remainingCards = remainingCards.filter((card) => !exactMatch(card, query));
            
            // If any other word beginning in cards name matches the query
            const otherCards = remainingCards.filter((card) => otherMatch(card, query));
            remainingCards = remainingCards.filter((card) => !otherMatch(card, query));
            
            // If cards name contains query at all
            const anyCards = remainingCards.filter((card) => anyMatch(card, query));
            
            // Displays the first 20 results (if user enters "the", way too many cards appear)
            setCards(exactCards.concat(otherCards).concat(anyCards).slice(0,20));
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
                        image={card.id}
                        cardSelected={() => cardSelected(card)}
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