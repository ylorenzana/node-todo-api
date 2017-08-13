const express = require('express');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./../db/mongoose.js');
const { Todo } = require('./../models/todo');
const { authenticate } = require('./../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      _createdBy: req.user._id
    });
    const doc = await todo.save();
    res.send(doc);
  }
  catch (e) {
    res.status(400).send();
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({
      _createdBy: req.user._id
    });
    res.send({todos});
  }
  catch (e) {
    res.status(400).send();
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) { 
      return res.status(404).send();
    }
    const todo = await Todo.findOne({
      _id: id,
      _createdBy: req.user._id
    });
    
    if (!todo) {
      res.status(404).send();
    }
    res.send({todo});
  }
  catch (e) {
    res.status(400).send();
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      res.status(404).send();
    }

    const todo = await Todo.findOneAndRemove({
      _id: id,
      _createdBy: req.user._id
    });

    if (todo) {
      res.send({todo});
    }
    else {
      res.status(404).send();
    }
  }
  catch (e) {
    res.status(400).send();
  }
});

router.patch('/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'isCompleted']);
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    if (_.isBoolean(body.isCompleted) && body.isCompleted) {
      body.completedAt = new Date().getTime();
    }
    else {
      body.completed = false;
      body.completedAt = null;
    }

    const todo = await Todo.findOneAndUpdate({_id: id, _createdBy: req.user._id}, {$set: body}, {new: true});
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }
  catch (e) {
    res.status(400).send();
  }
});

module.exports = router;