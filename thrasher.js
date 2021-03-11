const {
  Client,
  Collection,
  MessageEmbed,
  MessageAttachment
}  = require("discord.js");
require("events").EventEmitter.defaultMaxListeners = 30000;
require("events").defaultMaxListeners = 30000;
const client = new Client({
  fetchAllMembers: true
});
const ayarlar = client.ayarlar = require("./ayarlar.json");
const fs = require("fs");
const thdb = require('quick.db')
require("./util/eventLoader")(client);

const log = message => {
  console.log(` => { ${message} } `);

};

client.commands = new Collection();
client.aliases = new Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`AKTİF: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.owner) permlvl = 4;
  return permlvl;
};

client.login(ayarlar.token).then(console.log("Bot başarılı bir şekilde giriş yaptı.")).catch(thrasher => console.error("Can't access token | Error: " + thrasher));

//event test
client.on('message', async message => {
  if (message.content === 't') {
    client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
  }
});

client.on('guildMemberAdd', async member => {
  const name = thdb.fetch(`namee.${member.guild.id}_${member.id}`);
  const age = thdb.fetch(`age.${member.guild.id}_${member.id}`);
  const nick = `${name} ' ${age}`

  member.setNickname(nick)
  const attach = new Discord.MessageAttachment("GİF");
  let member2 = member.user
  let message = member.guild.channels.cache.find(c => c.name === 'genel')
  

  message.send(`Yeni bir kullanıcı katıldı ${member}`, attach)
});