module.exports = {
	name: 'help',
	aliases: ['yardım', 'komutlar'],
	staff: true,
	guildOnly: true,
	cooldown: 5,

	/**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

	execute(client, message, args, Embed) {

		const commandLabel = (command) => {
			const slashCommand = client.slashCommands && client.slashCommands.find(item => item.command === command.name);
			return slashCommand ? `/${slashCommand.name}` : `${client.settings.Prefix}${command.name}`;
		};

		Embed.setDescription(`
**Admin Komutları**
\`${client.commands.filter(command => command.category && command.category == 'Admin').map(command => commandLabel(command)).join('\n')}\`

**Kayıt Komutları**
\`${client.commands.filter(command => command.category && command.category == 'Kayıt').map(command => commandLabel(command)).join('\n')}\`

**Yetkili Komutları**
\`${client.commands.filter(command => command.category && command.category == 'Yetkili').map(command => commandLabel(command)).join('\n')}\`
        `);

		message.channel.success(message, Embed.setFooter(`${client.settings.Footer} • ${message.author.username} tarafından istendi`), { react: true });

	},
};