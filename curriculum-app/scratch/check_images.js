const https = require('https');

const ids = [
  '1489599849927-2ee91cede3ba', '1536440136628-849c177e76a1', '1589998059171-9899ea853229',
  '1577083552431-6e5fd01aa342', '1579783902614-a3fb3927b6a5', '1511512578047-dfb367046420',
  '1470229722913-7c092fb13b30', '1514525253161-7a46d19cd819', '1478147424095-201b1739c6d4',
  '1505686994433-677134ce5a1c', '1440404653325-ab127d49abc1', '1512820790803-83ca734da794'
];

ids.forEach(id => {
  https.get(`https://images.unsplash.com/photo-${id}?w=400`, (res) => {
    console.log(`ID ${id}: ${res.statusCode}`);
  });
});
