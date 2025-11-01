// download-images.js
const fs = require('fs');
const https = require('https');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

const downloads = [
  { url: 'https://placebear.com/800/600', dest: 'dog1.jpg' },
  { url: 'https://placekitten.com/800/600', dest: 'cat1.jpg' },
  { url: 'https://dummyimage.com/200x200/000/fff.png&text=Logo+Mundo+Pets', dest: 'logo-mundo-pets.png' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(publicDir, dest));
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`Falha ao baixar ${url} - código ${res.statusCode}`));
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(path.join(publicDir, dest), () => reject(err));
    });
  });
}

(async () => {
  try {
    for (const item of downloads) {
      process.stdout.write(`Baixando ${item.url} -> ${item.dest} ... `);
      await download(item.url, item.dest);
      console.log('ok');
    }
    console.log('\n✅ Todas as imagens foram salvas na pasta ./public');
  } catch (err) {
    console.error('\n❌ Erro ao baixar imagens:', err.message);
  }
})();
