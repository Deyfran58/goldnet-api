const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); 
mongoose.connect('mongodb+srv://goldnet:GoldNet2025CR@cluster0.poqccbo.mongodb.net/goldnetdbh?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log('Error MongoDB:', err));

.then(() => console.log('MongoDB conectado'))
.catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  cedula: { type: String, unique: true, required: true },
  nombre: String,
  primerApellido: String,
  segundoApellido: String,
  fechaNacimiento: String,
  correo: String,
  telefono: String,
  provincia: String,
  canton: String,
  distrito: String,
  direccion: String,
  contrasena: String,
  fotoPerfil: { type: String, default: "" }
});

const User = mongoose.model('User', userSchema);

// CREATE
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// READ ONE
app.get('/api/users/:cedula', async (req, res) => {
  try {
    const user = await User.findOne({ cedula: req.params.cedula });
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// READ ALL
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json({ success: true, users });
});

// UPDATE
app.put('/api/users/:cedula', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { cedula: req.params.cedula },
      req.body,
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false });
  }
});

// DELETE
app.delete('/api/users/:cedula', async (req, res) => {
  try {
    await User.findOneAndDelete({ cedula: req.params.cedula });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API GoldNet corriendo en puerto ${PORT}`));
