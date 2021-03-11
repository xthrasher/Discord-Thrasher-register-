const {
  MessageEmbed
} = require('discord.js')
const thdb = require('quick.db')

exports.run = async (client, message, args) => {

  let thraembed = new MessageEmbed()
    .setAuthor(message.member.displayName, message.author.displayAvatarURL({
      dynamic: true
    }))
    .setColor(0x4287f5);
  if (!message.member.roles.cache.has(client.ayarlar.authorized) && !message.member.roles.cache.has(client.ayarlar.owner)) return message.channel.send(thraembed.setDescription('Hata: **Bu komutu kullanamazsın**!'))

  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!member) return message.channel.send(thraembed.setDescription('Birisini etiketle!'))
  const namee = args[1]
  const age = Number(args[2])
  if (!namee) return message.channel.send(thraembed.setDescription('İsim yazmalısın!'))
  if (!age) return message.channel.send(thraembed.setDescription('Yaş yazmalısın(sayı gir)!'))
  if (client.ayarlar.boyRoles.some(erkek => member.roles.cache.has(erkek))) return message.channel.send(`Hata: **Bu üye zaten kayıtlı.**`).then(thrasher => thrasher.delete({
    timeout: 5000
  }));
  //dbler
  thdb.push(`namee.${member.guild.id}_${member.id}`, namee);
  thdb.push(`age.${member.guild.id}_${member.id}`, age);
  //dbler son



  member.roles.add(client.ayarlar.boyRoles).catch(console.error);
  member.setNickname(`Thra - ${namee} ' ${age}`)
  message.channel.send(`${member} joined us with ${namee} ' ${age}`)
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['e', 'boy', 'b'],
  permLevel: 0
};

exports.help = {
  name: 'erkek'
};