<replace-with-your-main-or-existing-index-js-content>

// Add this near your Express app setup to mount push token routes
const pushTokens = require('./server/routes/pushTokens');
app.use('/api', pushTokens);

// Ensure mongoose is connected before starting the app
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sanad', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));
