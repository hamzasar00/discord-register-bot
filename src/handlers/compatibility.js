const {
	DMChannel,
	EmbedBuilder,
	GuildMember,
	Message,
	PermissionFlagsBits,
	TextChannel,
} = require('discord.js');

const legacyPermissions = {
	ADMINISTRATOR: PermissionFlagsBits.Administrator,
	MANAGE_ROLES: PermissionFlagsBits.ManageRoles,
};

GuildMember.prototype.hasPermission = function(permission) {
	if (permission === 8) return this.permissions.has(PermissionFlagsBits.Administrator);
	return this.permissions.has(legacyPermissions[permission] || permission);
};

const normalizePayload = (payload, options = {}) => {
	if (payload instanceof EmbedBuilder) return { embeds: [payload] };
	if (payload instanceof Error) {
		const errorText = payload.stack || payload.message || String(payload);
		return { content: `\`\`\`js\n${errorText.slice(0, 1900)}\n\`\`\`` };
	}
	if (options.code && typeof payload === 'string') {
		return { content: `\`\`\`${options.code}\n${payload.slice(0, 1900)}\n\`\`\`` };
	}
	return payload;
};

const patchSend = (ChannelClass) => {
	const originalSend = ChannelClass.prototype.send;
	ChannelClass.prototype.send = function(payload, options) {
		return originalSend.call(this, normalizePayload(payload, options));
	};
};

patchSend(TextChannel);
patchSend(DMChannel);

const originalEdit = Message.prototype.edit;
Message.prototype.edit = function(payload) {
	return originalEdit.call(this, normalizePayload(payload));
};

const originalDelete = Message.prototype.delete;
Message.prototype.delete = function(options) {
	if (options && options.timeout) {
		setTimeout(() => originalDelete.call(this).catch(() => {}), Number(options.timeout));
		return Promise.resolve(this);
	}
	return originalDelete.call(this);
};

const originalCollector = Message.prototype.createReactionCollector;
Message.prototype.createReactionCollector = function(filterOrOptions, legacyOptions) {
	if (typeof filterOrOptions === 'function') {
		return originalCollector.call(this, { ...legacyOptions, filter: filterOrOptions });
	}
	return originalCollector.call(this, filterOrOptions);
};

module.exports = { normalizePayload };