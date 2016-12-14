exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                      'mongodb://morettisf:mL@bPW-750!.mlab.com:49466/mongo-test-hosting' :
                      'mongodb://localhost/shopping-list-dev');
                       
                       
//                            'mongodb://localhost/shopping-list' :
//                            'mongodb://localhost/shopping-list-dev');
exports.PORT = process.env.PORT || 8080;

