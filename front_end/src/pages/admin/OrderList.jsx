import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "../../services/admin";
import { format } from "timeago.js";

const Container = styled.div`
  height: 600px;
  padding: 20px;
`;

const OrderList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setData(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  const handleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "pending" ? "approved" : "shipped";
    try {
      const res = await updateOrder(id, nextStatus);
      setData(data.map((item) => (item._id === id ? res : item)));
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "userId",
      headerName: "User ID",
      width: 200,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <div className={`status ${params.row.status}`}>
            {params.row.status}
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 150,
      renderCell: (params) => {
        return format(params.row.createdAt);
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <button
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "5px 10px",
              backgroundColor: "#3bb077",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => handleStatus(params.row._id, params.row.status)}
          >
            Next Status
          </button>
        );
      },
    },
  ];

  return (
    <Container>
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </Container>
  );
};

export default OrderList;
