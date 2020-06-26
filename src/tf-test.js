(async () => {
    log('TF.js: ', window.tf.version.tfjs)

    const model = tf.sequential({
        layers: [
            tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}),
            tf.layers.dense({units: 10, activation: 'softmax'}),
        ]
    });
    model.weights.forEach(w => {
        log(w.name, w.shape);
    });
    model.compile({
        optimizer: 'sgd',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // Generate dummy data.
    const data = tf.randomNormal([100, 784], 0.5, 0.25)
        .maximum(tf.scalar(0))
        .minimum(tf.scalar(0.999));

    const labels = tf.randomUniform([100, 10]);
    function onBatchEnd(batch, logs) {
        // log('Accuracy ', logs.acc);
    }

    showExamples(data);

    // Train for 5 epochs with batch size of 32.
    const { history } = await model.fit(data, labels, {
        epochs: 50,
        batchSize: 32,
        callbacks: {onBatchEnd}
    });
    log('Final accuracy ', history.acc.reverse());

    async function showExamples(data) {
        // Get a surface
        const surface = tfvis.visor().surface({
            name: 'Thruple',
            tab: 'Input Data'
        });
        const drawArea = surface.drawArea;

        for (let i = 0; i < 20; i++) {
            const imageTensor = tf.tidy(() => {
                return data.slice([i, 0], [1, data.shape[1]]).reshape([28, 28, 1]);
            }); // Create a canvas element to render each example
            const canvas = document.createElement('canvas');
            canvas.width = 28;
            canvas.height = 28;
            canvas.style = 'margin: 4px;';
            await tf.browser.toPixels(imageTensor, canvas);
            drawArea.appendChild(canvas);
            imageTensor.dispose();
        }
    }
})()