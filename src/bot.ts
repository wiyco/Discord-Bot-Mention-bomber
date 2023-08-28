import { Client, GatewayIntentBits, Message, ActivityType } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const limit = {
  attack: 10,
  delete: 100,
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Ready!");
  console.log(client.user?.tag);

  client.user?.setActivity({
    name: "オワタぁ",
    type: ActivityType.Streaming,
    url: "https://www.youtube.com/watch?v=QH2-TGUlwu4",
  });
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  const content = message.content;
  const users = message.mentions.users;

  if (content.startsWith("!attack")) {
    for (let i = 0; i < limit.attack; i++) {
      message.channel.send(
        `${users.map(
          (user) => `<@${user.id}>${user.globalName?.includes("hima") ? "ひまじん" : ""}`
        )}オワタぁ`
      );
    }
  }

  if (content.startsWith("!cleanup")) {
    message.channel.messages.fetch({ limit: limit.delete }).then(async (messages) => {
      const botMessages = messages.filter((msg) => msg.author.bot);
      if (!botMessages.size) return;

      message.channel.send(`掃除中... ${botMessages.size}件`);
      await Promise.all(
        botMessages.map(async (msg) => {
          if (msg) {
            await msg.delete();
          }
        })
      );

      if (botMessages.size > limit.delete) {
        message.channel.send(
          `まだ残ってるかも... 残り${botMessages.size - limit.delete}件}`
        );
      } else {
        message.channel.send(`掃除完了！`);
      }
    });
  }

  if (content.startsWith("!help")) {
    message.channel.send(`
      - \`!attack @mention\` : **オワタぁ**をメンション付きで${limit.attack}回送信します(hima特別仕様)
    \n- \`!cleanup\` : Botのメッセージを削除します(1回${limit.delete}件まで)
    `);
  }
});

client.login(process.env.TOKEN!);
