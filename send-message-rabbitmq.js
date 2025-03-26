import amqp from 'amqplib';

const sendMessage = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'reservation_queue';
    const message = {
        pattern: 'reservation_queue',
        data: {
            uuid: '3030-499f-39f949',
            created_at: '2023-09-01 22:33:00',
            type: 'AB',
            customer: {
                id: 99494,
                name: 'João da Silva'
            },
            rooms: [
                {
                    id: 1,
                    daily_rate: 300.00,
                    number_of_days: 3,
                    reservation_date: '2025-09-15',
                    category: {
                        id: 'AM',
                        sub_category: {
                            id: 'BCRU'
                        }
                    }
                }
            ]
        }
    };

    await channel.assertQueue(queue);
    const bufferMessage = Buffer.from(JSON.stringify(message));

    channel.sendToQueue(queue, bufferMessage);

    console.log(`✅ Sent: ${bufferMessage}`);

    setTimeout(() => connection.close(), 500);
};

sendMessage();
