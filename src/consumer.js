require("dotenv").config();
const amqp = require("amqplib");
const MailSender = require("./MailSender");
const PlaylistsService = require("./PlaylistsService");
const Listener = require("./listener");

const EXPORT_QUEUE = "export:playlist";

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue(EXPORT_QUEUE, {
    durable: true,
  });

  channel.consume(EXPORT_QUEUE, listener.listen, { noAck: true });

  console.log("Consumer server started!");
};

init();
