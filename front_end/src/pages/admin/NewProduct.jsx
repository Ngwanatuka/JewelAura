import styled from "styled-components";
import { useState } from "react";
import { addProduct } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";
import axios from "axios";

const Container = styled.div`
  flex: 4;
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-weight: 600;
  color: gray;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: teal;
  color: white;
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    background-color: gray;
  }
`;

const NewProduct = () => {
    const [inputs, setInputs] = useState({});
    const [file, setFile] = useState(null);
    const [cat, setCat] = useState([]);
    const dispatch = useDispatch();
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleCat = (e) => {
        setCat(e.target.value.split(","));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select an image");

        setUploading(true);
        const data = new FormData();
        data.append("img", file);

        try {
            const uploadRes = await axios.post("http://localhost:5000/api/upload", data);
            const product = { ...inputs, img: uploadRes.data.imageUrl, categories: cat };
            addProduct(product, dispatch);
            setUploading(false);
            alert("Product created successfully!");
        } catch (err) {
            console.log(err);
            setUploading(false);
        }
    };

    return (
        <Container>
            <Title>New Product</Title>
            <Form>
                <FormItem>
                    <Label>Image</Label>
                    <Input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
                </FormItem>
                <FormItem>
                    <Label>Title</Label>
                    <Input name="title" type="text" placeholder="Apple Airpods" onChange={handleChange} />
                </FormItem>
                <FormItem>
                    <Label>Description</Label>
                    <Input name="desc" type="text" placeholder="Description..." onChange={handleChange} />
                </FormItem>
                <FormItem>
                    <Label>Price</Label>
                    <Input name="price" type="number" placeholder="100" onChange={handleChange} />
                </FormItem>
                <FormItem>
                    <Label>Categories</Label>
                    <Input type="text" placeholder="jeans,skirts" onChange={handleCat} />
                </FormItem>
                <FormItem>
                    <Label>Stock</Label>
                    <Select name="inStock" onChange={handleChange}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Select>
                </FormItem>
                <Button onClick={handleClick} disabled={uploading}>
                    {uploading ? "Uploading..." : "Create"}
                </Button>
            </Form>
        </Container>
    );
};

export default NewProduct;
