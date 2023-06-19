import { Link } from "react-router-dom"

export default function Product(props){
    return(
        <div className="product">

            <div className="product-img">
                <img src={props.image} />
            </div>

            <div className="product-text">
                <h3>{props.title}</h3>
                <h4>Purchasing Price:</h4>
                <h4>${props.purchasePrice}</h4>
                <h4>{props.startingPrice && "Starting Price:"}</h4>
                <h4>{props.startingPrice && "$" + props.startingPrice}</h4>
            </div>
            
        </div>
    )
}