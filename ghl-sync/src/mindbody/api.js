require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;


async function searchClientByEmail(email){
    try {
        const response = await fetch(`https://api.mindbodyonline.com/public/v6/client/clients?Email=${email}`, {
            method: 'GET',
                headers: {
                'API-Key': process.env.MINDBODY_API_KEY,
                'SiteId': process.env.MINDBODY_SITE_ID,
                'Content-Type': 'application/json',
                'demoMode': true
        },
    });
    const result = await response.json(); 
    if(result.error){
        console.error('Mindbody error:', result.Error.Message);
        return null;
    }

    if(result.Clients && result.Clients.length > 0){
        return result.Clients[0];
    } 
        return null;
    }catch(error){
        console.error(error);
        return null;
    }
}

async function createClient(payload){
    try {
        const response = await fetch(`https://api.mindbodyonline.com/public/v6/client/addclient`, {
        method: 'POST',
            headers: {
            'API-Key': process.env.MINDBODY_API_KEY,
            'SiteId': process.env.MINDBODY_SITE_ID,
            'Content-Type': 'application/json',
            "test": true
        },
        body: JSON.stringify(payload)
    });
    const result = await response.json(); 
    if(result.Error){
        console.error('Mindbody error:', result.Error.Message);
        if(result.Error.Code === 'DuplicateEmail' || result.Error.Code === 'DuplicateEmail') {
            console.log('Duplicate detected, searching for existing client...');
            
            const existing = await searchClientByEmail(payload.Email);
            if(existing){
                console.log('Found existing client with ID:', existing.Id);
            }
            return existing.Id;
        }
        return null;
    }else{
        return result.Client.Id;
    }

    }catch(error){
        console.error(error);
        return null;
    }

}

async function updateClient(clientId, email, updates){
    try {
        const existing = await searchClientByEmail(email);
        if(!existing){
            console.error('Cannot update: Client not found');
            return null;
        }
        const fullPayLoad = {
            Id: clientId,
            FirstName: existing.FirstName,
            LastName: existing.LastName, 
            Email: existing.Email, 
            MobilePhone: existing.MobilePhone, 
            AddressLine1: existing.AddressLine1,
            City: existing.City,
            State: existing.State,
            PostalCode: existing.PostalCode,
            BirthDate: existing.BirthDate,
            ReferredBy: existing.ReferredBy,
            ...updates
        };
        const body = {
            Id: clientId, 
            ...updates
        };
        const response = await fetch(`https://api.mindbodyonline.com/public/v6/client/updateclient`, {
            method:'POST',
            headers: {
            'API-Key': process.env.MINDBODY_API_KEY,
            'SiteId': process.env.MINDBODY_SITE_ID,
            'Content-Type': 'application/json',
            "test": true
            },
            body: JSON.stringify(fullPayLoad)
        });
        const result = await response.json();

        if(result.Error){
            console.error('Full error object', JSON.stringify(result.Error, null,2));
            return null;
        }else{
            return true;
        }
    }catch(error){
        console.error(error);
        return null;
    }
}

async function getStaffIdByName(staffName){
    try{
    const staffData = await fetch('https://api.mindbodyonline.com/public/v6/staff/staff', {
        method: 'GET',
        headers: {
            'API-Key': process.env.MINDBODY_API_KEY,
            'SiteId': process.env.MINDBODY_SITE_ID,
            'Content-Type': 'application/json',
            'demoMode': true
        
        },
    });
    const responseData = await staffData.json();
    const staffArray = responseData.StaffMembers || [];

    for(let i = 0; i < staffArray.length; i++){  
        if(staffArray[i].DisplayName.toLowerCase() === staffName.toLowerCase()){            
            return staffArray[i].Id;

        }
    }
    return null;
    }catch(error){
        console.error(error);
        return null;
    }

}

async function getSessionIdByName(sessionName){
    try{
        const sessionData = await fetch('https://api.mindbodyonline.com/public/v6/site/sessiontypes',{
            method: 'GET',
            headers: {
                'API-Key': process.env.MINDBODY_API_KEY,
                'SiteId': process.env.MINDBODY_SITE_ID,
                'Content-Type': 'application/json',
                'demoMode': true
            }
        })
        const responseSession = await sessionData.json();
        const sessionArray = responseSession.SessionTypes || [];
        for(let i = 0; i < sessionArray.length; i++){  
            if(sessionArray[i].Name === sessionName){            
                return sessionArray[i].Id;
            }
        }
        return null;
        }catch(error){
            console.error(error);
            return null;
        }
            
        
}
async function getLocationIdByName(locationName){
    try{
        const locationData = await fetch('https://api.mindbodyonline.com/public/v6/site/locations',{
            method: 'GET',
            headers: {
                'API-Key': process.env.MINDBODY_API_KEY,
                'SiteId': process.env.MINDBODY_SITE_ID,
                'Content-Type': 'application/json',
                'demoMode': true
            }
        });

        const locationResponse = await locationData.json(); 
        const locationArray = locationResponse.Locations || [];
        
        for(let i = 0; i < locationArray.length; i++){  
            if(locationArray[i].Name.toLowerCase() === locationName.toLowerCase()){            
                return locationArray[i].Id;
            }
        }
        return null;

    }catch(error){
        console.error(error);
        return null;
    }

}

async function createAppointment(appointmentData){
    try{
        const apptData = await fetch('https://api.mindbodyonline.com/public/v6/appointment/addappointment', {
            method: 'POST',
            headers: {
                'API-Key': process.env.MINDBODY_API_KEY,
                'SiteId': process.env.MINDBODY_SITE_ID,
                'Content-Type': 'application/json',
                "test": true
            },
            body: JSON.stringify(appointmentData)
        })
        const apptResponse = await apptData.json();
        if(apptResponse.Error){
            console.error('Appointment error:', apptResponse.Error.Message);
            return null;
        }
        console.log('Appointment created:', apptResponse);
        return apptResponse.Appointment?.Id || null;

    }catch(error){
        console.error(error);
        return null;
    }
}
async function updateAppointment(appointmentId, updates){
    try{
        const payLoad = {
            Id: appointmentId,
            ...updates
        }
        const existing = await fetch('https://api.mindbodyonline.com/public/v6/appointment/updateappointment',{
            method: 'POST',
            headers: {
                'API-Key': process.env.MINDBODY_API_KEY,
                'SiteId': process.env.MINDBODY_SITE_ID,
                'Content-Type': 'application/json',
                "test": true
            },
            body: JSON.stringify(payLoad)
        })
        const result = await response.json();

        if(result.Error){
            console.error('Full error object', JSON.stringify(result.Error, null,2));
            return null;
        }else{
            return result.Appointment?.Id || true;
        }

    }catch(error){
        console.error(error);
        return null;
    }
}
async function searchAppointments(filters){
    try{
        const queryParams = new URLSearchParams();
        if(filters.clientId) queryParams.append('ClientId', filters.ClientId);
        if(filters.StaffId) queryParams.append('StaffId', filters.StaffId);
        if(filters.LocationId) queryParams.append('LocationId', filters.LocationId);
        if(filters.StartDate) queryParams.append('StartDate', filters.StartDate);
        if(filters.EndDate) queryParams.append('EndDate', filters.EndDate);

        const url = `https://api.mindbodyonline.com/public/v6/appointment/appointments?${queryParams.toString()}`;
        const appointmentData = await fetch(url, {
         method: 'GET',
            headers: {
                'API-Key': process.env.MINDBODY_API_KEY,
                'SiteId': process.env.MINDBODY_SITE_ID,
                'Content-Type': 'application/json',
                'demoMode': true
            }
        })
        const response = await appointmentData.json();
        if(response.Error){
            console.error('Search appointments error:', response.Error.Message);
            return [];
        }
        return response.Appointments || [];
    }catch(error){
        console.error('Search appointments error:', error.message);
        return [];
    }
}
async function getClassById(classId){
    try {
        const url = `https://api.mindbodyonline.com/public/v6/class/classes?ClassId=${classId}`;
        const classData = await fetch(url, {
            method: 'GET',
            headers: {
                'API-Key': process.env.MINDBODY_API_KEY,
                'SiteId': process.env.MINDBODY_SITE_ID,
                'Content-Type': 'application/json',
                'demoMode': true
                
            }
        })
        const response = await classData.json();
        if(response.Error){
            console.log('Get class error:', response.Error.Message);
            return null;
        }
        return response.Classes?.[0] || null;

    }catch(error){
        console.error(error.message);
        return null;
    }
}

async function searchClasses(filters){
    try{
        const queryParams = new URLSearchParams();
        if(filters.StartDate) queryParams.append('StartDate', filters.StartDate);
        if(filters.EndDate) queryParams.append('EndDate', filters.EndDate);
        if(filters.LocationId) queryParams.append('LocationId', filters.LocationId);
        if(filters.ProgramId) queryParams.append('ProgramId', filters.ProgramId);
        
        const url = `https://api.mindbodyonline.com/public/v6/class/classes?${queryParams.toString()}`;
        const searchClassData = await fetch(url, {
            method: 'GET', 
            headers: {
                'API-Key': process.env.MINDBODY_API_KEY,
                'SiteId': process.env.MINDBODY_SITE_ID,
                'Content-Type': 'application/json',
                'demoMode': true
              
            }
        })
        const response = await searchClassData.json();
        if(response.Error){
            console.error('Search class error:', response.Error.Message);
            return [];
        }
        return response.Classes || [];
    }catch(error){
        console.error('Search class error:', error.message);
        return null;
    }
}
async function addClientToClass(clientId, classId, locationId){
    try{
        const addClient = await fetch('https://api.mindbodyonline.com/public/v6/class/addclienttoclass', {
            method:'POST',
            headers: {
                'API-Key': process.env.MINDBODY_API_KEY,
                'SiteId': process.env.MINDBODY_SITE_ID,
                'Content-Type': 'application/json',
                "test": true
            },
            body: JSON.stringify({
                ClientId: clientId,
                ClassId: classId, 
                LocationId: locationId
            })
        })
        const response = await addClient.json();
        if(response.Error){
            console.error('Error adding client to class:', response.Error.Message);
            return false;
        }
        return response.Booking?.Id || true;

        
    }catch(error){
        console.error('Add client to class error:', error);
        return false;
    }

}
async function removeClientFromClass(clientId, classId, locationId){
    try{
        const removeClient = await fetch('https://api.mindbodyonline.com/public/v6/class/removeclientfromclass', {
            method:'POST',
            headers: {
                'API-Key': process.env.MINDBODY_API_KEY,
                'SiteId': process.env.MINDBODY_SITE_ID,
                'Content-Type': 'application/json',
                "test": true
            },
            body: JSON.stringify({
                ClientId: clientId,
                ClassId: classId, 
                LocationId: locationId
            })
        })
        const response = await addClient.json();
        if(response.Error){
            console.error('Error adding client to class:', response.Error.Message);
            return false;
        }
        return response.Booking?.Id || true;

    }catch(error){
        console.error('Remove client from class error:', error);
        return false;
    }
}

async function disconnectConsumer(){
    try{
        const disconnectCall = await fetch('https://api.mindbodyonline.com/public/v6/client/disconnectconsumer', {
            method: 'POST',
            headers: {
                'API-Key': process.env.MINDBODY_API_KEY,
                'SiteId': process.env.MINDBODY_SITE_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

            })
        })

    }catch(error){
        console.error(error);
        return null;
    }
}

module.exports = {
    searchClientByEmail,
    createClient,
    updateClient,
    getStaffIdByName,
    getSessionIdByName,
    getLocationIdByName,
    createAppointment,
    updateAppointment, 
    searchAppointments,
    getClassById,
    searchClasses,
    addClientToClass,
    removeClientFromClass
};

// curl -X GET "https://api.mindbodyonline.com/public/v6/class/classes?StartDate=2026-05-01&EndDate=2026-05-31" \
//   -H "API-Key: f390cc3aecee489f803e2f567ba99519" \
//   -H "SiteId: -99"