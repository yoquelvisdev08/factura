const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { email, password, fullName, companyName } = req.body;
    
    // Validaciones básicas
    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos (email, password, fullName)' 
      });
    }

    const result = await authService.signUp({
      email,
      password,
      fullName,
      companyName,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y password son requeridos' 
      });
    }

    const result = await authService.signIn({ email, password });
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email es requerido' 
      });
    }

    const result = await authService.resetPassword(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Se requiere la contraseña actual y la nueva' 
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ 
        error: 'La nueva contraseña debe ser diferente a la actual' 
      });
    }

    const result = await authService.updatePassword(req.user.id, {
      currentPassword,
      newPassword
    });
    
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await authService.getProfile(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    // Validar campos actualizables
    const allowedUpdates = ['fullName', 'companyName', 'email', 'settings'];
    const isValidOperation = Object.keys(updates).every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ 
        error: 'Campos de actualización inválidos' 
      });
    }

    const result = await authService.updateProfile(req.user.id, updates);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signOut = async (req, res) => {
  try {
    const result = await authService.signOut(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verifySession = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const result = await authService.verifySession(token);
    if (!result.isValid) {
      return res.status(401).json({ error: 'Sesión inválida' });
    }

    res.status(200).json({ user: result.user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  resetPassword,
  updatePassword,
  getProfile,
  updateProfile,
  signOut,
  verifySession,
}; 