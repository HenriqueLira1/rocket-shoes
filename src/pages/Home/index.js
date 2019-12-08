import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { useSelector, useDispatch } from 'react-redux';
import { addToCartRequest } from '../../store/modules/cart/actions';

import api from '../../services/api';
import { formatPrice } from '../../util/format';
import { ProductList } from './styles';

export default function Home() {
    const [products, setProducts] = useState([]);
    const amount = useSelector(state =>
        state.cart.reduce((sumAmount, product) => {
            sumAmount[product.id] = product.amount;

            return sumAmount;
        }, {})
    );

    const dispatch = useDispatch();

    useEffect(() => {
        async function loadProducts() {
            const reponse = await api.get('products');

            const products = reponse.data.map(product => ({
                ...product,
                formattedPrice: formatPrice(product.price),
            }));

            setProducts(products);
        }
        loadProducts();
    }, []);

    function handleAddProduct(id) {
        dispatch(addToCartRequest(id));
    }

    return (
        <ProductList>
            {products.map(product => (
                <li key={product.id}>
                    <img src={product.image} alt={product.title} />
                    <strong>{product.title}</strong>
                    <span>{product.formattedPrice}</span>

                    <button
                        type="button"
                        onClick={() => handleAddProduct(product.id)}
                    >
                        <div>
                            <MdAddShoppingCart size={16} color="#fff" />{' '}
                            {amount[product.id] || 0}
                        </div>

                        <span>ADICIONAR AO CARRINHO</span>
                    </button>
                </li>
            ))}
        </ProductList>
    );
}
