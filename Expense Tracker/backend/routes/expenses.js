import express from 'express';
import Expense from '../models/Expense.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware to authenticate all expense routes
router.use(authenticateToken);

// Get all expenses for the authenticated user
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single expense by ID
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new expense
router.post('/', async (req, res) => {
  try {
    const { description, amount, date, category, notes } = req.body;
    
    // Validate required fields
    if (!description || !amount || !date || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Create new expense
    const newExpense = new Expense({
      user: req.user.id,
      description,
      amount,
      date,
      category,
      notes
    });
    
    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const { description, amount, date, category, notes } = req.body;
    
    // Find expense and check if it belongs to the user
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    // Update expense fields
    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;
    expense.date = date || expense.date;
    expense.category = category || expense.category;
    expense.notes = notes !== undefined ? notes : expense.notes;
    
    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;