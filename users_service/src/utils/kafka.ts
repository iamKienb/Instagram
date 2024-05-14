import UserService from "../services/user.service";
import { Kafka } from "kafkajs";
import config from "../configs/config";

const kafka = new Kafka({
  clientId: 'users-service',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'users-group' });

export default class KafkaConfig {
  static async startKafkaProducer({ topic, payload }: { topic: string, payload: { event: string, data: any } }) {
    await producer.connect();
    await producer.send({
      topic: topic,
      messages: [
        {
          value: JSON.stringify({
            event: payload.event,
            data: payload.data
          })
        }
      ]
    });
    console.log('Messages were sent successfully');
  }

  static async startKafkaConsumer(userService: typeof UserService) {
    await consumer.connect();
    await consumer.subscribe({ topic: "USER_SERVICE", fromBeginning: true });
    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = message.value?.toString() as string;
        if (!payload) console.log("No payload provided");
        console.log(`Received message: ${payload}`);

        userService.subscribeEvents(payload);
      }
    });
    console.log('Nhận Payload successfully');
  }
}
