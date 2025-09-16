let Drugdb = require('../model/model');


// creates and saves a new drug
exports.create = (req,res)=>{
    // validate incoming request
    if(!req.body){// if content of request (form data) is empty
        res.status(400).send({ message : "Content cannot be emtpy!"});// respond with this
        return;
    }

    //create new drug
    const drug = new Drugdb({
        name : req.body.name,//take values from form and assign to schema
        card : req.body.card,
        pack: req.body.pack,
        perDay : req.body.perDay,
        dosage : req.body.dosage
    })

    //save created drug to database
    drug
        .save(drug)//use the save operation on drug
        .then(data => {
            console.log(`${data.name} added to the database`) 
            res.redirect('/manage');
        })
        .catch(err =>{
            res.status(500).send({//catch error
                message : err.message || "There was an error while adding the drug"
            });
        });

}


// can either retrieve all drugs from the database or retrieve a single user
exports.find = (req,res)=>{

    if(req.query.id){//if we are searching for drug using its ID
        const id = req.query.id;

        Drugdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Can't find drug with id: "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Error retrieving drug with id: " + id})
            })

    }else{
        Drugdb.find()
            .then(drug => {
                res.send(drug)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "An error occurred while retriving drug information" })
            })
    }
}


// edits a drug selected using its  ID
exports.update = (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send({ message: "Data to update cannot be empty!" });
    }

    const id = req.params.id;

    Drugdb.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        .then(data => {
            if (!data) {
                return res.status(404).send({ message: `Drug with id: ${id} not found` });
            }
            res.send({
                message: "Drug updated successfully",
                drug: data
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating drug with id=" + id
            });
        });
};

// deletes a drug using its drug ID
exports.delete = (req, res) => {
    const id = req.params.id;

    Drugdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    message: `Cannot delete drug with id: ${id}. Please check id`
                });
            }
            res.send({
                message: `${data.name} was deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete drug with id=" + id
            });
        });
};

// purchase function
exports.purchase = async (req, res) => {
  const { drugId, quantity } = req.body;

  if (!drugId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Drug ID and quantity are required and must be > 0." });
  }

  try {
    const drug = await Drugdb.findById(drugId); // <--- sửa từ Drug -> Drugdb
    if (!drug) return res.status(404).json({ error: "Drug not found." });

    if (drug.pack < quantity) {
      return res.status(400).json({ error: `Not enough stock. Available: ${drug.pack}` });
    }

    drug.pack -= quantity;
    await drug.save();

    res.status(200).json({
      message: "Purchase completed successfully",
      drug: {
        name: drug.name,
        purchasedQuantity: quantity,
        remainingStock: drug.pack
      }
    });

  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

//Trân