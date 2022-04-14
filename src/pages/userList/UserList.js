import "./userList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline, Visibility } from "@material-ui/icons";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function UserList() {
  const [data, setData] = useState(userRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "username",
      headerName: "Tài Khoản",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="userListImage" src={params.row.avatar} alt="" />
            {params.row.username}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "phone",
      headerName: "Số Điện Thoại",
      width: 170,
    },
    {
      field: "status",
      headerName: "Trạng Thái",
      width: 150,
    },
    {
      field: "action",
      headerName: " ",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link className="link" to={"/user/" + params.row.id}>
              <button className="userListEdit">
                <Visibility className="userListIcon" />
                Display
              </button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={8}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}
