const express = require('express');
const router = express.Router();
const Tasks = require('../models/Tasks');
const fetchUser = require('../middlewares/fetchUser');
const { body, validationResult } = require('express-validator');

//------------------------------------------------------------------------------//

router.get('/fetchTasks',
    fetchUser,                  //Validating login using middleware
    async (req, res) => {
        try {
            //Finding user using user id.
            let tasks = await Tasks.find({ user: req.user.id })
            res.json(tasks);
        }
        //Catching it there is an internal error
        catch (error) {
            res.status(500).json({ error: "Internal Server error" });
        }
    });
//------------------------------------------------------------------------------//

router.post('/addTask',
    fetchUser,               //Validating login using middleware
    [
        body('title', 'Enter a valid title').isLength({ min: 3 }),
        body('description', 'Description should be atleast 5 chars long').isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            //Fetching errors of validation
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Creating new note
            const { title, description, dueDate, Status, tag } = req.body;
            const newTask = new Tasks({
                user: req.user.id,
                title,
                description,
                tag,  
                dueDate, 
                Status 
            })

            await newTask.save();
            res.status(200).json({ newTask });
        }
        //Catching it there is an internal error
        catch (error) {
            res.send(error);
            // res.status(500).json({ error: "Internal Server Error" });
        }
    });
//------------------------------------------------------------------------------//

router.put('/editTask/:id',
    fetchUser,
    async (req, res) => {
        try {
            const { title, description, tag, createdOn, dueDate, Status } = req.body;
            const newTask = {};

            if (title) {
                newTask.title = title;
            }
            if (description) {
                newTask.description = description;
            }
            if (tag) {
                newTask.tag = tag;
            }
            if (createdOn) {
                newTask.createdOn = createdOn;
            }
            if (Status) {
                newTask.Status = Status;
            }
            if (dueDate) {
                newTask.dueDate = dueDate;
            }

            let task = await Tasks.findById(req.params.id);

            if (!task) {
                return res.status(404).json({ error: "Task not found" });
            }
            if (task.user.toString() !== req.user.id) {
                return res.status(401).json({ error: "Access Denied" });
            }

            task = await Tasks.findByIdAndUpdate(req.params.id, { $set: newTask }, { new: true })
            res.status(200).json({ task });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
//------------------------------------------------------------------------------//

router.delete('/deleteTask/:id',
    fetchUser,
    async (req, res) => {
        try {

            let task = await Tasks.findById(req.params.id);

            if (!task) {
                return res.status(404).json({ error: "Task not found" });
            }
            if (task.user.toString() !== req.user.id) {
                return res.status(401).json({ error: "Access Denied" });
            }

            task = await Tasks.findByIdAndDelete(req.params.id)
            res.status(200).json({ "Success": "Task is successfully deleted" });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }

    });
//------------------------------------------------------------------------------//

module.exports = router;