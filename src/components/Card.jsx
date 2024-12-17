import "../styles/card.css"

export function Card({name, image}) {

    function onClick() {
        alert("clicked")
    }

    // "https://art.hearthstonejson.com/v1/256x/" + card.id + ".jpg"
    return <div className="card">
        <div className="card-image">
            <img src={image} alt={name}></img>
        </div>
        <div className="card-overlay">
            <button className="select-btn" onClick={onClick}>
                Select
            </button>
        </div>
    </div>
}