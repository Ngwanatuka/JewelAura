import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUsers } from "../../services/admin";
import axios from "axios";

const Container = styled.div`
  height: 600px;
  padding: 20px;
`;

const UserList = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsers();
                setData(res);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            // In a real app, we would call an API to delete
            // await axios.delete(`/users/${id}`, ...);
            setData(data.filter((item) => item._id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const columns = [
        { field: "_id", headerName: "ID", width: 220 },
        {
            field: "user",
            headerName: "User",
            width: 200,
            renderCell: (params) => {
                return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginRight: "10px",
                            }}
                            src={
                                params.row.img ||
                                "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
                            }
                            alt=""
                        />
                        {params.row.username}
                    </div>
                );
            },
        },
        { field: "email", headerName: "Email", width: 200 },
        {
            field: "isAdmin",
            headerName: "Is Admin",
            width: 120,
            type: "boolean",
        },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={"/user/" + params.row._id}>
                            <button
                                style={{
                                    border: "none",
                                    borderRadius: "10px",
                                    padding: "5px 10px",
                                    backgroundColor: "#3bb077",
                                    color: "white",
                                    cursor: "pointer",
                                    marginRight: "20px",
                                }}
                            >
                                Edit
                            </button>
                        </Link>
                        <DeleteOutline
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={() => handleDelete(params.row._id)}
                        />
                    </>
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

export default UserList;
