const _ = require('underscore')
const multer = require('multer') // import library
const moment = require('moment')
const q = require('q')
const fs = require('fs')
// var path = require("path");
module.exports={
    upload(req,res,next){
        fileUpload(req, res);
    }
}
//electron
// const dir = './dist/client/assets'
//web
const dir = './files/images'


/** Store file on local folder */
let storage = multer.diskStorage({
destination: function (req, file, cb) {
    //electron
    // cb(null, './dist/client/assets')
    //web
    cb(null, './files/images')

},
filename: function (req, file, cb) {
    let date = moment(moment.now()).format('YYYYMMDDHHMMSS')
    console.log(file);
    // cb(null, date + '_' + file.originalname.replace(/-/g, '_').replace(/ /g,     '_'))
    cb(null,file.originalname.replace(/-/g, '_').replace(/ /g,     '_'))

}
})

/** Upload files  */
let upload = multer({ storage: storage }).array('files')

/** Exports fileUpload function */
function fileUpload (req, res) {
    let deferred = q.defer()

    /** Create dir if not exist */
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
        console.log(`\n\n ${dir} dose not exist, hence created \n\n`)
    }

    upload(req, res, function (err) {
        if (req && (_.isEmpty(req.files))) {
            deferred.resolve({ status: 200, message: 'File not attached', data: [] })
        } else {
            if (err) {
                deferred.reject({ status: 400, message: 'error', data: err })
            } else {
                deferred.resolve({
                    status: 200,
                    message: 'File attached',
                    filename: _.pluck(req.files,
                        'filename'),
                    data: req.files
                })
            }
        }
    })
    return deferred.promise
}