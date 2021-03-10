const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//DATABASE START
mongoose.connect('mongodb://localhost/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//DB Schema
const wikiSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", wikiSchema);

/**
Articles route
**/
app.route('/articles')
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      if (err)
        console.log(err);
      else
        res.send(articles);
    });
  })

  .post((req, res) => {
    let title = req.body.title;
    let content = req.body.content;

    const newArticle = new Article({
      title: title,
      content: content
    });

    newArticle.save((err) => {
      if (err)
        res.send(err);
      else
        res.send("Successfully added new article!");
    });
  })

  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (err)
        res.send(err);
      else
        res.send("All articles has been successfully deleted");
    });
  });


/**
Specific article
**/
app.route('/articles/:articleTitle')
  .get((req, res) => {
    Article.findOne({
      title: req.params.articleTitle
    }, (err, foundArticle) => {
      if (err)
        res.send(err);
      else
        res.send(foundArticle)
    });
  })

  .put((req, res) => {
    let title = req.body.title;
    let content = req.body.content;

    Article.update({
      title: req.params.articleTitle
    }, {
      title: title,
      content: content
    }, {
      overwrite: true
    }, (err, articleUpdated) => {
      if (err)
        res.send(err);
      else
        res.send(articleUpdated)
    })
  })

  .patch((req, res) => {

    Article.update({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, (err, updated) => {
      if (err)
        res.send(err);
      else
        res.send(updated)
    })
  })

  .delete((req, res) => {
    Article.deleteOne({
      title: req.params.articleTitle
    }, (err, result) => {
      if (err)
        res.send(err);
      else
        res.send(result)
    })
  });



app.listen(3000, () => {
  console.log("Server listening at port 3000");
})