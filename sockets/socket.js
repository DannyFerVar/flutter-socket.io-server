const { io } = require('../index');

const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Deftones'));
bands.addBand(new Band('Led Zepelin'));
bands.addBand(new Band('Pink Floyd'));
bands.addBand(new Band('Metallica'));


//Mensajes del server
io.on('connection', client => {
    console.log('Client connected');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { console.log('Client disconnected') });

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);
        io.emit('Mensaje', { admin: 'Nuevo Mensaje' });
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-new-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands())
    });

    client.on('borrar-banda', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands())
    });

    // client.on('emitir-mensaje', (payload) => {
    //     //io.emit('nuevo-mensaje', 'meh!'); //emite mensaje a todos.
    //     client.broadcast.emit('nuevo-mensaje', payload); //emite el mensaje a todos menos a quien lo emitió.
    //     console.log(payload);
    // })

});
