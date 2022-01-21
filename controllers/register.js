const handleRegister = (req, res, postgres, bcrypt) => {
    const { email, name, password } = req.body;
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission')
    } 
    var hash = bcrypt.hashSync(password);
    postgres.transaction(trx => { //since we're doing more than two things at once
        trx.insert({              //we need to create a transaction (trx)
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {res.json(user[0])})
            })
            .then(trx.commit) //all trxs must be committed
            .catch(trx.rollback) //if some part of your trx fails, we roll back the WHOLE transaction
    }).catch(err => res.status(400).json('unable to register'));
}

module.exports = {
    handleRegister: handleRegister
}