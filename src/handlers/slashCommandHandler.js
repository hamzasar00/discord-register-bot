const { client } = global;
const { EmbedBuilder, Events } = require('discord.js');
const slashCommands = require('./slashCommands.js');
const messageHandler = require('../events/message.js');
const { mark, cross } = require('../configs/emojis.json');

const getOptions = (interaction) => {
    const values = {};
    for (const item of interaction.options.data) values[item.name] = item.value;
    return values;
};

const buildArgs = (slashName, values) => {
    if (['erkek', 'kadin', 'family', 'isimler', 'vip', 'kayitlog', 'kayitsizlog', 'viplog'].includes(slashName)) {
        return values.uye ? [values.uye] : [];
    }
    if (slashName === 'isim') return [values.uye, values.isim, String(values.yas)];
    if (slashName === 'kayitsiz') return [values.uye, values.sebep].filter(value => value !== undefined);
    if (slashName === 'kayitbilgi') return [String(values.sira)];
    if (slashName === 'eval') return [values.kod];
    if (slashName === 'stats') {
        if (values.uye) return [values.uye, values.donem].filter(value => value !== undefined);
        return values.donem ? [values.donem] : [];
    }
    if (slashName === 'top') {
        if (values.donem) {
            return [values.donem, values.sayi === undefined ? undefined : String(values.sayi)]
                .filter(value => value !== undefined);
        }
        return values.sayi === undefined ? [] : [String(values.sayi)];
    }
    if (['rolsuz', 'tagli'].includes(slashName)) {
        return values.islem && values.islem !== 'bilgi' ? [values.islem] : [];
    }
    return [];
};

const toDiscordPayload = (payload, options = {}) => {
    if (payload === undefined || payload === null) return { content: 'İşlem tamamlandı.' };
    if (typeof payload === 'string') {
        return options.code
            ? { content: `\`\`\`${options.code}\n${payload.slice(0, 1900)}\n\`\`\`` }
            : { content: payload };
    }
    if (payload instanceof Error) {
        return { content: `\`\`\`js\n${(payload.stack || payload.message).slice(0, 1900)}\n\`\`\`` };
    }
    if (payload instanceof EmbedBuilder) return { embeds: [payload] };
    return payload;
};

const createSlashChannel = (interaction) => {
    let originalUsed = false;
    const channel = interaction.channel;

    const send = async (payload, options) => {
        if (!originalUsed) {
            originalUsed = true;
            return interaction.editReply(toDiscordPayload(payload, options));
        }
        return channel.send(toDiscordPayload(payload, options));
    };

    const sendStatus = (message, text, options = {}, emoji) => {
        return send(text).then(async sent => {
            if (options.react && emoji && sent && sent.react) await sent.react(emoji).catch(() => {});
            if (options.timeout && sent && sent.delete) {
                setTimeout(() => sent.delete().catch(() => {}), Number(options.timeout));
            }
            return sent;
        }).catch(() => undefined);
    };

    return {
        type: 'text',
        id: channel && channel.id,
        guild: interaction.guild,
        get hasResponded() {
            return originalUsed;
        },
        send,
        success: (message, text, options) => sendStatus(message, text, options, mark),
        error: (message, text, options) => sendStatus(message, text, options, cross),
        toString: () => channel ? channel.toString() : '#bilinmeyen-kanal',
    };
};

const createMessageAdapter = async (interaction, definition, values) => {
    const targetMember = values.uye
        ? interaction.options.getMember('uye')
            || await interaction.guild.members.fetch(values.uye).catch(() => undefined)
        : undefined;
    const args = buildArgs(definition.name, values);
    const slashChannel = createSlashChannel(interaction);

    return {
        content: `${client.settings.Prefix}${definition.command}${args.length ? ` ${args.join(' ')}` : ''}`,
        slashCommandName: definition.command,
        slashArgs: args,
        author: interaction.user,
        member: interaction.member,
        guild: interaction.guild,
        channel: slashChannel,
        mentions: {
            members: {
                first: () => targetMember,
            },
        },
        react: async () => undefined,
        delete: async () => undefined,
        reply: payload => slashChannel.send(payload),
    };
};

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const definition = slashCommands.find(command => command.name === interaction.commandName);
    if (!definition) return;

    try {
        await interaction.deferReply();
        const values = getOptions(interaction);
        const message = await createMessageAdapter(interaction, definition, values);
        await messageHandler(message);

        if (!message.channel.hasResponded) {
            await interaction.editReply({ content: 'Bu komut için herhangi bir işlem yapılmadı.' });
        }
    } catch (error) {
        console.error(`[SLASH] /${interaction.commandName} failed:`, error);
        const payload = { content: 'Komut çalıştırılırken beklenmeyen bir hata oluştu.' };
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply(payload).catch(() => {});
        } else {
            await interaction.reply({ ...payload, ephemeral: true }).catch(() => {});
        }
    }
});

module.exports = slashCommands;