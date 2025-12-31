const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { orderItems, paymentMethod, shippingAddress } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Group items by shop to create separate orders per shop (MongoDB style)
        const itemsByShop = orderItems.reduce((acc, item) => {
            let shopId = item.shop_id || (item.product ? item.product.shop_id : null);

            if (shopId && typeof shopId === 'object') {
                shopId = shopId._id || shopId.id;
            }

            if (!shopId) return acc;
            if (!acc[shopId]) acc[shopId] = [];
            acc[shopId].push(item);
            return acc;
        }, {});

        const createdOrders = [];

        for (const shopId of Object.keys(itemsByShop)) {
            const shopItems = itemsByShop[shopId];

            // Format items for embedding
            const itemsToEmbed = shopItems.map(item => {
                const finalPrice = item.product.discount_price > 0 ? item.product.discount_price : item.product.price;
                return {
                    product_id: item.product_id || item.product._id,
                    name: item.product.name,
                    quantity: item.qty,
                    price: finalPrice,
                    image_url: item.product.images && item.product.images.length > 0 ? item.product.images[0].image_url : null
                };
            });

            const shopTotal = itemsToEmbed.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const order = new Order({
                user_id: req.user._id,
                shop_id: shopId,
                items: itemsToEmbed,
                total_amount: shopTotal,
                payment_method: paymentMethod,
                payment_status: paymentMethod === 'online' ? 'paid' : 'pending',
                status: 'pending',
                shipping_address: shippingAddress,
                phone: shippingAddress ? shippingAddress.phone : null
            });

            const createdOrder = await order.save();
            createdOrders.push(createdOrder._id);

            // Decrease stock logic
            for (const item of itemsToEmbed) {
                await Product.findByIdAndUpdate(item.product_id, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        res.status(201).json({ message: 'Order created', orderIds: createdOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user._id })
            .populate('shop_id', 'name logo_url')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get orders for a shop (Seller)
// @route   GET /api/orders/shop/:shopId
// @access  Private/Seller
exports.getShopOrders = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner_id: req.user._id });

        if (!shop || shop._id.toString() !== req.params.shopId) {
            return res.status(401).json({ message: 'Not authorized to view these orders' });
        }

        const orders = await Order.find({ shop_id: req.params.shopId })
            .populate('user_id', 'name email phone')
            .sort('-createdAt');

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Seller/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check authorization (Shop owner or Admin)
        if (req.user.role !== 'admin') {
            const shop = await Shop.findOne({ owner_id: req.user._id });
            if (!shop || shop._id.toString() !== order.shop_id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
