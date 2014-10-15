
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

console.log('Running mongoose version %s', mongoose.version);

/**
 * Console schema
 */

var KategorilerSchema = Schema({
    ad: String
  , kullan: Number
  , olusturma: Date
})
var Kategoriler = mongoose.model('Kategoriler', KategorilerSchema);

/**
 * Game schema
 */

var urunlerSchema = Schema({
    ad: String
  , marka: String
  , olusturma: Date
  , kat_id: [{ type: Schema.Types.ObjectId, ref: 'Kategoriler' }]
})
var Urunler = mongoose.model('Urunler', urunlerSchema);

/**
 * Connect to the console database on localhost with
 * the default port (27017)
 */

mongoose.connect('mongodb://localhost/console', function (err) {
  // if we failed to connect, abort
  if (err) throw err;

  // we connected ok
  createData();
})

/**
 * Data generation
 */

function createData () {
    Kategoriler.create({
      ad: 'Telefonlar'
    , kullan: 1
    , olusturma: 'September 29, 1996'
  }, function (err, nintendo64) {
    if (err) return done(err);

        Urunler.create({
        ad: 'Nokia 3310'
      , marka: 'Nokia'
      , olusturma: new Date('November 21, 1998')
      , kat_id: [nintendo64]
    }, function (err) {
      if (err) return done(err);
      example();
    })
  })
}

/**
 * Population
 */

function example () {
    Urunler
  .findOne()
  .populate('kat_id')
  .exec(function (err, ocinara) {
    if (err) return done(err);

    /*console.log(
     '"%s" was released for the %s on %s'
     , ocinara.name
     , ocinara.consoles[0].name
     , ocinara.released.toLocaleDateString());*/

    console.log(JSON.stringify(ocinara));

    //done();
  })
}

function done (err) {
  if (err) console.error(err);
    Kategoriler.remove(function () {
        Urunler.remove(function () {
      mongoose.disconnect();
    })
  })
}
