import express from 'express';
import dotPhrasesRouter from './routes/dot_phrases.ts';
import procedureNotesRouter from './routes/procedure_notes.ts';
import patientsRouter from './routes/patients.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/dot-phrases', dotPhrasesRouter);
app.use('/api/procedure-notes', procedureNotesRouter);
app.use('/api/patients', patientsRouter);

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

