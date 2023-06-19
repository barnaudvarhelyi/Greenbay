import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'
import Product from './Product';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Login from './Login';

export default function SingleProduct(props){

    const { productId } = useParams()
    const [productPage, setProductPage] = useState()

    /* When the user clicks on a product, it collects that product's data and saves it to productPage state */
    async function singlePageProduct(){
        const res = await fetch(`https://greenbaybackend-production.up.railway.app/products/${productId}`)
        const data = await res.json()
        setProductPage(data)
        document.title = `${data.name} | Greenbay`
    }
    
    useEffect(() => {
        singlePageProduct()
    }, [productId])

    let moreItems

    if(productPage != undefined){
    moreItems = productPage.randomProducts.map(function(item){
        return <SwiperSlide key={item.productId}>
        <div>
        <Link to={`/products/${item.productId}`}>
        <Product
        title={item.name} 
        image={item.photoUrl} 
        purchasePrice={item.purchasePrice}/>
        </Link>
        </div>
        </SwiperSlide>
    })
    }

    function purchaseAlert(){
        document.querySelector('.purchase-alert').style.display = 'block'
        document.querySelector('.alert-overlay').style.display = 'block'
    }

    function cancelPurchase(){
        document.querySelector('.purchase-alert').style.display = 'none'
        document.querySelector('.alert-overlay').style.display = 'none'
    }

    function biddingAlert(productId){
        document.querySelector('.bidding-alert').style.display = 'block'
        document.querySelector('.alert-overlay').style.display = 'block'
        props.placeBid(productId)
        setTimeout(function(){
            navigate('/profile')
        }, 1000)
    }

    const navigate = useNavigate()

    function confirmPurchase(){
        // document.querySelector('.alert-title').innerText = 'Thank you for your purchase!'
        document.querySelector('.cancel').style.display = 'none'
        document.querySelector('.confirm').style.display = 'none'
        props.purchase(productId)
        setTimeout(function(){
            navigate('/profile')
        }, 1000)
    }

    if(productPage != undefined){
    return (
        <div className="single-product">

            <div className="alert-overlay"></div>

            <div className="product-informations">
                <div className="product-img">
                <Link to="/">Back to Home Page</Link>
                <h1>{productPage.name}</h1>
                <img src={productPage.photoUrl} alt={productPage.name} />
                </div>

                <div className="product-details">
                <Link to={productPage.uploader === localStorage.getItem('username') ? '/profile' : `/user/${productPage.uploader}`} className="user-link">Uploaded by: {productPage.uploader}</Link>
                <h3 className="description">Description</h3>

                <p>{productPage.description}</p>
                <h3>{productPage.expiresAt && "Auction ends at: " + productPage.expiresAt}</h3>
                <h3>{productPage.startingPrice && "Staring Price: $" + productPage.startingPrice}</h3>
                <div className="bidding-section">
                    {productPage.startingPrice && <input type="number" placeholder="Amount of bid" id="bidAmount" />}
                    {productPage.startingPrice && <button className="bidding-btn" onClick={() => biddingAlert(productId)}>Place your bid</button>}
                </div>

                <div className="bidding-alert">
                    <h1 className="alert-title">{props.placeBid.message}</h1>
                </div>

                <h3>Purchase Price: ${productPage.purchasePrice}</h3>
                <button className="purchase-btn" onClick={purchaseAlert}>Purchase</button>

                <div className="purchase-alert">
                    <h1 className="alert-title">Are you sure you want to purchase {productPage.name} ?</h1>
                    <button className="cancel" onClick={cancelPurchase}>Cancel</button>
                    <button className="confirm" onClick={confirmPurchase}>Confirm</button>
                </div>

                </div>
            </div>

            <Swiper
                className="swiper"
                spaceBetween={50}
                breakpoints={{
                    0: {
                        slidesPerView: 1
                    },
                    500: {
                        slidesPerView: 3
                    },
                    1000: {
                        slidesPerView: 4
                    }
                }}
            >
                {moreItems}
            </Swiper>

        </div>
    )
    }
}