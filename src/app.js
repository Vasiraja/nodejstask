const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('../src/routes/authRoutes');

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/nodejs', {
  // Remove useNewUrlParser and useUnifiedTopology options
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  useCreateIndex: true, // Add this option to handle deprecation warning for ensureIndex
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected'); 
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});


app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  