const https = require('https');

exports.handler = async (event, context) => {
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        
        // Simple working prompt for testing
        const christmasPrompt = "christmas scene, santa hat, christmas tree, snow, festive decorations, warm lights, high quality, detailed painting";
        
        // Call Hugging Face API
        const hfResponse = await new Promise((resolve, reject) => {
            const postData = JSON.stringify({
                inputs: christmasPrompt,
                parameters: { wait_for_model: true }
            });

            const options = {
                hostname: 'api-inference.huggingface.co',
                port: 443,
                path: '/models/prompthero/openjourney',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        resolve({
                            statusCode: 200,
                            headers: res.headers,
                            body: data,
                            isBinary: true
                        });
                    } else {
                        try {
                            const errorData = JSON.parse(data);
                            reject(new Error(`HF API Error: ${JSON.stringify(errorData)}`));
                        } catch {
                            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                        }
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.write(postData);
            req.end();
        });

        // Convert binary image data to base64
        const imageBuffer = Buffer.from(hfResponse.body, 'binary');
        const base64Image = imageBuffer.toString('base64');
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                imageUrl: `data:image/jpeg;base64,${base64Image}`
            })
        };
        
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
