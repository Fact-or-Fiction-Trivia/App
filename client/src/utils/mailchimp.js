import axios from "axios";

// exports.emailSubscribeWeekly = async (req, res, err) => {
//     await axios({
//         method: 'POST',
//         url: 'https://us20.api.mailchimp.com/3.0/lists/89f8146fed/members',
//         headers: {
//             Authorization: process.env.MAILCHIMP_API_KEY
//         },
//         data: {
//             email_address: req.body.email,
//             status: 'subscribed',
//             merge_fields: {
//                 FNAME: req.body.displayName
//             }
//         }
//     }).then(response => {
//         res.send({
//             status: 200,
//             mailchimpId:response.data.id
//         })

//     }).catch(error => {
//         console.log(error, 'ERROR')
//     })
// }
