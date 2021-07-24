require('dotenv').config(); // initialize dotenv
const Discord = require('discord.js'); // import discord.js
const axios = require('axios'); // to call API

const client = new Discord.Client(); // create new client

const prefix = process.env.PREFIX;

client.on('ready', () => {
	console.log('Get Ready!');
	console.log(`Logged in as ${client.user.tag}!`);
});

let interval = null;

client.on('message', async msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	// declare variable
	let img, member = null;

	const input = msg.content.slice(prefix.length).trim().split(' ');
	const command = input.shift();
	const commandArgs = input.join(' ');
	switch (command.toLowerCase()) {
	case 'ping':
		msg.reply('Pong!');
		break;
		// our meme command below
	case 'meme':
		msg.channel.send('Here\'s your meme!'); // Replies to user command
		img = await getMeme(); // fetches an URL from the API
		msg.channel.send(img); // send the image URL
		break;
	case 'eye':
		msg.channel.send('You are now subscribed to eye reminders.');
		interval = setInterval (function() {
			msg.channel.send('Please take an eye break now!')
				.catch(console.error);
		}, 3600000); // every hour
		break;
	case 'eyestop':
		if (interval) {
			msg.channel.send('I have stopped eye reminders.');
			clearInterval(interval);
		}
		break;
	case 'usercheck':
		member = msg.mentions.members.first();
		// msg.reply(`${member}`);
		msg.channel.send(member.user.avatarURL());
		if (member.roles.cache.some(role => role.name === '<role name>')) {
			msg.reply('Pong!');
		}
		break;
	case 'rolecheck':
		member = msg.mentions.members.first();
		console.log(member.roles.cache.map(user => user.tag));
		msg.reply(member.roles.cache.map(user => user));
		msg.reply(member.roles.cache.map(user => user));
		break;
	case 'roleset':
		member = msg.mentions.members.first();
		msg.reply(member.roles.cache.map(user => user));
		msg.reply(member.roles.cache.map(user => user));
		break;
	}
});

async function getMeme() {
	const res = await axios.get('https://memeapi.pythonanywhere.com/');
	return res.data.memes[0].url;
}

// make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); // login bot using token
