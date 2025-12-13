const axios = require('axios');

async function testCategories() {
    try {
        const response = await axios.get('http://localhost:5000/api/categories');
        console.log('Status:', response.status);
        console.log('Number of categories:', response.data.length);
        if (response.data.length > 0) {
            console.log('First category sample:', JSON.stringify(response.data[0], null, 2));
        } else {
            console.log('No categories found.');
        }
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
        }
    }
}

testCategories();
