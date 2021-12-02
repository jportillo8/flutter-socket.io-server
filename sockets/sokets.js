const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
console.log('init server');

bands.addBand( new Band('Pokemon') );
bands.addBand( new Band('Dragon ball Z') );
bands.addBand( new Band('Boruto') );
bands.addBand( new Band('Los siete pecados Capitales') );

console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {
    
    console.log('Cliente conectado');

    // Mandando las bandas a un unico cliente
    client.emit('active-bands', bands.getBands() )
    
    client.on('disconnect', () => { 
        
        console.log('Cliente desconectado');

   });

   client.on('mensaje', ( payload) => {
       console.log('Mensaje!!!', payload);

       io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    // client.on('emitir-mensaje', ( payload ) => {
    //     // console.log(payload);
    //     // io.emit('nuevo-mensaje', payload ); // emite a todos!!
    //     client.broadcast.emit('nuevo-mensaje', payload); // emite a todos menos el que lo emitio
    // })

    client.on('vote-band', ( payload ) => { 

        // console.log(payload);
        bands.voteBand( payload.id );
        io.emit('active-bands', bands.getBands());

     });

    //  Escuchar el evento
    client.on('add-band', ( payload ) => { 

        // console.log(payload);
        const newBand = new Band(payload.name);
        bands.addBand( newBand );
        io.emit('active-bands', bands.getBands());

     });

     client.on('delete-band', (payload) => {

        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());

     })

});