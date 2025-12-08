const OpenAI = require('openai');
const formidable = require('formidable');
const fs = require('fs');

module.exports = async (req, res) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(500).json({ error: 'Error parsing form data' });
            return;
        }

        const imageFile = files.image;

        try {
            const image = await openai.images.edit({
                image: fs.createReadStream(imageFile.path),
                prompt: 'Add a santa hat to the person in the image',
                n: 1,
                size: '1024x1024',
            });

            res.status(200).json({ imageUrl: image.data[0].url });
        } catch (error) {
            console.error('Error from OpenAI:', error);
            res.status(500).json({ error: 'Error generating image' });
        }
    });
};
