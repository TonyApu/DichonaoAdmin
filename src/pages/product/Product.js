import { Publish } from "@material-ui/icons";
import { Link } from "react-router-dom";
import Chart from "../../components/chart/Chart";
import { productData } from "../../dummyData";
import "./product.css";

export default function Product() {
  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newProduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
            <Chart data={productData} dataKey="Sales" title="Sales Performance"/>
        </div>
        <div className="productTopRight">
            <div className="productInforTop">
                <img src="https://cdn.tgdd.vn/Products/Images/54/236026/airpods-pro-wireless-charge-apple-mwp22-ava-1-org.jpg" alt="" className="productInforImg"/>
                <span className="productName">Apple Airpods</span>
            </div>
            <div className="productInforBottom">
                <div className="productInforItem">
                    <span className="productInforKey">id:</span>
                    <span className="productInforValue">123</span>
                </div>
                <div className="productInforItem">
                    <span className="productInforKey">Sale:</span>
                    <span className="productInforValue">4123</span>
                </div>
                <div className="productInforItem">
                    <span className="productInforKey">active:</span>
                    <span className="productInforValue">yes</span>
                </div>
                <div className="productInforItem">
                    <span className="productInforKey">in stock:</span>
                    <span className="productInforValue">no</span>
                </div>
            </div>
        </div>
      </div>
      <div className="productBottom">
          <form className="productForm">
            <div className="productFormLeft">
                <label>Product Name</label>
                <input type="text" placeholder="Apple Airpods"/>
                <label>In Stock</label>
                <select name="inStock" id="idStock">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                <label>Active</label>
                <select name="active" id="active">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
            <div className="productFormRight">
                <div className="productUpload">
                    <img alt="" className="productUploadImg" src="https://cdn.tgdd.vn/Products/Images/54/236026/airpods-pro-wireless-charge-apple-mwp22-ava-1-org.jpg"/>
                    <label for="file">
                        <Publish/>
                    </label>
                    <input type="file" id="file" style={{display:"none"}}/>
                </div>
                <button className="productButton">Update</button>
            </div>
          </form>
      </div>
    </div>
  );
}
