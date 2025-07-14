import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClients.jsx';


const AuthContext = createContext({});


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
      }
    return context;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    const getInitialSession = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        setUser(session?.user ?? null);

      // Get account type from user metadata or local storage
        if (session?.user) {
          const storedAccountType = localStorage.getItem('accountType');
          const metadataAccountType = session.user.user_metadata?.account_type;
          setAccountType(metadataAccountType || storedAccountType || 'user');
        } else {
          setAccountType(null);
          localStorage.removeItem('accountType');
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
        setAccountType(null);
        localStorage.removeItem('accountType');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      setUser(session?.user ?? null);

      if (session?.user) {
        const storedAccountType = localStorage.getItem('accountType');
        const metadataAccountType = session.user.user_metadata?.account_type;
        setAccountType(metadataAccountType || storedAccountType || 'user');
      } else {
        setAccountType(null);
        localStorage.removeItem('accountType');
      }
      setLoading(false);
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      } else if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  // Sign up with email/password
  const signUpWithEmail = async (email, password, accountType = 'user', additionalData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            account_type: accountType,
            ...additionalData,
          },
        },
      });

      if (error) throw error;

      localStorage.setItem('accountType', accountType);
      setAccountType(accountType);

      return { data, error: null };
    } catch (error) {
      console.error('Error signing up with email:', error);
      return { data: null, error };
    }
  };

  // Sign in with email/password
  const signInWithEmail = async (email, password, accountType = 'user') => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      localStorage.setItem('accountType', accountType);
      setAccountType(accountType);

      return { data, error: null };
    } catch (error) {
      console.error('Error signing in with email:', error);
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;


      localStorage.removeItem('accountType');
      setAccountType(null);


      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    }
  };


  // Reset password
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { data: null, error };
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating password:', error);
      return { data: null, error };
    }
  };

  // Update account type
  const updateAccountType = (type) => {
    setAccountType(type);
    localStorage.setItem('accountType', type);
  };

  const value = {
    user,
    accountType,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    updatePassword,
    updateAccountType,
  };


  return (
  <AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>
    );
};
