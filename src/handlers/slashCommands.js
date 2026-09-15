const STRING = 3;
const INTEGER = 4;
const USER = 6;

const option = (type, name, description, required = false, choices) => {
	const data = { type, name, description, required };
	if (choices) data.choices = choices.map(([choiceName, value]) => ({ name: choiceName, value }));
	return data;
};

const target = (required = true) => option(USER, 'uye', 'İşlem yapılacak üye', required);
const periodChoices = [
	['Günlük', 'günlük'],
	['Haftalık', 'haftalık'],
	['Aylık', 'aylık'],
	['Tüm zamanlar', 'tümzamanlar'],
];

module.exports = [
	{ name: 'emojikur', command: 'emojikur', description: 'Sistem emojilerini sunucuya kurar' },
	{ name: 'eval', command: 'eval', description: 'Bot sahibi için kod çalıştırır', options: [option(STRING, 'kod', 'Çalıştırılacak kod', true)] },
	{ name: 'ping', command: 'ping', description: 'Bot gecikmesini gösterir' },
	{ name: 'reload', command: 'reload', description: 'Botu yeniden başlatır' },
	{ name: 'uptime', command: 'uptime', description: 'Botun çalışma süresini gösterir' },
	{ name: 'girisbilgi', command: 'girişbilgi', description: 'Sunucu giriş istatistiklerini gösterir' },
	{ name: 'kayitbilgi', command: 'kayıtbilgi', description: 'Sıra numarasına göre kayıt bilgisini gösterir', options: [option(INTEGER, 'sira', 'Kayıt sıra numarası', true)] },
	{ name: 'kayitlog', command: 'kayıtlog', description: 'Üyenin kayıt geçmişini gösterir', options: [target(false)] },
	{ name: 'kayitsizlog', command: 'kayıtsızlog', description: 'Üyenin kayıtsıza atılma geçmişini gösterir', options: [target(false)] },
	{ name: 'ortalamayas', command: 'ortalamayaş', description: 'Kayıtların yaş ortalamasını gösterir' },
	{
		name: 'rolsuz',
		command: 'rolsüz',
		description: 'Rolsüz üyeleri gösterir veya kayıtsız rolü verir',
		options: [option(STRING, 'islem', 'Yapılacak işlem', false, [['Bilgi göster', 'bilgi'], ['Rolleri ver', 'ver']])],
	},
	{
		name: 'tagli',
		command: 'taglı',
		description: 'Taglı üyeleri yönetir',
		options: [option(STRING, 'islem', 'Yapılacak işlem', false, [['Bilgi göster', 'bilgi'], ['Rol ver', 'ver'], ['Rol al', 'al']])],
	},
	{ name: 'viplog', command: 'viplog', description: 'Üyenin VIP geçmişini gösterir', options: [target(false)] },
	{ name: 'erkek', command: 'erkek', description: 'Üyeyi erkek olarak kaydeder', options: [target()] },
	{
		name: 'isim',
		command: 'isim',
		description: 'Üyenin isim ve yaşını ayarlar',
		options: [
			target(),
			option(STRING, 'isim', 'Üyenin adı', true),
			option(INTEGER, 'yas', 'Üyenin yaşı', true),
		],
	},
	{ name: 'kadin', command: 'kadın', description: 'Üyeyi kadın olarak kaydeder', options: [target()] },
	{
		name: 'kayitsiz',
		command: 'kayıtsız',
		description: 'Üyeyi kayıtsıza atar',
		options: [target(), option(STRING, 'sebep', 'İşlem sebebi', false)],
	},
	{ name: 'family', command: 'family', description: 'Üyeye ekip rolü verir', options: [target()] },
	{ name: 'help', command: 'help', description: 'Kullanılabilir komutları gösterir' },
	{ name: 'isimler', command: 'isimler', description: 'Üyenin isim geçmişini gösterir', options: [target()] },
	{
		name: 'stats',
		command: 'stats',
		description: 'Yetkili kayıt istatistiklerini gösterir',
		options: [
			target(false),
			option(STRING, 'donem', 'İstatistik dönemi', false, periodChoices),
		],
	},
	{
		name: 'top',
		command: 'top',
		description: 'Kayıt sıralamasını gösterir',
		options: [
			option(STRING, 'donem', 'Sıralama dönemi', false, periodChoices),
			option(INTEGER, 'sayi', 'Gösterilecek kişi sayısı', false),
		],
	},
	{ name: 'vip', command: 'vip', description: 'Üyeye VIP rolü verir', options: [target()] },
];