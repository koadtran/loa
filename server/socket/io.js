let io = null;

function setIO(instance) {
    io = instance;
}

function getIO() {
    if (!io) throw new Error('Socket.IO not initialized yet');
    return io;
}

module.exports = { setIO, getIO };