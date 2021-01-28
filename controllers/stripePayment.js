const stripe = require('stripe')("sk_test_51I16H2FCuedeLqrA02H9VBrkFvDfouYNQJvuDJaxAOkdj7El4GCNqjVPJA5VwTaLhzAuSMbUoldQeqddDEACs3gn00GEQMaRM8");   
// const { result } = require('lodash');
const uuid = require('uuid/v4');

exports.makePayment=(req,res)=>{
    const {token,products}=req.body;

    console.log('products',products);
    let amount=0;
    products.map(p=>{
        amount=amount+p.price;
    });

    const idempotencyKey=uuid();

    return stripe.customers.create({
        email:token.email,
        source:token.id
    })
    .then((customer) => {
        console.log('PYMENTY')
        
        stripe.charges.create({
            amount:amount,
            currency:'usd',
            customer:customer.id,
            receiept_email:token.email,
            description:'a test account',
            shipping:{
                name:token.card.name,
                address:{
                    line1:token.card.address_line1,
                    line2:token.card.address_line2,
                    city:token.card.address_city,
                    country:token.card.address_country,
                    postal_code:token.card.address_zip,
                }
            }
        },{idempotencyKey})
        
        .then(result=>res.status(200).json(result))
        .catch((err) => {
            console.log(err);
            
        });
    })

}