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
                'Content-Type': 'application/json'
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
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const result = await response.json(); 
    if(result.Error){
        console.error('Mindbody error:', result.Error.Message);
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
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(fullPayLoad)
        });
        const result = await response.json();

        if(result.Error){
            console.error('Full error objectL', JSON.stringify(result.Error, null,2));
            return null;
        }else{
            return true;
        }
    }catch(error){
        console.error(error);
        return null;
    }
}

module.exports = {
    searchClientByEmail,
    createClient,
    updateClient
};