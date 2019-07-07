const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const mongoose =require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users'); // i think i don't need this line , i try if i remove it program is running

// stories index
router.get('/',(req,res)=>{
  Story.find({status : 'public'})
  .populate('user')
  .sort({date : -1})
  .then(stories => {
      res.render('stories/index',{stories : stories}
    );
  }).catch(error => {
    console.log("error");
    res.redirect('/stories')
  })
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .populate('user')
  .populate('comments.commentUser')
  .then(story => {
    if(story.status == 'public'){  // these lines because if story private i can access it from url
      res.render('stories/show', {
        story:story
      });
    } else {
      if(req.user){
        if(req.user.id == story.user.id){
          res.render('stories/show', {
            story:story
          });
        } else {
          res.redirect('/stories');
        }
      } else {
        res.redirect('/stories');
      }
    }
  }).catch(error => {
    console.log("error");
    res.redirect('/stories')
  })
});


// Edit story
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
  Story.findOne({
    _id : req.params.id
  }).then(story => {
    if(story.user != req.user.id)
    {
      res.redirect('/stories');
    }
    else {
      res.render('stories/edit',{
        story:story
      })
    }
  }).catch(error => {
    console.log("error");
    res.redirect('/stories')
  })
})
//console.log(story.user);
// console.log(story.user.id); differnt because i don't do populate here
// i still put this also when i remove icon because no person can write url above and access

// Edit process
router.put('/:id', (req, res) => { // i can put url same but method differnt , mean i can put get and post with the same url
  Story.findOne({ // because don't return array 'maybe'
    _id: req.params.id
  })
  .then(story => {
    let allowComments;

    if(req.body.allowComments){
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save()
      .then(story => { // story after save
        res.redirect('/dashboard');
      });
  }).catch(error => {
    console.log("error");
    res.redirect('/stories')
  })
});

// DELETE story
router.delete('/:id',(req,res)=>{
  Story.deleteOne({_id : req.params.id})
   .then(()=>{
     res.redirect('/dashboard');
   }).catch(error => {
     console.log("error");
     res.redirect('/stories')
   })
})

// stories from specific users
router.get('/user/:userId',(req,res) => {
  Story.find({
    user : req.params.userId , status : 'public'
  }).populate('user')
  .then(stories => {
    res.render('stories/index',{
      stories : stories
    })
  }).catch(error => {
    console.log("error");
    res.redirect('/stories')
  })
})

// my Stories
// stories from specific users
router.get('/my',ensureAuthenticated,(req,res) => {
  Story.find({
    user : req.user.id
  }).populate('user')
  .then(stories => {
    res.render('stories/index',{
      stories : stories
    })
  }).catch(error => {
    console.log("error");
    res.redirect('/stories')
  })
})

// Add stories
router.get('/add',ensureAuthenticated,(req,res)=>{
  res.render('stories/add');
})

// process add story
router.post('/',(req,res)=>{
  let allowComments;
  if(req.body.allowComments)
  {
    allowComments = true;
  }
  else {
    allowComments = false;
  }

  const newStory = {
    title:req.body.title,
    status:req.body.status,
    allowComments : allowComments,
    body:req.body.body,
    user:req.user.id
  }

  new Story(newStory).save().then(story => {
    res.redirect(`/stories/show/${story.id}`) // we put ${} because we in js file not handlebars
  })
})

// Add Commnt
router.post('/comment/:id',(req,res) => {
  Story.findOne({
    _id : req.params.id
  }).then(story => {
    // New Comments
    const newComment = {
      commentBody : req.body.commentBody, // name in form of input
      commentUser : req.user.id
    }
    // comments is an array in model like this = [ {},{},{} ]
    // Add to comment array in first
    story.comments.unshift(newComment);

    story.save().then(story => {
      res.redirect(`/stories/show/${story.id}`);
    })

  }).catch(error => {
    console.log("error");
    res.redirect('/stories')
  })
})














module.exports = router;
