import { SECRET_KEY } from '../config/config.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const index = async (req, res) => {
  try {
    const usuarios = await User.all();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const find = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.getById(id);

    if (usuario.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const store = async (req, res) => {
  try {
    const { fName, mName, lName, username, email, password } = req.body;
    if (!fName || !username || !email || !password) return res.status(400).json({ message: 'Faltan datos' });

    const nuevoUsuario = await User.create({
      fName,
      username,
      email,
      password,
      mName,
      lName
    });

    if (nuevoUsuario[0].affectedRows === 1) return res.json({ message: 'Usuario guardado' });

    res.status(500).json({ message: 'Error al guardar el usuario' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { fName, mName, lName, username, email, password } = req.body;

    if (!fName || !username || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    const updatedFields = { f_name: fName, m_name: mName, l_name: lName, username, email, password };
    
    const result = await User.updateById(id, updatedFields);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const partialUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const fieldsToUpdate = req.body;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    const result = await User.updateById(id, fieldsToUpdate);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado parcialmente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await User.deleteById(id);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const crearToken = async (req, res) => {
  try {
    const { username } = req.body;
    const usuario = await User.where('username', username);
    if (usuario.length === 0) return res.status(404).json({ message: 'El usuario no existe' });

    const token = jwt.sign({ usuarioId: usuario[0].user_id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verificarToken = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const decoded = jwt.verify(authorization, SECRET_KEY);
    console.log(decoded);
    console.log(decoded.usuarioId);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: 'Token expirado' });
    }

    res.status(500).json({ message: error.message });
  }
};
