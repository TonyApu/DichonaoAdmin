import "antd/dist/antd.css";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./app.css";
import Home from "./pages/home/Home";
import { Route, Routes } from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/user";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import RequestList from "./pages/requestList/RequestList";
import CampaignList from "./pages/campaignList/CampaignList";
import Campaign from "./pages/campaign/Campaign";
import NewCampaign from "./pages/newCampaign/NewCampaign";
import FarmRequestList from "./pages/farmRequestList/FarmRequestList";
import HarvestCampaignList from "./pages/harvestCampaignList/HarvestCampaignList";
import ProductDetail from "./pages/productDetail/ProductDetail";
import CustomerList from "./pages/customerList/CustomerList";
import FarmerList from "./pages/farmerList/FarmerList";
import DriverList from "./pages/delivererList/DriverList";
import DeliveryManagerList from "./pages/deliveryManagerList/DeliveryManagerList";
import NewManager from "./pages/newManager/NewManager";
import PrivateRoute from "./router/PrivateRoute";
import { useSelector } from "react-redux";
import WareHouseList from "./pages/warehouseList/WareHouseList";
import WareHouse from "./pages/wareHouse/WareHouse";
import NewWareHouse from "./pages/newWareHouse/NewWareHouse";
import FarmHarvest from "./components/farmHarvest/FarmHarvest";
import CampaignDetail from "./pages/campaignDetail/CampaignDetail";
import CampaignRevenue from "./pages/campaignRevenue/CampaignRevenue";
import FarmRevenue from "./pages/farmRevenue/FarmRevenue";
import FarmOrderRevenue from "./pages/farmOrderRevenue/FarmOrderRevenue";
import FarmerRevenue from "./pages/farmerRevenue/FarmerRevenue";

function App() {
  const user = useSelector((state) => state.user);
  return (
    <>
      {user !== null ? <Topbar /> : null}
      <div className="container">
        {user !== null ? <Sidebar /> : null}
        <Routes>
          <Route
            exact
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/customer"
            element={
              <PrivateRoute>
                <CustomerList />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/farmer"
            element={
              <PrivateRoute>
                <FarmerList />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/driver"
            element={
              <PrivateRoute>
                <DriverList />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/warehouseManager"
            element={
              <PrivateRoute>
                <DeliveryManagerList />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/user/:role/:userId"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/newUser"
            element={
              <PrivateRoute>
                <NewUser />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductList />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/newProduct"
            element={
              <PrivateRoute>
                <NewProduct />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <RequestList />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/campaigns"
            element={
              <PrivateRoute>
                <CampaignList />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/campaign/:campaignId"
            element={
              <PrivateRoute>
                <Campaign />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/newCampaign"
            element={
              <PrivateRoute>
                <NewCampaign />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/request/:campaignId"
            exact
            element={
              <PrivateRoute>
                <FarmRequestList />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/request/:campaignId/:farmId"
            element={
              <PrivateRoute>
                <HarvestCampaignList />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/product/edit/:productId"
            element={
              <PrivateRoute>
                <ProductDetail />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/newManager"
            element={
              <PrivateRoute>
                <NewManager />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/wareHouses"
            element={
              <PrivateRoute>
                <WareHouseList />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/wareHouse/detail/:wareHouseId"
            element={
              <PrivateRoute>
                <WareHouse/>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/newWareHouse"
            element={
              <PrivateRoute>
                <NewWareHouse/>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/campaign/:campaignId/:farmId"
            element={
              <PrivateRoute>
                <FarmHarvest/>
              </PrivateRoute>
            }
          ></Route>
           <Route
            path="/campaign/edit/:campaignId"
            element={
              <PrivateRoute>
                <CampaignDetail/>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/revenue" exact
            element={
              <PrivateRoute>
                <CampaignRevenue/>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/revenue/:campaignId"
            element={
              <PrivateRoute>
                <FarmRevenue/>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/revenue/:campaignId/:farmId"
            element={
              <PrivateRoute>
                <FarmOrderRevenue/>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/statistical"
            element={
              <PrivateRoute>
                <FarmerRevenue/>
              </PrivateRoute>
            }
          ></Route>
        </Routes>
        
      </div>
    </>
  );
}

export default App;
