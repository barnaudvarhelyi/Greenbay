import { Link } from "react-router-dom"
import { useEffect } from "react"
import Product from './Product';

export default function Home(props) {

    useEffect(() => {
        props.displayAllProducts()
      }, [])

    let displayItems

    /* Displays uploaded products on "Home Page" and re-renders if the user sorts the items */
    if(props.searchResult){

        displayItems = props.searchResult.map(function(searchResult){
            return <div key={searchResult.productId}>
            <Link to={`/products/${searchResult.productId}`}>
            <Product description={searchResult.description} 
            title={searchResult.name} 
            image={searchResult.photoUrl} 
            purchasePrice={searchResult.purchasePrice} 
            startingPrice={searchResult.startingPrice} />
            <p>More information</p>
            </Link>
            </div>
        })
        
    } else if(props.products){

        displayItems = props.products.map(function(product){
            return <div key={product.id}>
            <Link to={`/products/${product.id}`}>
            <Product description={product.description} 
            title={product.name} 
            image={product.photoUrl} 
            purchasePrice={product.purchasePrice} 
            startingPrice={product.startingPrice} />
            <p>More information</p>
            </Link>
            </div>
        })

    }

    /* Gets the selected sorting option and uploads it to the URL, re-renders the uploaded products on "Home Page" in the selected sorting option */
    function sortItems(){
        props.search()
    }
    
    return (
        <div>

            {/* Sorting items section */}
            <div className="sort-items">
            <select id="sort-options" onChange={sortItems}>
                <option value="">Sort by default</option>
                <option value="asc">Sort by ascending</option>
                <option value="desc">Sort by descending</option>
            </select>
            </div>

            {/* Display uploaded products on "Home Page" */}
            <div className="products">
                {displayItems}
            </div>
        </div>
    )
}