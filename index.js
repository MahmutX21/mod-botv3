const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const prefix = 'm+';

client.once('ready', () => {
  console.log(`${client.user.tag} olarak giriş yapıldı!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // KICK
  if (command === 'kick') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply('Yetkiniz yok.');
    }
    const member = message.mentions.members.first();
    if (!member) return message.reply('Bir üye etiketleyin.');
    if (!member.kickable) return message.reply('Bu üyeyi kickleyemem.');

    const reason = args.join(' ') || 'Belirtilmedi';
    await member.kick(reason);
    message.channel.send(`${member.user.tag} sunucudan atıldı. Sebep: ${reason}`);
  }

  // BAN
  else if (command === 'ban') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('Yetkiniz yok.');
    }
    const member = message.mentions.members.first();
    if (!member) return message.reply('Bir üye etiketleyin.');
    if (!member.bannable) return message.reply('Bu üyeyi banlayamam.');

    const reason = args.join(' ') || 'Belirtilmedi';
    await member.ban({ reason });
    message.channel.send(`${member.user.tag} banlandı. Sebep: ${reason}`);
  }

  // UNBAN
  else if (command === 'unban') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('Yetkiniz yok.');
    }
    const userId = args[0];
    if (!userId) return message.reply('Kullanıcı ID\'si girin.');

    try {
      await message.guild.members.unban(userId, args.slice(1).join(' ') || 'Belirtilmedi');
      message.channel.send(`Kullanıcı (ID: ${userId}) unbanlandı.`);
    } catch {
      message.reply('Ban bulunamadı veya hata oluştu.');
    }
  }

  // MUTE (timeout)
  else if (command === 'mute') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply('Yetkiniz yok.');
    }
    const member = message.mentions.members.first();
    if (!member) return message.reply('Bir üye etiketleyin.');
    if (!member.moderatable) return message.reply('Bu üyeyi susturamam.');

    const duration = parseInt(args[0]);
    if (isNaN(duration)) return message.reply('Dakika cinsinden süre girin.');

    const reason = args.slice(1).join(' ') || 'Belirtilmedi';
    await member.timeout(duration * 60 * 1000, reason);
    message.channel.send(`${member.user.tag} ${duration} dakika susturuldu. Sebep: ${reason}`);
  }
});

// TOKEN - Kendi token'ını buraya yaz
const token = "MTQ3NzI3OTU0NjYxNjE4OTA3OA.GwoNj6.SBbUqWcELCYxw_tok1zaZo0LtJnaX-cd4_8Lig";

client.login(token);
