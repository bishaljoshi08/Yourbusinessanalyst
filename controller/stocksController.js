const moment = require('moment');
const Stocks = require('./../models/stockModel');

const User = require('./../models/userModel');
const { Supplier } = require('./../models/buyerSupplierModel');

exports.gpage = async (req, res, next) => {
  const user = await User.findOne({ id: req.user.id });
  Stocks.find(
    { userId: req.user.id },
    'Modelno Quantity Sellingprice Costprice -_id',
    (err, docs) => {
      if (!err) {
        res.render('stocks', {
          title: 'Stocks',
          admin: user.username,
          accessTime: moment().format(),
          stocks: docs,
          modelNo: Object.keys(docs).map(el => docs[el].Modelno),
          quantity: Object.keys(docs).map(el => docs[el].Quantity),
          src: './../images/smiley.jpg'
        });
      } else {
        next(err);
      }
    }
  );
};
exports.addStocks = async (req, res, next) => {
  try {
    let stock = await Stocks.findOneAndUpdate(
      { Modelno: req.body.Modelno, userId: req.user.id },
      {
        $inc: {
          Quantity: parseInt(req.body.Quantity)
        },
        Costprice: parseInt(req.body.Costprice),
        Sellingprice: parseInt(req.body.Sellingprice),
        supplierPan: req.body.supplierPannumber,
        Modelno: req.body.Modelno,
        userId: req.user.id,
        Date: Date.now()
      },
      { upsert: true, new: true });

    let supplier = await Supplier.findOne({ userId: req.user.id, supplierPan: req.body.supplierPannumber });
    if (!supplier) {
      supplier = await Supplier.create({
        userId: req.user.id,
        supplierPan: req.body.supplierPannumber,
        $push: {
          supplies: stock
        }
      })
    }

    console.log(supplier)
    let exist = supplier.supplies.includes(stock._id) || null;
    if (!exist) {
      supplier = await Supplier.updateOne(
        supplier,
        {
          userId: req.user.id,
          supplierPan: req.body.supplierPannumber,
          $push: {
            supplies: stock
          }
        });
    }

    let supplies = await Supplier.findOne({ userId: req.user.id }).populate('supplies');
    // res.json(supplies.supplies);
    res.redirect('/stocks');
    // }
  } catch (err) {
    next(err);
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const q = await Stocks.findOne(
      {
        Modelno: req.body.Modelno,
        userId: req.user.id
      })
    const docs = await Stocks.findOneAndUpdate({
      Modelno: req.body.Modelno,
      userId: req.user.id
    }, {
      Quantity: (q.Quantity - req.body.Quantity) < 0 ? 0 : q.Quantity - req.body.Quantity
    });
    res.redirect('/home');
  } catch (err) {
    res.send(`Error:${err}`);
  }
};

