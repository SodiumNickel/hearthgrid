import "../styles/category.css"

export function CategoryHeader({cat_type, cat_val}) {
    switch(cat_type){
        case "set":
            return <div className="expansion-image">
                <img src={"expansions/" + cat_val + ".png"} alt={"cannot find logo for " + cat_val}/>
            </div>
        default:
            return <div>
                {cat_val}
            </div>
    }
    
    
}