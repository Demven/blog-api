import robots from 'express-robots';

export default function() {
  return robots([
    {
      UserAgent: '*',
      Disallow: [
        '/client/',
        '/api/',
        '/login',
      ]
    }
  ]);
}
