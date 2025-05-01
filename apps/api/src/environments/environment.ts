export const environment = {
  production: false,
  debug: true, //!!process.env.SPORTBUS_DEBUG,
  managementKey: process.env.SPORTBUS_MANAGEMENT_KEY||'buskey',
  sessionDurationDays: 90,
  google: {
    mail: process.env.GOOGLE_MAIL || 'leo.olmi@gmail.com',
    clientID: process.env.GOOGLE_CLIENT_ID || 'xxxxxxxxxxxxx',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'xxxxxxxxxxxxx',
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK || 'https://sportbus.herokuapp.com/auth/google/callback'
  },
  mongoDbUri: process.env.MONGODB_URI ||
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
    process.env.SPORTBUS_MONGODB_URL ||
    'mongodb://localhost/sportbus'
};
