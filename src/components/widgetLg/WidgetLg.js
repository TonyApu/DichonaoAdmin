import "./widgetLg.css";
import Cus_Avatar from "../../assets/cus_avatar.jpg";

export default function WidgetLg() {
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };
  return (
    <div className="widgetLg">
      {/* <h3 className="widgetLgTitle">Giao Dịch Mới Nhất</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Khách Hàng</th>
          <th className="widgetLgTh">Ngày</th>
          <th className="widgetLgTh">Giá Trị</th>
          <th className="widgetLgTh">Trạng Thái</th>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <img
              src={Cus_Avatar}
              alt=""
              className="widgetLgImg"
            />
            <span className="widgetLgName">Duy Nghiêm</span>
          </td>
          <td className="widgetLgDate">3 Feb 2022</td>
          <td className="widgetLgAmount">300.000 VNĐ</td>
          <td className="widgetLgStatus">
            <Button type="Approved" />
          </td>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <img
              src={Cus_Avatar}
              alt=""
              className="widgetLgImg"
            />
            <span className="widgetLgName">Thành Nhân</span>
          </td>
          <td className="widgetLgDate">3 Feb 2022</td>
          <td className="widgetLgAmount">126.000 VNĐ</td>
          <td className="widgetLgStatus">
            <Button type="Declined" />
          </td>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <img
              src={Cus_Avatar}
              alt=""
              className="widgetLgImg"
            />
            <span className="widgetLgName">Nhật Quang</span>
          </td>
          <td className="widgetLgDate">3 Feb 2022</td>
          <td className="widgetLgAmount">35.000 VNĐ</td>
          <td className="widgetLgStatus">
            <Button type="Pending" />
          </td>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <img
              src={Cus_Avatar}
              alt=""
              className="widgetLgImg"
            />
            <span className="widgetLgName">Minh Thìn</span>
          </td>
          <td className="widgetLgDate">3 Feb 2022</td>
          <td className="widgetLgAmount">230.000 VNĐ</td>
          <td className="widgetLgStatus">
            <Button type="Approved" />
          </td>
        </tr>
      </table> */}
    </div>
  );
}
