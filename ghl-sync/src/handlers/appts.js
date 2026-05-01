const mindbody = require('../mindbody/api.js');


async function handleAppointmentCreated(data){
    try {
        // console.log('=== handleAppointmentCreated received ===');
        // console.log('Do I have calendar?', !!data.calendar);
        // console.log('Do I have location?', !!data.location);
        // console.log('What keys do I have?', Object.keys(data));
        // console.log('calendar.title:', data.calendar?.title);
        let clientId = null;
        const response = await mindbody.searchClientByEmail(data.email);
        console.log('test1');
        if(response){
            clientId = response.Id
        }else{
            const newClientId = await mindbody.createClient({
            FirstName: data.first_name,
            LastName: data.last_name, 
            Email: data.email || `appt-${Date.now()}@test.com`,
            MobilePhone: data.phone || "000-000-000",
            AddressLine1: "123 Default St",
            City: "Default City",
            State: "CA",
            PostalCode: "000000",
            BirthDate: "1990-01-01",
            ReferredBy: "GHL Integration"
            });
            clientId = newClientId;
            console.log('Created new client:', clientId);
        }

        const staffName = data.calendar?.created_by;
        const locationName = data.location?.name;
        const sessionName = data.calendar?.title;
        const startTime = data.calendar?.startTime;
        const endTime = data.calendar?.endTime;

        const staffId = await mindbody.getStaffIdByName(staffName);
        const locationId = await mindbody.getLocationIdByName(locationName);
        // console.log('Looking for session name:', sessionName);
        const sessionId = await mindbody.getSessionIdByName(sessionName);
        
        if (!clientId || !staffId || !locationId || !sessionId) {
            console.error('Missing required IDs:', { clientId, staffId, locationId, sessionId });
            return null;
        }
        const appointmentResult = await mindbody.createAppointment({
            ClientId: clientId,
            StaffId: staffId,
            LocationId: locationId,
            SessionTypeId: sessionId,
            StartDateTime: startTime,
            EndDateTime: endTime
        });
        console.log("Appointment created:", appointmentResult);
        return appointmentResult;
    // console.log('Would create appointment with:', {
    //     clientId, staffId, locationId, sessionId, startTime, endTime
    // });
    // return { clientId, staffId, locationId, sessionId };
    }catch(error){
        console.error('Error in handleAppointmentCreated:', error.message);
        console.error('Full error:', error);
        return null;
    }
}

async function handleAppointmentUpdated(data){
    try{
        console.log('Appointment update requested:', data);
    
    const filters = {
        ClientId: data.client_id,
        StartDate: data.start_date,
        EndDate: data.end_date
    };
    const appointments = await mindbody.searchAppointments(filters);
    if(!appointments || appointments.length == 0){
        console.error('Appointment not found for update');
        return null;
    }
    const appointment = appointments[0];

    const updates = {};
    if(data.start_time) updates.StartDateTime = data.start_time;
    if(data.end) updates.EndDateTimeDateTime = data.end_time;
    if(data.status) updates.Status = data.status;

    if(Object.keys(updates).length === 0){
        console.log('No updates to apply');
        return appointment.Id;
    }
    const result = await mindbody.updateAppointment(appointment.Id, updates);
    if(result){
        console.log('Appointment updated successfully');
    }
    return result;
    }catch(error){
        console.error('Error in handleAppointmentUpdates:', error.message);
        return null;

    }
}

module.exports = {
    handleAppointmentCreated,
    handleAppointmentUpdated
};

