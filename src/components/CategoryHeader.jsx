import "../styles/category.css"

export function CategoryHeader({cat_type, cat_val}) {
    switch(cat_type){
        case "set":
            return <div className="expansion-image">
                <img src={"expansions/" + cat_val + ".png"} alt={"cannot find logo for " + cat_val}/>
            </div>
        case "cardClass":
            return <div className="class-image">
                <img src={"classes/" + cat_val + ".png"} alt={"cannot find logo for " + cat_val}/>
            </div>
        case "cost":
            return <div className="category-header-text">
            {cat_val} COST
            </div>
        case "mechanics":
            if(cat_val === "DIVINE_SHIELD"){
                return <div className="category-header-text">
                DIVINE SHIELD
                </div>
            }
            else if(cat_val === "DEATHRATTLE"){
                return <div className="category-header-text">
                DEATH RATTLE
                </div>
            }
            return <div className="category-header-text">
            {cat_val}
            </div>
        default:
            return <div className="category-header-text">
                {cat_val}
            </div>
    }
}