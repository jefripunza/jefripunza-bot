const day_count = (timestamp_awal, timestamp_akhir) => Math.ceil(Math.abs(timestamp_awal - timestamp_akhir) / (1000 * 60 * 60 * 24));

function calculate_age(timestamp) {
    var diff_ms = Date.now() - timestamp;
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

function listYear(start_at) {
    const now = new Date(),
        now_tahun = now.getFullYear(),
        jarak_tahun = start_at === now_tahun ? 1 : now_tahun - start_at;
    let tahun = [];
    for (let i = 0; i < jarak_tahun; i++) {
        tahun.push(start_at + i);
    }
    return tahun.reverse();
}

function listMonth() {
    let bulan = [];
    for (let i = 0; i < 12; i++) {
        bulan.push(bulan_indo(i + 1));
    }
    return bulan;
}

const getTime = () => {
    return parseInt(Date.now())
};

function weekAndDay(date) {
    var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
        prefixes = ['Pertama', 'Kedua', 'Ketiga', 'Keempat', 'Kelima'];
    return {
        text: days[date.getDay()] + ' ' + prefixes[Math.floor(date.getDate() / 7)],
        day: date.getDay(),
        week: Math.floor(date.getDate() / 7),
    };
}

module.exports = {
    day_count,
    calculate_age,
    listYear,
    listMonth,
    getTime,
    weekAndDay,
}