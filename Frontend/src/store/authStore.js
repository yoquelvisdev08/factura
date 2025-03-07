import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../services/supabase';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,
      error: null,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      signUp: async ({ email, password, fullName, companyName }) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                company_name: companyName,
              },
            },
          });

          if (error) throw error;
          return { data, error: null };
        } catch (error) {
          set({ error: error.message });
          return { data: null, error };
        } finally {
          set({ loading: false });
        }
      },

      signIn: async ({ email, password }) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;
          set({ user: data.user, session: data.session });
          return { data, error: null };
        } catch (error) {
          set({ error: error.message });
          return { data: null, error };
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, session: null });
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      resetPassword: async (email) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) throw error;
          return { error: null };
        } catch (error) {
          set({ error: error.message });
          return { error };
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (updates) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', get().user.id)
            .select()
            .single();

          if (error) throw error;
          set({ user: { ...get().user, ...data } });
          return { data, error: null };
        } catch (error) {
          set({ error: error.message });
          return { data: null, error };
        } finally {
          set({ loading: false });
        }
      },

      // Inicializar la sesión
      initializeAuth: async () => {
        try {
          set({ loading: true, error: null });
          
          // Recuperar sesión actual
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session) {
            // Obtener datos del usuario
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userError) throw userError;

            set({ 
              user: userData,
              session: session
            });
          }
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, session: state.session }),
    }
  )
);

export default useAuthStore; 