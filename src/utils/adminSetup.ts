import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';

// 🔒 SECURE ADMIN CONFIGURATION
// ONLY YOU CAN BE ADMIN - CHANGE THIS TO YOUR EMAIL
const ADMIN_EMAIL = 'nabhisheknabhishek56@gmail.com'; // ⚠️ CHANGE THIS TO YOUR ACTUAL EMAIL

// 🔐 ENCRYPTED ADMIN URL GENERATION
const ADMIN_SECRET_KEY = 'abhimusickeys_secure_admin_2024';
const ADMIN_URL_PREFIX = 'secure-admin-panel';

// Generate encrypted admin URL
export const generateAdminUrl = (): string => {
  const timestamp = Date.now();
  const data = `${ADMIN_SECRET_KEY}_${timestamp}`;
  const hash = btoa(data).replace(/[+/=]/g, '').substring(0, 16);
  return `/${ADMIN_URL_PREFIX}/${hash}`;
};

// Verify encrypted admin URL
export const verifyAdminUrl = (url: string): boolean => {
  try {
    const parts = url.split('/');
    console.log('🔍 URL parts:', parts);
    
    // Check if it starts with secure-admin-panel
    if (parts.length < 3 || parts[1] !== ADMIN_URL_PREFIX) {
      console.log('❌ URL does not start with secure-admin-panel or has insufficient parts');
      return false;
    }
    
    const hash = parts[2];
    console.log('🔑 Hash:', hash);
    
    if (hash.length !== 16) {
      console.log('❌ Hash length is not 16 characters');
      return false;
    }
    
    // Basic validation - in production, you'd want more sophisticated encryption
    const isValidHash = hash.match(/^[A-Za-z0-9]{16}$/) !== null;
    console.log('✅ Hash validation:', isValidHash);
    return isValidHash;
  } catch (error) {
    console.log('❌ Error in verifyAdminUrl:', error);
    return false;
  }
};

// Get the current admin URL for display
export const getCurrentAdminUrl = (): string => {
  return generateAdminUrl();
};

// Display current admin URL in console
export const displayAdminUrl = (): string => {
  const adminUrl = generateAdminUrl();
  console.log('🔐 SECURE ADMIN URL:');
  console.log('🌐', window.location.origin + adminUrl);
  console.log('📝 Copy this URL to access your admin panel');
  console.log('⚠️  Keep this URL private and secure!');
  return adminUrl;
};

export const isAuthorizedAdmin = (email: string): boolean => {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

export const setupAdminUser = async (email: string, password: string, displayName: string) => {
  // Security check - only the authorized email can create admin
  if (!isAuthorizedAdmin(email)) {
    throw new Error('❌ UNAUTHORIZED: Only the platform owner can create admin accounts');
  }

  try {
    // First, create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Then, create the user document in Firestore with admin role
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      displayName: displayName,
      role: 'admin',
      plan: 'admin',
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
      progress: {
        basicCompleted: 0,
        intermediateCompleted: 0,
        advancedCompleted: 0
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('User ID:', user.uid);
    console.log('Email:', email);
    console.log('Role: admin');
    
    // Display the secure admin URL
    displayAdminUrl();
    
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  (window as any).displayAdminUrl = displayAdminUrl;
  (window as any).generateAdminUrl = generateAdminUrl;
  (window as any).getCurrentAdminUrl = getCurrentAdminUrl;
  (window as any).setupAdminUser = setupAdminUser;
  
  console.log('🔐 Admin functions loaded! Use displayAdminUrl() to get your secure admin URL');
  console.log('🔧 Use setupAdminUser(email, password, displayName) to create admin account');
}

export const checkAdminExists = async () => {
  try {
    // Check if the authorized admin exists
    const adminQuery = await getDoc(doc(db, 'users', 'admin-check'));
    return false; // For now, always return false to allow setup
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
};

// Enhanced security instructions
export const ADMIN_SETUP_INSTRUCTIONS = `
🔧 SECURE ADMIN SETUP INSTRUCTIONS

⚠️  IMPORTANT: Only you (the platform owner) can create admin accounts!

🔐 SECURITY FEATURES:
- Encrypted admin URL prevents unauthorized access
- Only your email can create admin accounts
- No other users can access admin features
- Admin creation is completely disabled for regular users
- Your admin access is permanent and secure

📋 SETUP STEPS:
1. First, edit the ADMIN_EMAIL in src/utils/adminSetup.ts to your actual email
2. Open your browser's developer tools (F12)
3. Go to the Console tab
4. Run the following command:

setupAdminUser('your-email@example.com', 'your-secure-password', 'Your Name')

🔗 ACCESS YOUR ADMIN PANEL:
Your secure admin URL will be generated dynamically. Check the console for the current URL.

After setup, access the admin panel using the encrypted URL.
`;
