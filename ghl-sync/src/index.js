require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const { handleContactCreated, handleContactUpdated } = require('./handlers/contacts.js');
const { handleAppointmentCreated, handleAppointmentUpdated } = require('./handlers/appts.js');

app.post('/webhook', async (req, res) => {
    console.log('Received webhook:', JSON.stringify(req.body, null, 2));
    try {
        if(req.body.event){
            const {event, data} = req.body; 
            res.sendStatus(200);
            switch(event){
                case 'contact.created':
                    await handleContactCreated(data);
                    break;
                case 'contact.updated': 
                    await handleContactUpdated(data);
                    break;
                case 'appointment.created':
                    await handleAppointmentCreated(data);
                    break;
                case 'appointment.updated':
                    await handleAppointmentUpdated(data);
                    break;
                default:
                    console.log(`Unknown event: ${event}`);
                    console.log('Full webhook for inspection:', JSON.stringify(req.body, null, 2));
            } 
        }else if(req.body.calendar && req.body.calendar.appointmentId){
            res.sendStatus(200);
            await handleAppointmentCreated(req.body);
        }else{
                console.log(`Unknown webhook format`);
                res.sendStatus(200);
            }        
        }catch (error){
        console.error(`Error processing`,error);

    }
});

    app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
