import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add item to cart
    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.product_id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.product_id === product.id
                        ? { ...item, qty: item.qty + quantity }
                        : item
                );
            } else {
                return [...prevItems, {
                    product_id: product.id,
                    product: product, // Store full product details for display
                    qty: quantity,
                    shop_id: product.shop_id.id || product.shop_id // Ensure we track shop ID
                }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== id));
    };

    // Update quantity
    const updateQuantity = (id, quantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product_id === id ? { ...item, qty: quantity } : item
            )
        );
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Calculate totals
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product.discount_price > 0 ? item.product.discount_price : item.product.price;
            return total + (price * item.qty);
        }, 0);
    };

    // Calculate total items
    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.qty, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
