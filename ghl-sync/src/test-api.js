// test-api.js
require('dotenv').config();
const { searchClientByEmail, createClient, updateClient } = require('./mindbody/api.js');

async function runTests() {
    console.log('=== Testing Mindbody API Functions ===\n');
    
    // Test 1: Create a client
    console.log('Test 1: Creating a client...');
    const newClient = await createClient({
        FirstName: "Test",
        LastName: "Function",
        Email: "test.function@example.com",
        MobilePhone: "555-000-1111",
        AddressLine1: "123 Test St",
        City: "Test City",
        State: "CA",
        PostalCode: "12345",
        BirthDate: "1990-01-01",
        ReferredBy: "API Test"
    });
    console.log('Create result:', newClient);
    
    // Test 2: Search for that client by email
    console.log('\nTest 2: Searching for client by email...');
    const found = await searchClientByEmail("test.function@example.com");
    console.log('Search result:', found ? `Found: ${found.FirstName} ${found.LastName} (ID: ${found.Id})` : 'Not found');
    
    // Test 3: Update the client
    console.log('\nTest 3: Updating client...');
    const updated = await updateClient(newClient, {
        MobilePhone: "555-999-8888"
    });
    console.log('Update result:', updated);
    
    // Test 4: Verify the update worked
    console.log('\nTest 4: Verifying update...');
    const verified = await searchClientByEmail("test.function@example.com");
    console.log('Verified phone:', verified?.MobilePhone);
}

runTests().catch(console.error);