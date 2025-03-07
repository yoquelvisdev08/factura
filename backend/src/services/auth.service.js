const supabase = require('../config/supabase');

class AuthService {
  async signUp({ email, password, fullName, companyName }) {
    try {
      // 1. Crear usuario en Supabase Auth con datos adicionales
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          },
          emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`
        }
      });

      if (authError) throw authError;

      // 2. Crear perfil de usuario en la tabla users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            full_name: fullName,
            company_name: companyName,
            settings: {
              theme: 'light',
              notifications: true,
              language: 'es'
            },
          },
        ])
        .select()
        .single();

      if (userError) throw userError;

      return { 
        user: userData,
        message: 'Por favor verifica tu correo electrónico para activar tu cuenta.'
      };
    } catch (error) {
      throw new Error(`Error en registro: ${error.message}`);
    }
  }

  async signIn({ email, password }) {
    try {
      // 1. Autenticar con Supabase
      const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Obtener datos del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError) throw userError;

      return {
        user: {
          ...userData,
          session: {
            access_token: session.access_token,
            expires_at: session.expires_at
          }
        }
      };
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/auth/reset-password`,
      });

      if (error) throw error;

      return { message: 'Se han enviado las instrucciones a tu correo electrónico' };
    } catch (error) {
      throw new Error(`Error en reset password: ${error.message}`);
    }
  }

  async updatePassword(userId, { currentPassword, newPassword }) {
    try {
      // Verificar contraseña actual
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userId, // Supabase permite usar el ID como identificador
        password: currentPassword,
      });

      if (verifyError) throw new Error('Contraseña actual incorrecta');

      // Actualizar contraseña
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      throw new Error(`Error actualizando contraseña: ${error.message}`);
    }
  }

  async getProfile(userId) {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          documents:documents(
            id,
            type,
            created_at,
            status
          )
        `)
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      return { user: userData };
    } catch (error) {
      throw new Error(`Error obteniendo perfil: ${error.message}`);
    }
  }

  async updateProfile(userId, updates) {
    try {
      // Actualizar datos de usuario en Auth
      if (updates.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: updates.email
        });
        if (emailError) throw emailError;
      }

      // Actualizar perfil en la base de datos
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({
          full_name: updates.fullName,
          company_name: updates.companyName,
          settings: updates.settings
        })
        .eq('id', userId)
        .select()
        .single();

      if (userError) throw userError;

      return { 
        user: userData,
        message: updates.email ? 'Perfil actualizado. Verifica tu nuevo correo si lo cambiaste.' : 'Perfil actualizado.'
      };
    } catch (error) {
      throw new Error(`Error actualizando perfil: ${error.message}`);
    }
  }

  async signOut(userId) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { message: 'Sesión cerrada correctamente' };
    } catch (error) {
      throw new Error(`Error cerrando sesión: ${error.message}`);
    }
  }

  async verifySession(token) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error) throw error;
      return { isValid: !!user, user };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }
}

module.exports = new AuthService(); 