//Import Required Packages

const express = require('express');
const fs = require('fs');
const { format } = require('date-fns');
const path = require('path');

//Create Express app

const app = express();
const PORT = process.env.PORT || 10000;

//To parse incoming JSON requests
app.use(express.json());

// Define the folder path
const folderPath = path.join(__dirname, 'Current_TimeStamp');

// Endpoint to create a text file with current timestamp
app.get('/createFile', (req, res) => {
  try {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const fileName = `${timestamp}.txt`;
    const filePath = path.join(folderPath, fileName);

    fs.writeFileSync(filePath, timestamp, 'utf8');
    const data = fs.readFileSync(filePath, 'utf8');
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Endpoint to retrieve all text files in the "Current_TimeStamp" folder
app.get('/getTextFiles', (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while listing files');
    } else {
      const textFiles = files.filter((file) => file.endsWith('.txt'));
      res.status(200).json(textFiles);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});