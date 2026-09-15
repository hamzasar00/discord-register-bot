const { EmbedBuilder } = require('discord.js');
const { Footer } = global.client.settings;

/**
 * @param { String } authorName
 * @param { String } authorAvatar
 * @param { String } description
 * @param { String } footer
 * @param { String } color
 */

class LegacyEmbed extends EmbedBuilder {
	setAuthor(name, iconURL) {
		if (typeof name === 'object') return super.setAuthor(name);
		if (!name || name === 'false') return this;
		return super.setAuthor({ name: String(name), iconURL: iconURL || undefined });
	}

	setFooter(text, iconURL) {
		if (typeof text === 'object') return super.setFooter(text);
		if (text === '') {
			delete this.data.footer;
			return this;
		}
		if (!text || text === 'false') return this;
		return super.setFooter({ text: String(text), iconURL: iconURL || undefined });
	}

	setColor(color) {
		return super.setColor(color === 'RANDOM' ? 'Random' : color);
	}
}

module.exports = (authorName, authorAvatar, description, footer = Footer, color = 'RANDOM') => {
	const Embed = new LegacyEmbed();

	if (authorName) Embed.setAuthor(authorName, authorAvatar);
	if (description) Embed.setDescription(description);
	if (footer) Embed.setFooter(footer);
	if (color) Embed.setColor(color);

	return Embed;
};