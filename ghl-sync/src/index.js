// require('dotenv').config();

// const express = require('express');
// const app = express();
// const port = 3000;

const { handleContactCreated, handleContactUpdated } = require('./handlers/contacts.js');
app.use(express.json());

app.post('/webhook', async (req, res) => {
    const {event, data} = req.body; 
    res.sendStatus(200);

    try {
        switch(event){
            case 'contact.created':
                await handleContactCreated(data);
                break;
            case 'contact.updated': 
                await handleContactUpdated(data);
                break;
            case 'contact.merge':
                await handleContactMerge(data);
                break;
            case 'contact.search':
                await handleSearchClientByEmail(data);
                break;
            case 'appointment.created':
                await handleAppointmentCreated(data);
                break;
            case 'appointment.updated':
                await handleAppointmentUpdated(date);
            case 'class.search':
                await handleClassSearch(data);
            case 'class.addClient':
                await handleClassAddClient(data);
            case 'class.removeClient':
                await handleClassRemoveClient(data);
            default:
                console.log(`Unknown event: ${event}`);
        }
    }catch (error){
        console.error(`Error processing ${event}`,error);

    }
});

    app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
