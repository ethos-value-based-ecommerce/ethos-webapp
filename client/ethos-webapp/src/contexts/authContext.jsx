import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClients';


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
   // Get initial session
   const getInitialSession = async () => {
     const { data: { session } } = await supabase.auth.getSession();
     setUser(session?.user ?? null);


     // Get account type from user metadata or local storage
     if (session?.user) {
       const storedAccountType = localStorage.getItem('accountType');
       const metadataAccountType = session.user.user_metadata?.account_type;
       setAccountType(metadataAccountType || storedAccountType || 'user');
     }


     setLoading(false);
   };


   getInitialSession();


   // Listen for auth changes
   const { data: { subscription } } = supabase.auth.onAuthStateChange(
     async (_, session) => {
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
     }
   );


   return () => subscription.unsubscribe();
 }, []);


 // Sign in with Google
 const signInWithGoogle = async (accountType = 'user') => {
   try {
     // Store account type before OAuth redirect
     localStorage.setItem('accountType', accountType);


     const { data, error } = await supabase.auth.signInWithOAuth({
       provider: 'google',
       options: {
         redirectTo: `${window.location.origin}/auth/callback`,
         queryParams: {
           account_type: accountType
         }
       }
     });


     if (error) throw error;
     return { data, error: null };
   } catch (error) {
     console.error('Error signing in with Google:', error);
     return { data: null, error };
   }
 };


 // Sign in with GitHub
 const signInWithGitHub = async (accountType = 'user') => {
   try {
     // Store account type before OAuth redirect
     localStorage.setItem('accountType', accountType);


     const { data, error } = await supabase.auth.signInWithOAuth({
       provider: 'github',
       options: {
         redirectTo: `${window.location.origin}/auth/callback`,
         queryParams: {
           account_type: accountType
         }
       }
     });


     if (error) throw error;
     return { data, error: null };
   } catch (error) {
     console.error('Error signing in with GitHub:', error);
     return { data: null, error };
   }
 };


 // Sign in with email/password
 const signInWithEmail = async (email, password, accountType = 'user') => {
   try {
     const { data, error } = await supabase.auth.signInWithPassword({
       email,
       password
     });


     if (error) throw error;


     // Store account type
     localStorage.setItem('accountType', accountType);
     setAccountType(accountType);


     return { data, error: null };
   } catch (error) {
     console.error('Error signing in with email:', error);
     return { data: null, error };
   }
 };


 // Sign up with email/password
 const signUpWithEmail = async (email, password, accountType = 'user', additionalData = {}) => {
   try {
     const { data, error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         data: {
           account_type: accountType,
           ...additionalData
         }
       }
     });


     if (error) throw error;


     // Store account type
     localStorage.setItem('accountType', accountType);
     setAccountType(accountType);


     return { data, error: null };
   } catch (error) {
     console.error('Error signing up with email:', error);
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
       redirectTo: `${window.location.origin}/reset-password`
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
       password: newPassword
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
   signInWithGoogle,
   signInWithGitHub,
   signInWithEmail,
   signUpWithEmail,
   signOut,
   resetPassword,
   updatePassword,
   updateAccountType
 };


 return (
   <AuthContext.Provider value={value}>
     {children}
   </AuthContext.Provider>
 );
};
