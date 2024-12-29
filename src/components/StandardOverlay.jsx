import {Card} from "./Card.jsx"
import {useState} from "react"
import "../styles/overlay.css"

export function StandardOverlay({closeOverlay, cardSelected, allCards}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [cards, setCards] = useState([]);


    // Various filters for card search
    // If the beginning of the cards name matches the query
    const exactMatch = (name, query) => {
        return name.substr(0,query.length).toLowerCase() === query.toLowerCase();
    }
    
    // If any other word beginning in cards name matches the query
    const otherMatch = (name, query) => {
        // Find locations of non-alphanumeric chars (spaces, hyphens, etc.) and check substrs starting from of all of those
        const starts = name.split(' ');
        for(let i = 0; i < starts.length; i++){
            if(starts[i].substr(0,query.length).toLowerCase() === query.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    // If cards name contains query at all
    const anyMatch = (name, query) => {
        return name.toLowerCase().includes(query.toLowerCase());
    }

    const onChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        // Removing spaces from query (to avoid stuff like " a " and "te ")
        var count = 0;
        for (let i = 0; i < query.length; i++) {
            if (query[i] !== ' ')
                count++;
        }

        if(count >= 3){
            var remainingCards = allCards;
            
            // If the beginning of the cards name matches the query
            const exactCards = remainingCards.filter((card) => exactMatch(card.name, query));
            remainingCards = remainingCards.filter((card) => !exactMatch(card.name, query));
            
            // If any other word beginning in cards name matches the query
            const otherCards = remainingCards.filter((card) => otherMatch(card.name, query));
            remainingCards = remainingCards.filter((card) => !otherMatch(card.name, query));
            
            // If cards name contains query at all
            const anyCards = remainingCards.filter((card) => anyMatch(card.name, query));
            
            // Displays the first 20 results (if user enters "the", way too many cards appear)
            setCards(exactCards.concat(otherCards).concat(anyCards).slice(0,20));
        }
        else{
            setCards([]);
        }
    };

    return (
        <div className="standard">
            <div className="search-row">
                <input 
                    type="text" 
                    placeholder="Search for cards..." 
                    className="search-input"
                    value={searchQuery}
                    onChange={(event) => onChange(event)}
                />
                <button onClick={closeOverlay} className="close-button">
                    ✖
                </button>
            </div>
            
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
        </div>
    );
}