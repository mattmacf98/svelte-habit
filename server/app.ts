import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.get('/habits', (req, res) => {
  const habits = fs.readFileSync('server/habits.json', 'utf8');
  res.send(habits);
});

app.delete('/habits/:name', (req, res) => {
  const habits = JSON.parse(fs.readFileSync('server/habits.json', 'utf8'));
  const habitsArray = habits.filter((habit: any) => habit.name !== req.params.name);
  fs.writeFileSync('server/habits.json', JSON.stringify(habitsArray, null, 2));
  res.send('Habit deleted');
});

app.post('/habits', (req, res) => {
  const habit = req.body;
  if (habit.name && habit.description) {
    const habits = JSON.parse(fs.readFileSync('server/habits.json', 'utf8'));
    habits.push(habit);
    fs.writeFileSync('server/habits.json', JSON.stringify(habits, null, 2));
    res.send('Habit added');
  } else {
    res.status(400).send('Invalid habit');
  }
});

app.get('/user', (req, res) => {
  const user = fs.readFileSync('server/user.json', 'utf8');
  res.send(user);
});

app.post('/user', (req, res) => {
  const user = req.body;
  if (user.name && user.email) {
    fs.writeFileSync('server/user.json', JSON.stringify(user, null, 2));
    res.send(user);
  } else {
    res.status(400).send('Invalid user');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Example curl command for POST /user:
// curl -X POST http://localhost:3000/user \
//   -H "Content-Type: application/json" \
//   -d '{"name": "Jane Smith", "email": "jane.smith@example.com"}'

// Example curl command for DELETE /habits/:name:
// curl -X DELETE http://localhost:3000/habits/Read

// Example curl command for POST /habits:
// curl -X POST http://localhost:3000/habits \
//   -H "Content-Type: application/json" \
//   -d '{"name": "Drink Water", "description": "Drink 8 glasses of water"}'
