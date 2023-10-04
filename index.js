const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const doc = [
  { id: 1, name: 'Dr. Anuj', Slots: ['Monday', 'Friday'], maxPatients: 20 },
  { id: 2, name: 'Dr. Anushka', Slots: ['Tuesday', 'Wednesday'], maxPatients: 22 },
  { id: 3, name: 'Dr. Aman', Slots: ['Saturday', 'Thursday'], maxPatients: 30 }
];

const bookedAppointments = [];

app.get('/doc', (req, res) => {
  res.json(doc);
});

app.get('/appointments',(req, res)=>{
  res.json(bookedAppointments);
})

app.get('/doc/:id', (req, res) => {
  const doctorId = parseInt(req.params.id, 10);
  const doctor = doc.find(d => d.id === doctorId);

  if (!doctor) {
    res.status(404).json({ message: 'Doctor not found' });
  } else {
    res.json(doctor);
  }
});


app.post('/book', (req, res) => {
  const { doctorId, patientName, slot } = req.body;
  const doctor = doc.find(d => d.id === doctorId);

  if (!doctor) {
    res.status(404).json({ message: 'No Doctor Found' });
    return;
  }

  if (!doctor.Slots.includes(slot)) {
    res.status(400).json({ message: 'Slot Incorrect' });
    return;
  }

  if (bookedAppointments.filter(appt => appt.doctorId === doctorId && appt.slot === slot).length >= doctor.maxPatients) {
    res.status(400).json({ message: 'Slot is full for this doctor' });
    return;
  }


  bookedAppointments.push({ doctorId, patientName, slot });
  res.json({ message: 'Appointment booked successfully' });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
