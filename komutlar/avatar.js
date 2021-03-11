const Discord = require('discord.js');
exports.run = async(client, message, args) => {
    let üye = message.mentions.users.first() || (args.length > 0 ? client.users.cache.filter(thrasher => thrasher.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
    let embed = new Discord.MessageEmbed()
    .setImage(üye.avatarURL({ dynamic: true, size: 2048 }))
    message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['avtr','av','pp'],
  permLevel: 0
};

exports.help = { 
  name: 'avatar'
};