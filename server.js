import express from 'express';
// import { connect } from 'mongoose';
import { connect } from 'mongoose';
import pkg from 'body-parser';
const { json } = pkg;
import QRCodeReader from 'qrcode-reader';
import jimp from 'jimp';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5002;

app.use(json());
app.use(cors());

connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
import Form from './models/Form.js';

const qrReader = new QRCodeReader();

const readImage = async (base64Image) => {
  try {
    const image = await jimp.read(Buffer.from(base64Image, 'base64'));
    return image;
  } catch (error) {
    console.error('Error reading image:', error);
    throw error;
  }
};

app.post('/api/scan', async (req, res) => {
  const base64Image = req.body.image;

  try {
    const image = await readImage(base64Image);

    // Decode the QR code from the image
    qrReader.callback = (err, value) => {
      if (err) return res.status(500).send('Error reading QR code');

      // try{
      //   const student = Form.findById(value.result);
      //   if(!student){
      //     res.json({data:null});
      //   }
      //   res.json({data:student});
      // }catch{
        
      // }

// console.log(value.result);
      res.json({ qrData: value.result });
    };

    qrReader.decode(image.bitmap);
  } catch (error) {
    console.error('Error reading image:', error);
    res.status(500).send('Error reading image');
  }
});

app.get('/api/getstudent', async (req, res) => {
  const searchTerm = req.query.studentid;
  try {
    const results = await Form.findById(searchTerm);
    if(!results){
      res.json("no data");
    }
    if(results.Entered==true){
      res.json("Already Entered");
    }else{
      res.json(results);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/enter',async(req,res)=>{
  const id = req.body.id;
  try{
    let result = await Form.updateOne({_id:id},{$set:{Entered:true}});
    if(!result){
      res.json("No Data");
    }
    res.json("Entered successfully");
  }catch(error){
    res.status(500).send("Failed to enter");
  }
})



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
