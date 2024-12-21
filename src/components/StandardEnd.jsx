import "../styles/end.css"

export function StandardEnd({closeOverlay, copyText}) {
    const copyButton = () => {
        navigator.clipboard.writeText(copyText);
    }

    return (
        <div className="end-container">
            <div className="copy-text">{copyText}</div>
            <button className="end-button" onClick={copyButton}>
                Copy Score
            </button>
            <button className="end-button" onClick={closeOverlay}>
                Close
            </button>
        </div>
    );
}