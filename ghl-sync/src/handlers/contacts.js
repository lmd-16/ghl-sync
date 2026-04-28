async function handleContactCreated(data) {
    const existing = await mindbody.searchClientByEmail(data.email);
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
            await updateClient(existingClient.Id, contactData.email, updates);
        }
    }else{
        await mindbody.createClient({
            FirstName: contactData?.first_name || "Unknown",
            LastName: contactData?.last_name || "Unknown", 
            Email: contactData?.email,
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
    searchClientByEmail,
    createClient,
    updateClient
};