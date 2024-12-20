import "../styles/end.css"

export function StandardEnd({closeOverlay}) {
    return (
        <div className="end-container">
            <button onClick={closeOverlay}>
                Close
            </button>
        </div>
    );
}