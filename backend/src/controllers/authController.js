const supabase = require('../config/supabase');

const authController = {
  // ... existing code ...

  resetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'El correo electrónico es requerido' });
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ 
        message: 'Se han enviado las instrucciones de recuperación a tu correo electrónico' 
      });
    } catch (error) {
      console.error('Error en resetPassword:', error);
      res.status(500).json({ 
        error: 'Error al procesar la solicitud de recuperación de contraseña' 
      });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ error: 'La nueva contraseña es requerida' });
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ 
        message: 'Contraseña actualizada exitosamente' 
      });
    } catch (error) {
      console.error('Error en updatePassword:', error);
      res.status(500).json({ 
        error: 'Error al actualizar la contraseña' 
      });
    }
  }
};

module.exports = authController; 