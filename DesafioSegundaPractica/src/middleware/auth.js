// export const privacy = (privacyType) => {
//     return (req, res, next) => {
//         const { user } = req.sessions;
//         switch (privacyType) {
//             case "PRIVATE":
//                 if (user) next();
//                 else res.redirect('/login')
//                 break;
//             case "NO_AUTHENTICATED":
//                 if (!user) next()
//                 else res.redirect('/products')
//         }
//     };
// };