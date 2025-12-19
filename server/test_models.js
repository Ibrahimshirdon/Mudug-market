try {
    console.log('Testing model loading...');
    require('./models/User');
    console.log('✅ User model loaded');
    require('./models/Shop');
    console.log('✅ Shop model loaded');
    require('./models/Product');
    console.log('✅ Product model loaded');
    require('./models/Category');
    console.log('✅ Category model loaded');
    require('./models/ActivityLog');
    console.log('✅ ActivityLog model loaded');
    require('./models/Report');
    console.log('✅ Report model loaded');
    require('./models/Notification');
    console.log('✅ Notification model loaded');
    require('./models/Favorite');
    console.log('✅ Favorite model loaded');
    require('./models/Transaction');
    console.log('✅ Transaction model loaded');
    require('./models/Fine');
    console.log('✅ Fine model loaded');
    console.log('🎉 All models loaded successfully!');
} catch (error) {
    console.error('❌ Model loading failed:', error.message);
    console.error(error.stack);
}
