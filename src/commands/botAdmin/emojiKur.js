const { writeFile } = require('fs/promises');
const { systemEmojis } = global.client;
const emojis = require('../../configs/emojis.json');

module.exports = {
	name: 'emojikur',
	aliases: ['emoji-kur'],
	category: 'Developer',
	developer: true,

	/**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     */

	async execute(client, message, args) {

		const msg = await message.channel.send(`**Sistem emojileri kurulmaya başladı** ${emojis.loading ? emojis.loading : ''}`);
		const missingEmojis = systemEmojis.filter(systemEmoji => !emojis[systemEmoji.emojiName]);

		for (const systemEmoji of missingEmojis) {
			const currentEmoji = message.guild.emojis.cache.find(emoji => emoji.name === systemEmoji.emojiName);

			if (currentEmoji) {
				emojis[systemEmoji.emojiName] = currentEmoji.toString();
				continue;
			}

			await client.wait(250);
			const emoji = await message.guild.emojis.create({
				attachment: systemEmoji.emojiUrl,
				name: systemEmoji.emojiName,
			});
			emojis[emoji.name] = emoji.toString();
		}

		await writeFile('./src/configs/emojis.json', JSON.stringify(emojis, null, 2));
		await msg.edit(`**Sistem emojileri başarıyla kuruldu ${emojis.success || ''}**`);

	},
};