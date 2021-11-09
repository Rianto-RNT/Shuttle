const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("345429176534-c9pe0ocbtsq92trinm9kgc6c6rq52t37.apps.googleusercontent.com");

async function verify(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        '573103940805-nutqthgajbhumvu392a2t3kth6r9ia9o.apps.googleusercontent.com',
    });
    
    const payload = ticket.getPayload();
    
    if (payload.email_verified) {
      return payload;
    } else {
      return 'user not verified';
    }
  } catch (err) {
    console.log(err)
    return cb(new Error('GOOGLE_ERROR'));
  }
}

module.exports = { verify };
