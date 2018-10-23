const tf = require('@tensorflow/tfjs');
tf.setBackend('tensorflow');

/** 
 * @module biz/tf
 */
/**
 * @since 1.0.0
 * @static
 * @method getAnswer
 * @description `post`
 */
module.exports.analysis = {
  method: "get",
  middlewares: [
    async (req, res, next) => {
      try {
        // create a simple model
        const model = tf.sequential();
        model.add(tf.layers.dense({units: 1, inputShape: [1]}));

        // prepare the model for training: Specify the loss and the optimizer
        model.compile({
          loss: 'meanSquaredError',
          optimizer: 'sgd'
        });

        // generate some synthetic data for training (y = 2x - 1)
        const xs = tf.tensor2d([-1,0,1,2,3,4], [6, 1]);
        const ys = tf.tensor2d([-3,-1,1,3,5,7], [6, 1]);

        // train the model using the data
        await model.fit(xs, ys, {epochs: 250});

        // use the model to do inference on test data
        const output = model.predict(tf.tensor2d([20], [1,1])).toString();
        res.$local.writeData({ ...output });
        next();
      } catch(e) {
        console.log(e.response);
        res.json({ err: "upload intents service Error" });
      }
    }
  ]
};