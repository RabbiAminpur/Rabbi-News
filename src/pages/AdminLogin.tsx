import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, loginWithGoogle, db, doc, getDoc, setDoc } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LogIn, ShieldCheck } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      const user = result.user;

      // Check if user exists in our DB, if not, check if they are the default admin
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        // Only allow the specific email to become admin automatically
        if (user.email === "Mrhrabby24@gmail.com") {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'Admin',
            role: 'admin'
          });
        } else {
          // Not authorized
          await auth.signOut();
          alert('আপনি এই প্যানেলে প্রবেশের জন্য অনুমোদিত নন।');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ShieldCheck size={64} className="text-red-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-serif">
          এডমিন প্যানেল লগইন
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          শুধুমাত্র অনুমোদিত এডমিনদের জন্য
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <button
            onClick={handleLogin}
            className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            গুগল দিয়ে লগইন করুন
          </button>
        </div>
      </div>
    </div>
  );
};
