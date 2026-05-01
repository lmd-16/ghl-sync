// test-api.js
require('dotenv').config();
const { searchClientByEmail, createClient, updateClient, getStaffIdByName, getSessionIdByName, getLocationIdByName } = require('./mindbody/api.js');

async function runTests() {
    const locationData = await fetch('https://api.mindbodyonline.com/public/v6/class/addclienttoclass',{
        method: 'POST',
        headers: {
            'API-Key': process.env.MINDBODY_API_KEY,
            'SiteId': process.env.MINDBODY_SITE_ID,
            'Content-Type': 'application/json'
        },
        body: {
            ClientId: 
        }
    });
    const locationResponse = await locationData.json(); 
    console.log(locationResponse)


    // const foundId = await getLocationIdByName("Fitville");
    // console.log("Found location ID:", foundId);

//     const testClient = await createClient({
//        FirstName: "Appointment",
//     LastName: "Test",
//     Email: `appt-${Date.now()}@test.com`,
//     MobilePhone: "555-000-0000",
//     AddressLine1: "123 Test St",
//     City: "Test City",
//     State: "CA",
//     PostalCode: "12345",
//     BirthDate: "1990-01-01",
//     ReferredBy: "Appointment Test"
// });
//     console.log("New client", testClient)
//     try{
//         const appointmentData = {
//             ClientId: 100015647,
//             StaffId: 100000279,
//             LocationId: 1, 
//             SessionTypeId: 266, 
//             StartDateTime: "2026-04-30T14:00:00", 
//             EndDateTime: "2026-04-30T15:00:00" 

//         }
//         const response = await fetch('https://api.mindbodyonline.com/public/v6/appointment/addappointment', {
//         method:'POST',
//         headers: {
//             'API-Key': process.env.MINDBODY_API_KEY,
//             'SiteId': process.env.MINDBODY_SITE_ID,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(appointmentData)
//         });
//         const result = await response.json();
//         console.log("Appointment result: ", result);
//     }catch(error){
//         console.error(error)
//     }
    // const response = await fetch('https://api.mindbodyonline.com/public/v6/class/classes', {
    //     method:'GET',
    //     headers: {
    //         'API-Key': process.env.MINDBODY_API_KEY,
    //         'SiteId': process.env.MINDBODY_SITE_ID,
    //         'Content-Type': 'application/json'
    //     },
    //     });
    //     const result = await response.json();
    //     console.log(JSON.stringify(result, null, 2));
    
    // const response = await fetch('https://api.mindbodyonline.com/public/v6/site/sessiontypes', {
    //     method:'GET',
    //     headers: {
    //         'API-Key': process.env.MINDBODY_API_KEY,
    //         'SiteId': process.env.MINDBODY_SITE_ID,
    //         'Content-Type': 'application/json'
    //     },
    //     });
    //     const result = await response.json();
    //     console.log("Appointment result: ", result);
    
    // console.log('=== Testing Mindbody API Functions ===\n');
    
    // // Test 1: Create a client
    // console.log('Test 1: Creating a client...');
    // const newClient = await createClient({
    //     FirstName: "Test",
    //     LastName: "Function",
    //     Email: "test.function@example.com",
    //     MobilePhone: "555-000-1111",
    //     AddressLine1: "123 Test St",
    //     City: "Test City",
    //     State: "CA",
    //     PostalCode: "12345",
    //     BirthDate: "1990-01-01",
    //     ReferredBy: "API Test"
    // });
    // console.log('Create result:', newClient);
    
    // // Test 2: Search for that client by email
    // console.log('\nTest 2: Searching for client by email...');
    // const found = await searchClientByEmail("test.function@example.com");
    // console.log('Search result:', found ? `Found: ${found.FirstName} ${found.LastName} (ID: ${found.Id})` : 'Not found');
    
    // // Test 3: Update the client
    // console.log('\nTest 3: Updating client...');
    // const updated = await updateClient(newClient, {
    //     MobilePhone: "555-999-8888"
    // });
    // console.log('Update result:', updated);
    
    // // Test 4: Verify the update worked
    // console.log('\nTest 4: Verifying update...');
    // const verified = await searchClientByEmail("test.function@example.com");
    // console.log('Verified phone:', verified?.MobilePhone);
}

runTests().catch(console.error);

// curl -X POST "https://api.mindbodyonline.com/public/v6/client/addclient" \
//   -H "API-Key: f390cc3aecee489f803e2f567ba99519" \
//   -H "SiteId: -99" \
//   -H "Content-Type: application/json" \
//   -d '{
//     "FirstName": "Class",
//     "LastName": "Test",
//     "Email": "classtest-'$(date +%s)'@test.com",
//     "AddressLine1": "123 Test St",
//     "City": "Test City",
//     "State": "CA",
//     "PostalCode": "12345",
//     "MobilePhone": "555-000-1234",
//     "BirthDate": "1990-01-01",
//     "ReferredBy": "API Test"
//   }'

// curl -X POST "https://api.mindbodyonline.com/public/v6/class/addclienttoclass" \
//   -H "API-Key: f390cc3aecee489f803e2f567ba99519" \
//   -H "SiteId: -99" \
//   -H "Content-Type: application/json" \
//   -d '{
//     "ClientId": 100015644,
//     "ClassId": 19114,
//     "LocationId": 1
//   }'

// curl -X GET "https://api.mindbodyonline.com/public/v6/staff/staff" \
//   -H "API-Key: f390cc3aecee489f803e2f567ba99519" \
//   -H "SiteId: -99"

// # Try ClassId 20384 (Yoga)
// curl -X POST "https://api.mindbodyonline.com/public/v6/class/addclienttoclass" \
//   -H "API-Key: f390cc3aecee489f803e2f567ba99519" \
//   -H "SiteId: -99" \
//   -H "Content-Type: application/json" \
//   -d '{"ClientId": 100015644, "ClassId": 20384, "LocationId": 1}'

// # First, search for classes happening today or tomorrow
// curl -X GET "https://api.mindbodyonline.com/public/v6/class/classes" \
//   -H "API-Key: f390cc3aecee489f803e2f567ba99519" \
//   -H "SiteId: -99" \
//   -H "Content-Type: application/json"

// curl -X POST "https://api.mindbodyonline.com/public/v6/class/addclienttoclass" \
//   -H "API-Key: f390cc3aecee489f803e2f567ba99519" \
//   -H "SiteId: -99" \
//   -H "Content-Type: application/json" \
//   -d '{
//     "ClientId": :100000058,
//     "ClassId": THE_CLASS_ID_FROM_SEARCH,
//     "LocationId": 1
//   }'

//   curl -X POST "https://api.mindbodyonline.com/public/v6/class/addclienttoclass" \
//   -H "API-Key: f390cc3aecee489f803e2f567ba99519" \
//   -H "SiteId: -99" \
//   -H "Content-Type: application/json" \
//   -d '{
//     "ClientId": 100015644,
//     "ClassId": 22967,
//     "LocationId": 1
//   }'