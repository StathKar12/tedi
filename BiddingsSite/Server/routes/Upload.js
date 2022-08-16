const express = require('express');
const router = express.Router();
const { Files } = require("../models");
let formidable = require('formidable');
const crypto = require('crypto')
let fs = require('fs');


router.get('/byid/:id',async (req, res) =>{
  const id = req.params.id;
  const uploads = await Files.findAll({where :{ AuctionId:id }})
  res.json(uploads)
})

router.post("/:id",async (req, res) => {

  const id = req.params.id;
  let form = new formidable.IncomingForm();
  var val = crypto.randomUUID({disableEntropyCache : true});
  val+= '.jpg';
  
  form.parse(req, function (error, fields, file) {
    let newpath = '../client/src/UploadedItems/';
    let filepath = file.fileupload.filepath;
    newpath += val;
    fs.rename(filepath, newpath, function () {});
  });

  const File = {
    FileName:val,
    AuctionId:id,
  };

  await Files.create(File);
  res.json(File);

})

module.exports = router;