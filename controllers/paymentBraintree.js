const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
// const gateway = braintree.connect({
  
  environment: braintree.Environment.Sandbox,
  merchantId: "wgx3zy6m6s3x35nq",
  publicKey: "jf47r9qr2pgs38tf",
  privateKey: "70a3c1a9757ef9b75c6703bb213fcdef"
});


// exports.getToken = (req, res) => {
//   gateway.clientToken.generate({}, function(err, response) {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.send(response);
//       console.log(response);
      
//     }
//   });
// };

exports.getToken=(req,res)=>{
    
    gateway.clientToken.generate({
        // customerId: aCustomerId
      }, (err, response) => {
        // pass clientToken to your front-end
        const clientToken = response.clientToken
        if(err){
            
            res.status(500).send(err);
           
            
        }
        else{
            res.send(response);
    // console.log('token is working',clientToken);

        }
      });
    
}




// exports.processPayment=(req,res)=>{

//     // const nonceFromTheClient = req.body.payment_method_nonce;
//   let nonceFromTheClient = req.body.paymentMethodNonce;

//     let amountFromTheClient=req.body.amount

//     gateway.transaction.sale({
//         amount: amountFromTheClient,
//         paymentMethodNonce: nonceFromTheClient,
//         // deviceData: deviceDataFromTheClient,
//         options: {
//           submitForSettlement: true
//         }
//       }, (err, result) => {
//         if(err){
//             res.status(500).send(err);
//         }
//         else{
//     console.log('PAYMENT is working');

//             res.send(response)
//         }
//       });
// }

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;

  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,

      options: {
        submitForSettlement: true
      }
    },
    function(err, result) {
      if (err) {
        res.status(500).json(error);
      } else {
        res.json(result);
      }
    }
  );
};