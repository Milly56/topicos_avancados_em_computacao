import io from 'socket.io-client';

const socket = io('http://localhost:8000', {
  path: '/ws/socket.io', 
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

socket.on('connect', () => {
  console.log('Conectado ao servidor WebSocket');

  socket.emit('subscribe', { channel: 'profissional:criado' });
  socket.emit('subscribe', { channel: 'profissional:atualizado' });
  socket.emit('subscribe', { channel: 'profissional:deletado' });
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor');
});

socket.on('status', (data) => {
  console.log('Status:', data.message);
});

socket.on('profissional:criado', (data) => {
  console.log('Novo profissional criado:', data);
});

socket.on('profissional:atualizado', (data) => {
  console.log('Profissional atualizado:', data);
});

socket.on('profissional:deletado', (data) => {
  console.log('Profissional deletado:', data);
});

socket.on('evento', (data) => {
  console.log('Evento recebido:', data);
});

function emitEvent(channel: string, data: any) {
  socket.emit('emit', { channel, data, timestamp: new Date() });
}

function criarProfissional(nome: string, especialidade: string, telefone: string) {
  fetch('http://localhost:8000/profissionais', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, especialidade, telefone }),
  })
    .then(res => res.json())
    .then(data => {
      console.log('Profissional criado:', data);
    });
}

function listarProfissionais() {
  fetch('http://localhost:8000/profissionais')
    .then(res => res.json())
    .then(data => {
      console.log('Profissionais:', data);
    });
}

function deletarProfissional(id: string) {
  fetch(`http://localhost:8000/profissionais/${id}`, {
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(data => {
      console.log('Profissional deletado:', data);
    });
}

export { socket, emitEvent, criarProfissional, listarProfissionais, deletarProfissional };