const path = require("path");
const uses = require(path.resolve("src/data/uses-data"));

//===middleware function validate check if use exists.
//====validation for read-use, update-use, and delete-use handlers
function useExists(req, res, next){
 const { useId } = req.params;
 const foundUse = uses.find(use => use.id === Number(useId));
  if (foundUse){
    res.locals.use = foundUse;
    return next();
  }
  next({
       status: 404,
       message: `Use id not found: ${useId}`,
      });
}
 
function destroy(req, res){
    const { useId } = req.params;
    const index = uses.findIndex( use => use.id === Number(useId) );
    if(index > -1){
       uses.splice(index, 1);
    }
    res.sendStatus(204);
}

function read(req, res){    
    res.json({ data: res.locals.use });
} 


function list(req, res){
   const { urlId } = req.params;
   res.json({ data: uses.filter( urlId ? use => use.urlId === Number(urlId): () => true) });
}


module.exports = {list,  read:[useExists, read], delete:[useExists, destroy], useExists,}



// {create:[hasTime, create],update:[useExists, hasTime,hasUrlId,update],}
// function create(req, res){
//     const { data: {urlId, time} = {} } = req.body;
//     const nextUseId = uses.length+1;
//     const newUse = {
//         id: nextUseId,
//         urlId,
//         time: Date.now,     
//     };
//     uses.push(newUse);
//     res.status(201).json({ data: newUse})

// }
// //=====middleware function to check if use has time property
// //===validation for create-use and update-use handlers
// function hasTime(req, res, next){
//     const { data: { time } = {} } = req.body;
//     if(time){
//         next()
//     }
//     next({ status: 400,
//            message: "A 'time' property is required."})

// }

// function hasUrlId(req, res, next){
//     const routeUrlId = Number(req.params.urlId);
//     const { data: {urlId} = {} } = req.body;
//     console.log("routeUrlId: ",routeUrlId);
//     console.log("urlId: ",Number(urlId));
//     if(Number(urlId) === routeUrlId)
//       { 
//         next();
//       }
//       next({ status: 404,
//              message: "A 'urlId' property is required."});
//   }
//   function update(req, res){
//     const use = res.locals.use;
//     const { data: { urlId, time } = {} } = req.body;
//     use.urlId = urlId;
//     use.time = time;
//     res.json( { data: use });
//    }