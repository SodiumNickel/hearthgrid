import "../styles/card.css"

export function Card({name, image, cardSelected}) {
    return <div className="card">
        <div className="card-name">
            <h3>{name}</h3>
        </div>
        <div className="card-image">
            <img src={"https://art.hearthstonejson.com/v1/256x/" + image + ".webp"} alt={name}></img>
        </div>
        <div className="card-overlay">
            <button className="select-btn" onClick={cardSelected}>
                Select
            </button>
        </div>
    </div>
}