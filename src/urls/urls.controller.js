const path = require("path");
const urls = require(path.resolve("src/data/urls-data"));
const uses = require(path.resolve("src/data/uses-data"));

//==middleware handler that checks if the url that's being created has a href property  create-url handler
function hasHref(req, res, next){
    const { data: { href } = {} } = req.body;

    if(href){
        return next();
    }
    next({ status: 400, message: "A 'href' property is required" });

}

//==== create-url handler (POST /urls)=================
function create(req, res){
  const newUrlId = urls.length + 1;
  const { data: { href } = {} } = req.body;
  const newUrl = {
           id: newUrlId,
           href,
        };
   urls.push(newUrl);
   res.status(201).json({ data: newUrl })
}

//===middleware function that checks if url exist before read, update and delete handlers are called
function urlExists(req, res, next){
   const { urlId } = req.params;
   const foundUrl = urls.find( url => url.id === Number(urlId));
   if(foundUrl){
       res.locals.url = foundUrl;
       return next();
    }  
    next({
        status: 404,
        message: `Url id not found: ${urlId}`,
    });
}

//========side effect of Get request creates a use record
function newUseRecord(req, res, next){
    const  urlId  = Number(req.params.urlId);
    const newTime = Date.now();
  // console.log(newTime);
    const nextUseId = uses.length+1;
    const newUse = {
        id: nextUseId,
        urlId,
        time: newTime,     
    };
    uses.push(newUse); 
    next();
}
function read(req, res){
   
     res.json({ data: res.locals.url });
  
    }

function update(req, res){
    const foundUrl = res.locals.url;
    const { data: { href } = {} } = req.body;
    foundUrl.href = href;
    res.json({ data: foundUrl });
}

function destroy(req, res){
    const { urlId } = req.params;
    const foundUrlIndex = urls.findIndex( url => url.id === Number(urlId));
    if (foundUrlIndex > -1){
        urls.splice(foundUrlIndex, 1);
    }  
    res.sendStatus(204);

}

function list(req, res){ 
    res.json({ data: urls })
}


module.exports = { list, read: [urlExists, newUseRecord, read], create: [ hasHref ,create], update: [urlExists, hasHref, update], delete: [urlExists, destroy], urlExists, }