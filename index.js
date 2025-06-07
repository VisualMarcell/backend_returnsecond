require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

app.post('/submit', async (req, res) => {
  try {
    const { email, username, nama, nomor_hp, alamat, tgl_pesanan, tgl_retur, alasan } = req.body;

    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    const data = {
      fields: {
        Email: email,
        Username: username,
        Nama: nama,
        "Nomor HP": nomor_hp,
        Alamat: alamat,
        "Tanggal Pesanan": tgl_pesanan,
        "Tanggal Retur": tgl_retur,
        Alasan: alasan,
      }
    };

    const response = await axios.post(airtableUrl, data, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    res.json({ success: true, airtable: response.data });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
