import Login from "./Login"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

export default function UploaderProfile(props){

  const [uploaderProfile, setUploaderProfile] = useState()

  const { username } = useParams()

  /* When the user clicks on the uploaders name, it collects that user's data and saves it to uploaderProfile state */
  async function displayUploader(){
    const res = await fetch(`https://greenbaybackend-production.up.railway.app/user-profile/${username}`)
    const data = await res.json()
    setUploaderProfile(data)
  }

  useEffect(() => {
    displayUploader()
  }, [])

  let uploaderInformations

  /* Displays a user's informations */
  if(uploaderProfile){
    uploaderInformations = <div>
      <h1>{uploaderProfile.username}'s Profile</h1>
      <h4>{uploaderProfile.email}</h4>
      <h3>{uploaderProfile.username}'s active items ({uploaderProfile.productsCount})</h3>
    </div>
  }

  let uploadersProducts

  const [visible, setVisible] = useState(4)
  function showMoreItems(){
      const btn = document.querySelector('.show-more')
      if(visible === 4){
          setVisible(uploaderProfile.products.length)
          btn.innerText = "Show less items"
      } else {
          setVisible(4)
          btn.innerText = "Show all items"
      }
  }

  /* Displays a user's uploaded products */
  if(uploaderProfile){
    uploadersProducts = uploaderProfile.products.slice(0, visible).map(function(item){
        return <div className="product" key={item.productId}>
            <Link to={`/products/${item.productId}`}>
            <div className="product-img">
                <img src={item.photoUrl} alt="" />
            </div>
            <div className="product-text">
            <h3>{item.name}</h3>
            </div>
            </Link>
        </div>
    })
}

    return (
        <div className="uploader-profile">
          {uploaderInformations}
          <div className="products">
            {uploadersProducts}
          </div>
          <button className="show-more" onClick={showMoreItems}>Show more items</button>
        </div>
    )
}