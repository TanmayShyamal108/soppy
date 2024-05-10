
import axios from 'axios';
import { useEffect, useState } from 'react';
import  Modal  from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Card , CardHeader , CardMedia , CardContent , CardActions , Fade , IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export function FakeStore() {
    const [categories,setCategories] = useState([]);
    const [products,setProducts] = useState([]);
    const [cartCount,setCartCount] = useState(0);
    const [open,setOpen] = useState(false);
    const [cartItems,setCartItems] = useState([]);
    const [totalPrice,setTotalPrice] = useState(0);

    function LoadCategories() {
        axios.get('https://fakestoreapi.com/products/categories')
        .then(response=>{
            response.data.unshift('all');
            setCategories(response.data);
        })
    }
    
    function LoadProducts(url) {
        axios.get(url)
        .then(response=>{
            setProducts(response.data);
        })
    }

    useEffect(()=>{
        LoadCategories();
        LoadProducts('https://fakestoreapi.com/products');
    },[])

    function handleCategoryChange(e) {
        if(e.target.value=='all') {
            LoadProducts('https://fakestoreapi.com/products');
        } else {
            LoadProducts(`https://fakestoreapi.com/products/category/${e.target.value}`);
        }
    }

    function handleNavClick(f) {
        if(f.target.value=='all') {
            LoadProducts('https://fakestoreapi.com/products');
        } else {
            LoadProducts(`https://fakestoreapi.com/products/category/${f.target.value}`);
        }
    }

    function handleAddClick(product) {
        setCartCount(cartCount+1);
        cartItems.push(product);
        if(totalPrice==0) {
            setTotalPrice(product.price);
        } else {
            setTotalPrice(totalPrice + product.price);
        }
    }

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleRemoveClick(item) {
        cartItems.splice(cartItems.indexOf(item),1);
        setCartCount(cartItems.length);
        setTotalPrice(totalPrice - item.price);
    }

    function handleRemoveAllClick() {
        setCartItems([]);
        setCartCount(0);
        setTotalPrice(0);
    }

    function handleLoginClick() {
        
    }
    
    return(
        <div className='container-fluid'>
            <div id='Header' className='d-flex justify-content-between bg-black text-white p-2'>
                <div className='d-flex'><ShoppingBagIcon fontSize='large' sx={{mt:1, mr:1}}/><h1 className='mt-1'>FAKESTORE</h1></div>
                <div className='mt-2'>
                    {
                        categories.map(category=> <Button key={category} component='button' value={category} onClick={handleNavClick} sx={{mx:1}} color='inherit'>{category.toUpperCase()}</Button>)
                    }
                </div>
                <div className='mt-2'>
                    <span className='bi bi-heart-fill me-4'></span>
                    <span onClick={handleLoginClick} className='bi bi-person-fill me-4'></span>
                    <button className='btn btn-warning bi bi-cart4 position-relative' onClick={handleOpen}><span className='badge position-absolute bg-danger rounded rounded-circle'>{cartCount}</span></button>
                </div>
            </div>
            <div id='Body' className='row mt-1'>
                <div className='col-2'>
                    <h3>Select Categories</h3>
                    <select className='form-select w-100' onChange={handleCategoryChange}>
                        {
                            categories.map(category=> <option key={category} value={category}>{category.toUpperCase()}</option>)
                        }
                    </select>
                </div>
                <div className='col-10 d-flex flex-wrap overflow-auto mt-5' style={{height:'700px'}}>
                    {
                        products.map(product=> 
                            <div className='card m-4 p-2' key={product.id} style={{width:"300px"}}>
                                <img src={product.image} className='card-image-top ' height="270" />
                                <div className='card-header fw-bold' style={{height:"100px"}}>{product.title}</div>
                                <div className='card-body d-flex justify-content-between'>
                                    <dl>
                                        <dt>Price</dt>
                                        <dd className='mt-1'><span className='bi bi-currency-dollar'></span>{product.price}</dd>
                                    </dl>
                                    <dl>
                                        <dt>Rating</dt>
                                        <dd className='m-1'>{product.rating.rate}<span className='bi bi-star-fill text-success ms-1'></span></dd>
                                    </dl>
                                </div>
                                <div className='card-footer'>
                                    <button className='btn btn-dark bi bi-cart4 w-100' onClick={()=>handleAddClick(product)}>Add to Cart</button>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div>
                    <Modal open={open} onClose={handleClose} className='d-flex justify-content-center align-items-center'>
                        <Fade in={open}>
                            <div className='modal-content modal-dialog-scrollable bg-white h-75 w-75'>
                                <div className='modal-header bg-black p-3 d-flex justify-content-between text-white border-bottom border-2'>
                                    <h3>Cart Items<span className='bi bi-cart3 mx-1'></span></h3>
                                    <button onClick={handleClose} className='btn btn-danger me-2 p-1'><span className='bi bi-x-lg mx-1'></span></button>
                                </div>
                                <div className='modal-body'>
                                    {
                                       cartItems.map(item=>
                                            <Card sx={{maxHeight:400, display:'flex',width:1170 }}  className='m-2' key={item.id}>
                                                <CardMedia component='img' image={item.image} height='200' sx={{width:300}} classes={{height:'auto', width:'100%'}}/>
                                                <CardHeader title={item.title} action={<IconButton color='error'onClick={()=>handleRemoveClick(item)}><Delete fontSize='medium'/></IconButton>} sx={{width:873}} subheader={item.description} />
                                            </Card>
                                       ) 
                                    }
                                </div>
                                <div className='modal-footer d-flex justify-content-between bg-black  border-top border-2 p-2'>
                                    <div className=' d-flex text-white ps-3'>
                                        <div className=' modal-header '>Total Amount :</div>
                                        <div className='ms-3'>
                                            <span className='bi bi-currency-dollar'></span>
                                            {totalPrice.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <button className='btn btn-danger mx-2' onClick={handleRemoveAllClick}>Remove All</button>
                                        <button className='btn btn-success'>Proceed To Buy</button>
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </Modal>
                </div>
            </div>
        </div>
    )
}