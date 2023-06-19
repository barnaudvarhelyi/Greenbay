import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Profile(props){

    useEffect(() => {
        props.displayProfileInformation()
    }, [])

    const [productData, setProductData] = useState(
        {
            name: "",
            description: "",
            photoUrl: "",
            purchasePrice: "",
            startingPrice: "",
            forBid: false,
            expiresAt: "",
            createdAt: "",
            owner: "",
            uploader: ""
        }
    )

    const [uploadErrorMessage, setUploadErrorMessage] = useState()

    const navigate = useNavigate()

    /* Save the input data to "productData" state */
    function handleItem(e){
        const name = e.target.name
        const value = e.target.value
        const checked = e.target.checked

        setProductData({
            ...productData,
            [name]: value
        })
    }

    
    /* User displays "Create new item" form */
    function displayForm(){
        const productForm = document.querySelector('#addProductForm')
        const addProduct = document.querySelector('.add-item-animation')
        productForm.style.display = 'flex'
        addProduct.style.display = 'none'
    }

    /* User uploads a product */
    async function uploadProduct(e){
        e.preventDefault()
        const res = await fetch('http://localhost:8080/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(productData)
        })
        const data = await res.json()
        props.displayAllProducts()
        props.displayProfileInformation()
        setUploadErrorMessage(data.message)
        if(res.status === 201){
            resetUploadForm()
            navigate(`/products/${data.productId}`)
        }
    }

    /* User clicks on "Edit" button and enters "Editing mode" */
    const [editMode, setEditMode] = useState(false)
    async function editButton(){
        setEditMode(prevState => !prevState)
        const deleteBtn = document.querySelectorAll('.delete-btn')
        const editBtn = document.querySelectorAll('.edit-btn')
        deleteBtn.forEach(item => {
            item.style.display = editMode === true ? 'none' : 'block'
        });
        editBtn.forEach(item => {
            item.style.display = editMode === true ? 'none' : 'block'
        });
    }

    /* User gets the data of the product he wants to edit */
    async function editProduct(id){
        const res = await fetch(`http://localhost:8080/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            })
            const data = await res.json()
            displayForm()
            document.getElementById('addProductForm').scrollIntoView({
                behavior: "smooth"
            })
            document.getElementById("title").value = data.name
            document.getElementById("description").value = data.description
            document.getElementById("photoUrl").value = data.photoUrl
            document.getElementById("purchasePrice").value = data.purchasePrice
            document.getElementById("startingPrice").value = data.startingPrice
            document.getElementById("addItem").style.display = "none"
            document.querySelector("#checkboxBidding").style.display = 'none'
            document.querySelector("#checkboxLabel").style.display = 'none'
            document.getElementById("editItem").style.display = "block"
            document.getElementById("editItem").style.display = "block"
            if(data.startingPrice){
                document.getElementById("startingPrice").style.display = 'block'
                document.querySelector(".expiresAt").style.display = 'block'
                document.querySelector("#checkboxBidding").style.display = 'none'
            } else {
                document.getElementById("startingPrice").style.display = 'none'
                document.querySelector(".expiresAt").style.display = 'none'
            }
            let url = new URL(window.location.href)
            url.searchParams.set("id", id)
            window.history.replaceState({}, "", url.toString())
    }

    /* User edits the products */
    async function editItem(){
        const url = new URL(window.location.href)
        const id = url.searchParams.get('id')
        let inputValues = {
            name: document.getElementById("title").value,
            description: document.getElementById("description").value,
            photoUrl: document.getElementById("photoUrl").value,
            startingPrice: document.getElementById("startingPrice").value,
            purchasePrice: document.getElementById("purchasePrice").value,
            expiresAt: document.querySelector('.expiresAt').value
        }
        const res = await fetch(`http://localhost:8080/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(inputValues)
            })
            const data = await res.json()
            navigate(`/products/${id}`)
            document.getElementById("addItem").style.display = "block"
            document.getElementById("editItem").style.display = "none"
    }

    /* User deletes a product */
    let deletedProduct

    function deleteAlert(id){
        document.querySelector('.delete-alert').style.display = 'block'
        document.querySelector('.alert-overlay').style.display = 'block'
        deletedProduct = id
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    function cancelDelete(){
        document.querySelector('.delete-alert').style.display = 'none'
        document.querySelector('.alert-overlay').style.display = 'none'
    }

    function confirmDelete(){
        document.querySelector('.delete-alert').style.display = 'none'
        document.querySelector('.alert-overlay').style.display = 'none'
        deleteProduct(deletedProduct)
    }

    function deleteProduct(){
        fetch(`http://localhost:8080/products/${deletedProduct}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
        })
        .then(res => res.json())
        .then(data => {
            props.displayAllProducts()
            props.displayProfileInformation()
        })
        .catch(err => console.log("Error: " + err))
    }

    /* User resets the form and hides it */
    function resetUploadForm(){
        const productForm = document.querySelector('#addProductForm')
        const addProduct = document.querySelector('.add-item-animation')
        productForm.style.display = 'none'
        addProduct.style.display = 'flex'
        document.getElementById("addItem").style.display = "block"
        document.getElementById("editItem").style.display = "none"
        const url = new URL(window.location.href)
        window.history.replaceState({}, "", url.origin + url.pathname)
        productForm.reset()
    }

    /* Display the users uploaded products */
    let uploadedProducts
    let uploadedProductsCount
    let balance
    let activeBids
    let displayTransactions
    const emptyProducts = document.querySelector('.empty-products')
    const emptyBids = document.querySelector('.empty-bids')

    const [visible, setVisible] = useState(4)
    function showMoreItems(){
        const btn = document.querySelector('.show-more')

        if(visible === 4){
            setVisible(props.userProfile.uploadedProducts.length)
            btn.innerText = "Show less items"
        } else {
            setVisible(4)
            btn.innerText = "Show all items"
        }

        const deleteBtn = document.querySelectorAll('.delete-btn')
        const editBtn = document.querySelectorAll('.edit-btn')
        deleteBtn.forEach(item => {
            item.style.display = editMode === false ? 'none' : 'block'
        });
        editBtn.forEach(item => {
            item.style.display = editMode === false ? 'none' : 'block'
        });
    }

    if(props.userProfile && emptyProducts){

        uploadedProducts = props.userProfile.uploadedProducts.slice(0, visible).map(function(item){
            return <div className="product" key={item.productId}>
                <Link to={`/products/${item.productId}`}>
                <div className="product-img">
                    <img src={item.photoUrl} alt="" />
                </div>
                <div className="product-text">
                <h3>{item.name}</h3>
                </div>
                </Link>
                <button className="delete-btn" onClick={() => deleteAlert(item.productId)}><i className="fa-solid fa-xmark"></i></button>
                <button className="edit-btn" onClick={() => editProduct(item.productId)}><i className="fa-solid fa-gear"></i></button>
            </div>
        })

        if(props.userProfile.uploadedProductsCount > 0){
            emptyProducts.style.display = "none"
        } else {
            emptyProducts.style.display = "flex"
        }

        activeBids = props.userProfile.usersActiveBids.slice(0, visible).map(function(item){
            return <div className="product" key={item.productId}>
                <Link to={`/products/${item.productId}`}>
                <div className="product-img">
                    <img src={item.productPhotoUrl} alt="" />
                </div>
                <div className="product-text">
                <h3>{item.productName}</h3>
                </div>
                </Link>
            </div>
        })

        if(props.userProfile.usersActiveBids.length > 0){
            emptyBids.style.display = "none"
        } else {
            emptyBids.style.display = "flex"
        }

        displayTransactions = props.userProfile.transactions.map(function(item){
            return <tr key={item.transactionId}>
                <td><i className={item.transaction === true ? "fa-solid fa-arrow-up" : "fa-solid fa-arrow-down"}></i></td>
                <td>{item.name}</td>
                <td>${item.amount}</td>
            </tr>
        })

        uploadedProductsCount = props.userProfile.uploadedProductsCount
        balance = props.userProfile.balance.balance

    }

    useEffect(() => {
        if(uploadedProductsCount > 4){
            document.querySelector('.show-more-container').style.display = 'block'
        } else {
            document.querySelector('.show-more-container').style.display = 'none'
        }
    }, [uploadedProductsCount])

    /* User displays the fund options */
    function displayFunds(){
        const displayFunds = document.querySelector('.add-funds')
        const cancelItem = document.querySelector('.cancel-fund')
        const addItem = document.querySelector('.add-item-animation')
        displayFunds.style.display = displayFunds.style.display == 'flex' ? 'none' : 'flex'
        cancelItem.style.display = cancelItem.style.display == 'flex' ? 'none' : 'flex'
        addItem.style.display = addItem.style.display == 'none' ? 'flex' : 'none'
    }

    let fund

    function fundsAlert(amount){
        document.querySelector('.cancel').style.display = 'inline-block'
        document.querySelector('.confirm').style.display = 'inline-block'
        document.querySelector('.funds-alert').style.display = 'block'
        document.querySelector('.alert-overlay').style.display = 'block'
        fund = amount
    }

    function cancelFunds(){
        document.querySelector('.funds-alert').style.display = 'none'
        document.querySelector('.alert-overlay').style.display = 'none'
    }

    function confirmFunds(){
        document.querySelector('.alert-title').innerText = 'Thank you for your purchase!'
        document.querySelector('.cancel').style.display = 'none'
        document.querySelector('.confirm').style.display = 'none'
        props.uploadFunds(fund)
        setTimeout(function(){
            document.querySelector('.funds-alert').style.display = 'none'
            document.querySelector('.alert-overlay').style.display = 'none'
        }, 1000)
    }

    /* User toggles "Auction mode" */
    function toggleBidding(e){
        const name = e.target.name
        const checked = e.target.checked
        const checkbox = document.querySelector('#checkboxBidding')
        const startingPrice = document.querySelector('#startingPrice')
        const expiresAt = document.querySelector('.expiresAt')
        startingPrice.style.display = checkbox.checked ? 'block' : 'none'
        expiresAt.style.display = checkbox.checked ? 'block' : 'none'
        setProductData({
            ...productData,
            [name]: checked
        })
    }

    function logout(){
        localStorage.clear()
        navigate('/')
        window.location.reload()
    }

    return(
        <section className="profile">

            {/* Two main buttons on Profile page */}
            <div className="container">
            <h3 className="balance">Your balance: ${balance}</h3>
            <div className="add-item-animation btn-grad">
                <div onClick={displayForm} className="btn-grad">
                    <h1>Create new item</h1>
                    <h1>+</h1>
                </div>
                <div onClick={displayFunds} className="btn-gradient">
                    <h1>Add funds to your balance</h1>
                    <h1>+</h1>
                </div>
            </div>

            {/* Product upload form */}
            <form onSubmit={uploadProduct} autoComplete="off" id="addProductForm">

                <h4 className="error-message" style={uploadErrorMessage ? {display: 'block'} : {display: 'none'}}>{uploadErrorMessage}</h4>

                <div className="upload-product">
                    <div className="input-fields">
                    <input type="text" name="name" onChange={handleItem} placeholder="Title" id="title"/>
                    <input type="text" name="description" onChange={handleItem} placeholder="Description" id="description"/>
                    <input type="text" name="photoUrl" onChange={handleItem} placeholder="Photo" id="photoUrl"/>
                    <input type="number" name="purchasePrice" onChange={handleItem} placeholder="Purchase Price" step=".01" id="purchasePrice"/>
                    </div>

                    <label htmlFor="forBid" id="checkboxLabel">Do you want to list your item for auction?</label>
                    <input type="checkbox" name="forBid" onClick={(e) => toggleBidding(e)} id="checkboxBidding" />

                    <div className="auction">
                        <input type="number" name="startingPrice" onChange={handleItem} placeholder="Starting Price" step=".01" id="startingPrice" />

                        <select className="expiresAt" name="expiresAt" onChange={handleItem}>
                            <option value="two_minutes">Two Minutes</option>
                            <option value="one_day">1 Day</option>
                            <option value="three_days">3 Days</option>
                            <option value="one_week">1 Week</option>
                            <option value="two_tweeks">2 Weeks</option>
                            <option value="one_month">1 Month</option>
                        </select>
                    </div>
                </div>

                <div className="button-container">
                    <button type="button" onClick={resetUploadForm}>Cancel</button>
                    <button type="submit" id="addItem">Add Item</button>
                    <button type="button" id="editItem" onClick={editItem}>Edit Item</button>
                </div>

            </form>

            {/* Add funds section */}
            <div className="alert-overlay"></div>
            <div className="funds-alert">
                <h1 className="alert-title">Are you sure you want to transfer money to your account?</h1>
                <button className="cancel" onClick={cancelFunds}>Cancel</button>
                <button className="confirm" onClick={confirmFunds}>Confirm</button>
            </div>

            <div className="add-funds">
                <div onClick={() => fundsAlert(10)}>$10</div>
                <div onClick={() => fundsAlert(50)}>$50</div>
                <div onClick={() => fundsAlert(100)}>$100</div>
            </div>
            <h4 className="cancel-fund" onClick={displayFunds}>Cancel</h4>

            {/* Displays the amount of the user's uploaded products and can enter "Editing mode" */}
            <div className="profile-text">
                <h1>Your Items ({uploadedProductsCount})</h1>
                <button onClick={editButton}><i className="fa-solid fa-gear"></i>Edit</button>
            </div>

            {/* Displays the user's uploaded products */}
            <div className="products">
                {uploadedProducts}
                <div className="empty-products">
                    <h1>There are no active bids currently.</h1>
                </div>
            </div>
            <div className="show-more-container">
                <button className="show-more" onClick={showMoreItems}>Show more items</button>
            </div>
            

            <h1>Active bids</h1>
            <div className="products">
                {activeBids}
                <div className="empty-bids">
                    <h1>There are no active bids currently.</h1>
                </div>
            </div>

            <h1>Transactions</h1>
            <table>
                <tbody>
                    <tr>
                        <th>Transaction</th>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                    {displayTransactions}
                </tbody>
            </table>

            <div className="alert-overlay"></div>
            <div className="delete-alert">
                <h1 className="alert-title">Are you sure you want to delete this item?</h1>
                <button className="cancel" onClick={cancelDelete}>Cancel</button>
                <button className="confirm" onClick={confirmDelete}>Confirm</button>
            </div>

            <button className="logout" onClick={logout}>Logout</button>

            </div>
        </section>
    )
}