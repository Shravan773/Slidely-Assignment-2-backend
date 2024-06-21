import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;
const dbFilePath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());
app.use(cors());

interface Submission {
  id: number;
  name: string;
  email: string;
  phone: string;
  github_link: string;
  stopwatch_time: string;
}

// Helper function to read submissions from JSON file
const readSubmissions = (): Submission[] => {
  if (fs.existsSync(dbFilePath)) {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data) as Submission[];
  }
  return [];
};

// Helper function to write submissions to JSON file
const writeSubmissions = (submissions: Submission[]): void => {
  fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
};

app.get('/ping', (req: Request, res: Response) => {
  res.json(true);
});

app.post('/submit', (req: Request, res: Response) => {
  const newSubmission: Submission = { ...req.body, id: generateUniqueId() };
  const submissions = readSubmissions();
  submissions.push(newSubmission);
  writeSubmissions(submissions);
  res.status(201).json(newSubmission);
});

app.get('/read', (req: Request, res: Response) => {
  const submissions = readSubmissions();
  res.json(submissions);
});

app.delete('/delete/:id', (req: Request, res: Response) => {
  const submissionIdToDelete = parseInt(req.params.id);
  const submissions = readSubmissions();
  const updatedSubmissions = submissions.filter(
    (submission) => submission.id !== submissionIdToDelete
  );
  writeSubmissions(updatedSubmissions);
  res.json({ message: 'Submission deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function generateUniqueId(): number {
  // Logic to generate a unique ID
  return Math.floor(Math.random() * 1000); // Replace with your unique ID generation logic
}
