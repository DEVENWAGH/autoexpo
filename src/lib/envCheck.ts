export function checkRequiredEnvVars() {
  const requiredVars = [
    'NEXTAUTH_SECRET', 
    'NEXTAUTH_URL', 
    'GOOGLE_CLIENT_ID', 
    'GOOGLE_CLIENT_SECRET',
    // Add other required env vars here
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    console.error('This might cause authentication issues in production.');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('In development mode - continuing despite missing vars');
    }
  } else {
    console.log('All required environment variables are set');
  }
}
