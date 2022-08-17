const {verify} = require("jsonwebtoken");

const validT= (req, res, next) => {
    const AccT = req.header("AccT");
    
    if (!AccT) return res.json({error: "You need to log in first !!!"})

  //  try{
  //      const valid = verify(AccT, "JQ1mFJsoey");
  //      if(valid) {
  //          return next();
  //      }
  //  }
};