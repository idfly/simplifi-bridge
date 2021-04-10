const http = require('http');

module.exports = async function getAddr(port) {
  let sessionCookie = await getSessionCookie(port);

    return new Promise((resolve, reject) => {
      const opts = {
        host: 'localhost',
        port: port,
        path: '/v2/user/balances',
        method: 'GET',
        headers: {
          'Cookie': sessionCookie
        }
      };
      
      const req = http.request(opts, (res) => {
        res.setEncoding('utf-8')
        
        let resBody = '';
        res.on('data', (chunk) => {
          resBody += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(resBody).data[0].id);
        });

        res.on('error', (err) => {
          reject(err);
        });
      });

      req.end();
    });
}

function getSessionCookie(port) {
  return new Promise((resolve, reject) => {
    const opts = {
      host: 'localhost',
      port: port,
      path: '/sessions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(opts, (res) => {
      res.setEncoding('utf-8');
      
      res.on('data', () => { /* DO NOTHING */ });
      res.on('end', () => {
        resolve(res.headers["set-cookie"]);
      });

      res.on('error', (err) => {
        reject(err);
      });
    });

    const reqBody = JSON.stringify({
      email: 'user@example.com',
      password: 'password'
    });

    req.write(reqBody);
    req.end();
  });
}
