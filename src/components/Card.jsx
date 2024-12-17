
export function Card({card}) {

    function onClick() {
        alert("clicked")
    }

    // "https://art.hearthstonejson.com/v1/256x/" + card.id + ".jpg"
    return <div className="card">
        <div className="card-image">
            <img src={card.id} alt={card.name}></img>
        </div>
        <div className="card-overlay">
            <button className="select-btn" onClick={onClick}>
                Select
            </button>
        </div>
    </div>
}