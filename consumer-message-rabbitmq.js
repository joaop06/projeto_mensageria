import amqp from 'amqplib';

const receiveMessage = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'reservation_queue';

    await channel.assertQueue(queue);

    console.log(`👂 Waiting for messages in ${queue}...`);

    channel.consume(queue, (msg) => {
        if (msg !== null) {
            console.log(`📥 Received: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    });
};

receiveMessage();
