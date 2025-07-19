const fs = require('fs');
const https = require('https');
const path = require('path');
const os = require('os');
const { URL } = require('url');

const imageUrls = [
    'https://wimg.rule34.xxx//images/1608/af09b65c957f56140a1aba51901f4113101a7f8b.jpg?12153459',
    'https://wimg.rule34.xxx//samples/775/sample_47ebef3e7e553ac2867b7b4b6d71dfe7f93b920d.jpg?9654987',
    'https://wimg.rule34.xxx//samples/7829/sample_dff0ee68b9e77a76e16bae9ce4aea86dd52de4a3.jpg?8938677',
    'https://wimg.rule34.xxx//samples/7564/sample_878573dd749581f69d434a5601dcf7c3f26e4340.jpg?8627777',
    'https://wimg.rule34.xxx//samples/7554/sample_ba0c00afb4ac7d11596b3cda6c96a15706d2618c.jpg?8616131'
];

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                resolve();
            });
            
            file.on('error', (err) => {
                fs.unlink(filepath, () => {});
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

function generateFilename(url, index) {
    try {
        const parsedUrl = new URL(url);
        const pathParts = parsedUrl.pathname.split('/');
        const filename = pathParts[pathParts.length - 1];
        
        if (filename && filename.includes('.')) {
            return filename.split('?')[0];
        }
        
        return `image_${index + 1}.jpg`;
    } catch (error) {
        return `image_${index + 1}.jpg`;
    }
}

async function downloadAllImages() {
    const tempDir = os.tmpdir();
    
    for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        const filename = generateFilename(url, i);
        const filepath = path.join(tempDir, filename);
        
        try {
            await downloadImage(url, filepath);
        } catch (error) {
        }
    }
}

downloadAllImages();
