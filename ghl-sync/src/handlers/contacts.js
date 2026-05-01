const mindbody = require('../mindbody/api.js');

async function handleContactCreated(contactData) {
    // console.log('handleContactCreated called with:', contactData);
    const existing = await mindbody.searchClientByEmail(contactData.email);
    // console.log('Existing client:', existing);
    
    if (existing) {
        const updates = {};
        if(contactData.first_name){
            updates.FirstName = contactData.first_name;
        }
        if(contactData.last_name){
            updates.LastName = contactData.last_name;
        }
        if(contactData.phone){
            updates.MobilePhone = contactData.phone;
        }
        if(Object.keys(updates).length > 0){
            await updateClient(existing.Id, contactData.email, updates);
        }
    }else{
        await mindbody.createClient({
            FirstName: contactData?.first_name || "Unknown",
            LastName: contactData?.last_name || "Unknown", 
            Email: contactData.email || `appt-${Date.now()}@test.com`,
            MobilePhone: contactData?.phone || "000-000-000",
            AddressLine1: "123 Default St",
            City: "Default City",
            State: "CA",
            PostalCode: "000000",
            BirthDate: "1990-01-01",
            ReferredBy: "GHL Integration"
        })
    }
}
    
    
module.exports = {
    handleContactCreated,
};


// curl -X POST https://jargon-triangle-enchilada.ngrok-free.dev/webhook \
//   -H "Content-Type: application/json" \
//   -d '{"event":"appointment.created","data":{"staff_name":"Corey Patterson","service_name":"Yoga","start_time":"2026-05-01T14:00:00"}}'