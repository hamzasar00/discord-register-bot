const moment = require('moment');
moment.locale('tr');

module.exports = {

	name: 'eval',
	aliases: ['evaluate', 'vortex'],
	category: 'Developer',
	usage: '<Code>',
	developer: true,

	/**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   * @param { MessageEmbed } Embed
   */

	async execute(client, message, args) {

		if (!args[0]) return message.channel.error(message, 'Kod belirtilmedi', { timeout: 8000, reply: true });
		const code = args.join(' ');
		if(message.guild) message.delete({ reason: 'eval' }).catch(() => {});
		function clean(text) {

			if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 });
			text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
			return text;

		}

		try {

			const evaled = clean(await eval(code));
			if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, 'Secret Information');
			message.channel.send(`${evaled.replace(client.token, 'Secret Information')}`, { code: 'js', split: true });

		}
		catch(err) { message.channel.send(err, { code: 'js', split: true }); }

	},
};