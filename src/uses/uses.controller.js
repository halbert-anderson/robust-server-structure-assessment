const path = require("path");
const uses = require(path.resolve("src/data/uses-data"));
const urls = require(path.resolve("src/data/urls-data"));

//===middleware function validate check if use exists.=================
//====validation for read-use, update-use, and delete-use handlers=====
function compareUrlId(req, res, next) {
  const routeUrlId = Number(req.params.urlId);
  const routeUseId = Number(req.params.useId);
  const useUrlId = res.locals.use.urlId;
  
  console.log("routeUseId: ", routeUseId);
  console.log("routeUrlId: ", routeUrlId);
  console.log("useUrlId: ", Number(useUrlId));
  
  if(res.locals.routeUrlIdExists){
          if (Number(useUrlId) === routeUrlId) {
                   next();
           } 
           else {
                   next({
                         status: 404, 
                         message: `URL ID from the route parameter, ${routeUrlId}, does not match URL ID, ${useUrlId}, associated with the route useId ${routeUseId}.`,
                    });
             }
    }
    else{
      next();
    }
}

//===================================================================

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

//=================================================================== 

function urlIdExists(req, res, next){
  const { urlId } = req.params;
  if(urlId){
  const foundUrl = urls.find( url => Number(url.id) ===Number(urlId));
  if(foundUrl){
      res.locals.routeUrlIdExists = true;
      return next();
  }
   next({
       status: 404,
       message: `Url id not found: ${urlId}`,
      });
}else{
  res.locals.routeUrlIdExists = false;
  next();
}
}

//===================================================================
function destroy(req, res){
    const { useId } = req.params;
    const index = uses.findIndex( use => use.id === Number(useId) );
    if(index > -1){
       uses.splice(index, 1);
    }
    res.sendStatus(204);
}

//====================================================================
function update(req, res){
 const use = res.locals.use;
 const { data: { urlId, time } = {} } = req.body;
 use.urlId = urlId;
 use.time = time;
 res.json( { data: use });
}

//=====================================================================
function read(req, res){    
    res.json({ data: res.locals.use });
} 
  
//=====================================================================
function list(req, res){
   const { urlId } = req.params;
 
   res.json({ data: uses.filter( urlId ? use => Number(use.urlId) === Number(urlId): () => true) });
  
}


module.exports = {list:[urlIdExists,list], read:[urlIdExists, useExists,compareUrlId, read], delete:[useExists, destroy], useExists,}



//=====middleware function to check if use has time property
//===validation for create-use and update-use handlers
// function hasTime(req, res, next){
//     const { data: { time } = {} } = req.body;
//     if(time){
//         next();
//     }
//     next({ status: 400,
//            message: "A 'time' property is required."});
// }
//
// function hasUrlId(req, res, next){
//   const {data: { urlId } = {} } = req.body;
//   if(urlId){
//      next()
//       }
//      next({status: 400:
//            message: "A 'urlId' property is required."})
   
// }


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

// {create:[hasTime,hasUrlId, create], update:[useExists, hasTime, hasUrlId, update],}